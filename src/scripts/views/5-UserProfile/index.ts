/* eslint-disable no-new */
import Action from "@BrainlyAction";
import { GetUserCommentsPage } from "@BrainlyReq";
import { CommonGenericResponseType } from "@BrainlyReq/Brainly";
import { Breadcrumb } from "@components";
import CreateElement from "@components/CreateElement";
import UserBio from "@components/UserBio";
import UserHat from "@components/UserHat";
import UserNoteBox from "@components/UserNoteBox";
import Build from "@root/helpers/Build";
import InsertAfter from "@root/helpers/InsertAfter";
import IsVisible from "@root/helpers/IsVisible";
import WaitForElement from "@root/helpers/WaitForElement";
import ServerReq, { UserDetailsType } from "@ServerReq";
import {
  ActionList,
  ActionListHole,
  Flex,
  SeparatorHorizontal,
  Text,
} from "@style-guide";
import { FlexElementType } from "@style-guide/Flex";
import AccountDeleteReporter from "./_/AccountDeleteReporter";
import ContentModeration from "./_/ContentModeration/ContentModeration";
import FriendsManager from "./_/FriendsManager";
import MorePanel from "./_/MorePanel";
import RankManager from "./_/RankManager";
import UserWarningsList from "./_/UserWarningsList";

type ProfileDataType = {
  id: number;
  nick: string;
};

System.pageLoaded("User Profile inject OK!");

function MakeProfileMorePanelAlwaysVisible() {
  const panel = document.querySelector("#profile-mod-panel");
  const showMoreButton = panel.previousElementSibling;

  if (!panel) return;

  if (!IsVisible(panel, true) && showMoreButton instanceof HTMLSpanElement)
    showMoreButton.click();
}

function HideDeleteOptions() {
  let query =
    `#DelUserReason, span[id^="DelUserReasonsShort"]:first-child, ` +
    `input[id^="DelUser"]:not([id$="_"])`;

  if (!System.checkBrainlyP([141, 142]) && !System.checkUserP(36))
    query += `, form[action^="/admin/users/delete_"]:not([action$="avatar"])`;

  const elements = document.querySelectorAll(query);

  if (elements.length === 0) return;

  elements.forEach(element => {
    if (element.parentElement)
      element.parentElement.classList.add("always-hidden");
  });
}

export default class UserProfile {
  mainRight: HTMLElement;
  promise: {
    profile: Promise<any>;
    extension: Promise<CommonGenericResponseType<{ data: UserDetailsType }>>;
    moderators: Promise<any>;
  };

  profileData: ProfileDataType;
  infoBottomList: HTMLDivElement;
  infoSection: FlexElementType;
  morePanel: MorePanel;
  extensionUser: UserDetailsType;
  noteSection: HTMLDivElement;
  $noteContainer: JQuery<HTMLElement>;
  brainlyUser: any;
  contentModeration?: ContentModeration;

  constructor() {
    this.Init();
  }

  async Init() {
    try {
      this.mainRight = await WaitForElement("#main-right");

      this.GetProfileData();

      this.promise = {
        profile: new Action().GetUserProfile(this.profileData.id),
        extension: new ServerReq().GetUser(this.profileData),
        moderators: Promise.resolve(), // new ServerReq().GetAllModerators(),
      };

      this.FixInfoBottom();
      this.LoadComponents();
    } catch (error) {
      console.error(error);
    }
  }

  GetProfileData() {
    const data = window.profileData as ProfileDataType;

    if (!data || !data.id || !data.nick)
      throw Error("Can't find the profile data of user");

    this.profileData = data;
  }

  FixInfoBottom() {
    const contentOld = document.getElementById("content-old");

    contentOld.id += "2";

    const infoBottom = document.querySelector(".info_bottom");

    if (!infoBottom) throw Error("info_bottom element cannot be found");

    this.infoBottomList = ActionList({
      direction: "space-between",
    });

    Array.from(infoBottom.children).forEach(children => {
      const hole = ActionListHole({
        children,
      });

      this.infoBottomList.append(hole);
    });

    infoBottom.after(this.infoBottomList);
    infoBottom.remove();
  }

  LoadComponents() {
    new UserWarningsList(this);
    this.morePanel = new MorePanel(this);

    MakeProfileMorePanelAlwaysVisible();
    HideDeleteOptions();

    new AccountDeleteReporter();

    this.RenderCommentsCount();
    this.RenderFriendsManager();
    this.RenderProfileInfoSection();
    this.LoadComponentsAfterExtensionResolve();
    this.LoadComponentsAfterBrainlyResolve();
    this.LoadComponentsAfterModeratorsResolved();
    this.LoadComponentsAfterAllResolved();
  }

