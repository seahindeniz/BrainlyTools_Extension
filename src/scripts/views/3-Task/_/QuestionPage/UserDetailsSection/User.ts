import { GetProfilePage } from "@BrainlyReq";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Text as TextComponent,
} from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { TextElement } from "@style-guide/Text";
import MoreSection from "./MoreSection";
import type UserDetailsSectionClassType from "./UserDetailsSection";

interface BanDetailsType {
  banType: string;
  link: string;
  nick: string;
}

export interface UserDataType {
  nick: string;
  id: number;
  avatar: string;
}

export default class User {
  container: Box;
  private moreSection?: MoreSection;
  private spinner: HTMLDivElement;
  private userDetailContainer: FlexElementType;
  activeBanDetails?: BanDetailsType;
  private warningCount: string;
  private banCount: string;
  profilePageHTML: string;
  profilePagePromise: Promise<void>;
  private warningStatusText: Text;
  private warningStatusContainer: TextElement<"div">;
  private bannedByContainer: TextElement<"div">;
  private banTypeContainer: TextElement<"div">;
  private moreButtonContainer: FlexElementType;
  private detailContainer: FlexElementType;
  banCountContainer: TextElement<"div">;
  banCountText: Text;

  constructor(
    private main: UserDetailsSectionClassType,
    public data: UserDataType,
  ) {
    this.moreSection = new MoreSection(this);

    this.Init();
  }

  async Init() {
    this.Render();

    this.profilePagePromise = this.FetchProfileDetails();

    await this.profilePagePromise;

    this.moreSection?.InitActionsAfterUserProfileFetched();
    this.RenderWarningStatus();
    this.RenderBanCount();
    this.RenderActiveBanDetails();
  }