  private async RenderCommentsCount() {
    const numberOfAnswersContainer = document.querySelector(
      "#main-left > .personal_info > .mod-profile-panel > .fright",
    );

    if (
      !(numberOfAnswersContainer?.firstElementChild instanceof HTMLSpanElement)
    )
      return;

    const numberOfAnswers =
      numberOfAnswersContainer.firstElementChild.innerText;

    numberOfAnswersContainer.firstElementChild.remove();
    numberOfAnswersContainer.append(
      CreateElement({
        tag: "span",
        className: "orange",
        children: CreateElement({
          tag: "a",
          href: `/users/user_content/${this.profileData.id}/responses`,
          children: numberOfAnswers,
        }),
      }),
    );

    const resCommentsPage = await GetUserCommentsPage(this.profileData.id);

    const numberOfComments = resCommentsPage.match(
      /(?<=:<\/b> ).*?(?=<\/p>)/i,
    )?.[0];

    if (numberOfComments === undefined || numberOfComments === null) return;

    const container = CreateElement({
      tag: "span",
      className: "fright",
      children: [
        `${System.data.locale.userProfile.comments}: `,
        CreateElement({
          tag: "span",
          className: "orange",
          children: CreateElement({
            tag: "a",
            href: `/users/user_content/${this.profileData.id}/comments_tr`,
            children: numberOfComments,
          }),
        }),
      ],
    });

    const fragment = document.createDocumentFragment();

    fragment.append(CreateElement({ tag: "br" }), container);

    InsertAfter(fragment, numberOfAnswersContainer);
  }

  RenderFriendsManager() {
    if (Number(window.myData.id) === Number(this.profileData.id))
      FriendsManager();
  }

  RenderProfileInfoSection() {
    this.infoSection = Flex({ direction: "column" });

    const personalInfo = document.body.querySelector(
      "#main-left > div.personal_info > div.clear",
    );

    personalInfo?.after(this.infoSection);
  }

  async LoadComponentsAfterExtensionResolve() {
    const resUser = await this.promise.extension;

    if (!resUser.success) throw Error("User can't passed to extension server");

    this.extensionUser = resUser.data;

    if (!this.extensionUser) return;

    this.RenderNoteSection();
    this.RenderPreviousNicks();
    this.morePanel.ShowPermissionStatus();
    this.morePanel.RenderSectionsAfterExtensionResolved();

    this.contentModeration = new ContentModeration();
  }

  RenderNoteSection() {
    this.noteSection = UserNoteBox(this.extensionUser);
    this.$noteContainer = $(`
		<div class="userNoteContainer">
			<h3 class="bold dark_grey" title="${System.data.locale.common.personalNote.title}">${System.data.locale.common.personalNote.text}</h3>
		</div>`);

    this.$noteContainer.append(this.noteSection);
    this.$noteContainer.prependTo(this.mainRight);
  }

  RenderPreviousNicks() {
    const { previousNicks } = this.extensionUser;

    if (!previousNicks?.length) return;

    const container = Build(
      Flex({
        marginTop: "m",
        marginBottom: "s",
      }),
      [
        [
          Flex({ marginRight: "xs" }),
          Text({
            noWrap: true,
            size: "small",
            weight: "bold",
            children: `${System.data.locale.userProfile.previousNicks.text}: `,
          }),
        ],
        new Breadcrumb({
          inlineItems: true,
          padding: "m",
          elements: previousNicks
            .map(nick => {
              const simplifiedNick = nick
                ?.substring(0, 50)
                .replace(/\n|\s{2,}/g, " ")
                .replace(/\.{2,}/g, "")
                .trim();

              if (!simplifiedNick) return undefined;

              return Text({
                tag: "span",
                size: "small",
                title: nick,
                innerText: simplifiedNick,
              });
            })
            .filter(Boolean),
        }),
      ],
    );

    this.infoSection.append(container);
  }

  async LoadComponentsAfterBrainlyResolve() {
    const res = await this.promise.profile;

    if (!res || !res.success || !res.data) {
      console.error("Data is not correct: ", res);

      return;
    }

    this.brainlyUser = res.data;

    this.RenderUserBio();
    // eslint-disable-next-line no-new
    new RankManager(res.data);
  }

  RenderUserBio() {
    if (
      !this.brainlyUser.description &&
      Number(window.myData.id) !== Number(this.profileData.id)
    )
      return;

    const userBio = new UserBio(
      this.brainlyUser.description,
      Number(window.myData.id) === Number(this.profileData.id),
    );

    if (this.extensionUser.previousNicks?.length > 0)
      this.infoSection.append(SeparatorHorizontal());

    this.infoSection.append(userBio.container);
  }

  async LoadComponentsAfterModeratorsResolved() {
    await this.promise.moderators;

    this.morePanel.RenderSectionsAfterModeratorsResolved();
  }

  async LoadComponentsAfterAllResolved() {
    await Promise.all([this.promise.extension, this.promise.profile]);

    if (this.extensionUser && this.brainlyUser) {
      this.morePanel.RenderSectionsAfterAllResolved();

      if (this.extensionUser.probatus) {
        this.RenderUserHat();
      }
    }
  }

  RenderUserHat() {
    const $img = UserHat(this.brainlyUser.gender);

    $img.prependTo("#main-left > div.personal_info");
  }

  /**
   * @param {HTMLElement} element
   */
  // eslint-disable-next-line class-methods-use-this
  HideElement(element) {
    if (!IsVisible(element)) return;

    element.parentElement.removeChild(element);
  }
}

// eslint-disable-next-line no-new
new UserProfile();