  private Render() {
    if (this.container) return;

    const profileLink = System.createProfileLink(this.data);

    this.container = Build(
      new Box({
        padding: "xxs",
        border: false,
      }),
      [
        [
          Flex(),
          [
            [
              Flex({ marginRight: "s" }),
              new Avatar({
                size: "m",
                link: profileLink,
                target: "_blank",
                imgSrc: this.data.avatar,
              }),
            ],
            [
              (this.detailContainer = Flex({
                grow: true,
                alignItems: "center",
              })),
              [
                [
                  (this.userDetailContainer = Flex({
                    grow: true,
                    direction: "column",
                  })),
                  [
                    TextComponent({
                      tag: "a",
                      target: "_blank",
                      href: profileLink,
                      weight: "bold",
                      breakWords: true,
                      children: this.data.nick,
                    }),
                    (this.spinner = Spinner({
                      size: "xxsmall",
                    })),
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    );

    this.main.usersContainer.append(this.container.element);
  }

  private async FetchProfileDetails() {
    try {
      const profilePageReq = GetProfilePage(this.data.id);

      this.profilePageHTML = await profilePageReq;

      this.ParseWarningCount();
      this.ParseBanCount();
      this.ParseBanDetails();
    } catch (error) {
      console.error(error);
    }

    this.HideSpinner();
  }

  private HideSpinner() {
    HideElement(this.spinner);
  }

  private ParseWarningCount() {
    // https://regex101.com/r/yF77qP/1
    this.warningCount = this.profilePageHTML.match(
      /(?<=\/users\/view_user_warns\/.*?)\d+(?=<)/,
    )?.[0];

    // console.log("warningCount", this.warningCount);
  }

  private ParseBanCount() {
    // https://regex101.com/r/2KnREl/1
    this.banCount = this.profilePageHTML.match(
      /(?<=<span class="fright">.*?:<span class="orange"> ?)\d+(?=<)/,
    )?.[0];

    // console.log("banCount", this.banCount);
  }

  private ParseBanDetails() {
    // https://regex101.com/r/YALcOz/2
    const banDetailMatch = this.profilePageHTML.match(
      /<\/li>\n<li>.*?orange">(?<banType>.*?)<\/span><\/li>\n.*?<a href="(?<link>.*?)">(?<nick>.*?)<\/a>/,
    );

    if (banDetailMatch?.length > 0) {
      this.activeBanDetails = banDetailMatch.groups as any;
    }

    // console.log("banDetails", banDetailMatch);
  }

  private RenderWarningStatus() {
    if (!this.warningCount) return;

    if (!this.warningStatusContainer) {
      this.RenderWarningStatusContainer();
    }

    this.warningStatusText.nodeValue = this.warningCount;
  }

  private RenderWarningStatusContainer() {
    this.warningStatusText = document.createTextNode("");

    this.warningStatusContainer = TextComponent({
      tag: "div",
      size: "xsmall",
      children: [
        `${System.data.locale.common.warnings}: `,
        TextComponent({
          tag: "a",
          size: "xsmall",
          weight: "bold",
          color: "peach-dark",
          target: "_blank",
          href: `/users/view_user_warns/${this.data.id}`,
          children: this.warningStatusText,
        }),
      ],
    });

    this.userDetailContainer.append(this.warningStatusContainer);
  }

  private RenderBanCount() {
    if (!this.banCount) return;

    if (!this.banCountContainer) {
      this.RenderBanCountContainer();
    }

    this.banCountText.nodeValue = this.banCount;
  }

  private RenderBanCountContainer() {
    this.banCountText = document.createTextNode("");

    this.banCountContainer = TextComponent({
      tag: "div",
      size: "xsmall",
      children: [
        `${System.data.locale.common.bans}: `,
        TextComponent({
          tag: "span",
          size: "xsmall",
          weight: "bold",
          color: "peach-dark",
          children: this.banCountText,
        }),
      ],
    });

    this.userDetailContainer.append(this.banCountContainer);
  }

  private RenderActiveBanDetails() {
    if (!this.activeBanDetails) {
      HideElement(this.banTypeContainer);
      HideElement(this.bannedByContainer);

      this.banTypeContainer = null;

      return;
    }

    if (!this.banTypeContainer) {
      this.RenderActiveBanDetailsContainer();
    }

    this.bannedByContainer.append(
      `${System.data.locale.common.banUser.appliedBy}: `,
      TextComponent({
        color: "blue-dark",
        size: "xsmall",
        weight: "bold",
        tag: "a",
        href: this.activeBanDetails.link,
        target: "_blank",
        children: this.activeBanDetails.nick,
      }),
    );
  }

  private RenderActiveBanDetailsContainer() {
    this.userDetailContainer.append(
      (this.banTypeContainer = TextComponent({
        tag: "div",
        size: "xsmall",
        children: [
          `${System.data.locale.common.banUser.currentBan}: `,
          TextComponent({
            tag: "span",
            size: "xsmall",
            weight: "bold",
            color: "peach-dark",
            children: this.activeBanDetails.banType,
          }),
        ],
      })),
      (this.bannedByContainer = TextComponent({
        tag: "div",
        size: "xsmall",
      })),
    );
  }

  private ToggleMoreSection() {
    if (IsVisible(this.moreSection?.container)) {
      this.HideMoreSection();
    } else {
      this.ShowMoreSection();
    }
  }

  HideMoreSection() {
    this.main.lastInteractedUser = null;

    this.moreSection.Hide();
    this.container.ChangeBorderColor();
  }

  private ShowMoreSection() {
    if (this.main.lastInteractedUser) {
      if (this.main.lastInteractedUser === this) return;

      this.main.lastInteractedUser.HideMoreSection();
    }

    this.main.lastInteractedUser = this;

    this.moreSection?.Show();
    this.container.ChangeBorderColor("gray-secondary-ultra-light");
  }

  ShowMoreButton() {
    if (IsVisible(this.moreButtonContainer)) return;

    if (!this.moreButtonContainer) {
      this.RenderMoreButton();
    }

    this.detailContainer.append(this.moreButtonContainer);
  }

  HideMoreButton() {
    HideElement(this.moreButtonContainer);
  }

  RenderMoreButton() {
    this.moreButtonContainer = Flex({
      marginLeft: "s",
      children: new Button({
        size: "s",
        // type: "solid-light",
        type: "outline",
        toggle: "gray",
        iconOnly: true,
        icon: new Icon({
          type: "more",
        }),
        onClick: this.ToggleMoreSection.bind(this),
      }),
    });
  }
}
