import type { ModeratorDataType } from "@BrainlyReq/LiveModerationFeed";
import { QuickActionButtonsForQuestion } from "@components";
import CreateElement from "@components/CreateElement";
import HideElement from "@root/helpers/HideElement";
import { Avatar, Flex, Icon, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FeedModerationClassType from "../FeedModeration";

export default class Question {
  private author: {
    databaseId: number;
    nick: string;
  };

  actionButtonsContainer: FlexElementType;
  deleted: boolean;
  private gridContainer: HTMLDivElement;
  moderatorInfoContainer: FlexElementType;

  private quickActionButtons: QuickActionButtonsForQuestion;

  constructor(
    private main: FeedModerationClassType,
    public questionId: number,
    private container: HTMLDivElement,
  ) {
    this.FindAuthor();
    this.FindGridContainer();
    this.BindListeners();
  }

  FindAuthor() {
    const profileLinkAnchor: HTMLAnchorElement = this.container.querySelector(
      ".brn-feed-item__avatar .sg-avatar > a",
    );

    if (!profileLinkAnchor)
      throw Error("Can't find authors profile link element");

    this.author = {
      databaseId: System.ExtractId(profileLinkAnchor.href),
      nick: profileLinkAnchor.title,
    };
  }

  private FindGridContainer() {
    this.gridContainer = this.container.querySelector<HTMLDivElement>(
      ":scope > div > .brn-feed-item",
    );

    if (!this.gridContainer) {
      throw Error("Can't find feed item grid container");
    }
  }

  BindListeners() {
    this.container.addEventListener(
      "mouseleave",
      this.HideActionButtons.bind(this),
    );
    this.container.addEventListener(
      "mouseenter",
      this.ShowActionButtons.bind(this),
    );
    this.container.addEventListener(
      "touchstart",
      this.ShowActionButtons.bind(this),
    );
  }

  HideActionButtons() {
    if (this.quickActionButtons.moderating) return;

    this.main.focusedQuestion = null;

    HideElement(this.actionButtonsContainer);
  }

  ShowActionButtons() {
    if (this.main.focusedQuestion && this.main.focusedQuestion !== this) {
      this.main.focusedQuestion.HideActionButtons();
    }

    this.main.focusedQuestion = this;

    if (this.deleted) return;

    if (!this.quickActionButtons) {
      this.InitQuickActionButtons();
    }

    this.container.prepend(this.actionButtonsContainer);
  }

  InitQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForQuestion({
      vertical: true,
      content: {
        databaseId: this.questionId,
        author: this.author,
      },
      containerProps: {
        className: "ext-action-buttons__container",
      },
      onDelete: this.Deleted.bind(this),
      onModerate: this.Moderate.bind(this),
      moreButton: true,
    });

    this.actionButtonsContainer = Flex({
      relative: true,
      children: this.quickActionButtons.container,
    });
  }

  async Moderate() {
    await this.main.moderatePanelController.Moderate(this);
    this.quickActionButtons.NotModerating();
  }

  Deleted() {
    this.deleted = true;

    this.actionButtonsContainer.remove();
    this.container.classList.add("deleted");

    this.quickActionButtons = null;
  }

  TicketReserved(moderator: ModeratorDataType) {
    if (!this.moderatorInfoContainer) {
      this.RenderModeratorInfoContainer();
    } else {
      this.moderatorInfoContainer.innerHTML = "";
    }

    const nickContainer = Flex({
      marginRight: "xs",
      alignItems: "center",
      children: Text({
        tag: "a",
        size: "small",
        href: System.createProfileLink(moderator),
        children: moderator.nick,
        weight: "bold",
      }),
    });

    const avatarContainer = Flex({
      relative: true,
      children: [
        new Avatar({
          size: "xs",
          imgSrc: moderator?.avatar,
          title: moderator.nick,
          alt: moderator.nick,
        }),
        CreateElement({
          tag: "div",
          className: "brn-answering-user__dot-container",
          children: new Icon({
            size: 24,
            color: "blue",
            type: "ext-shield",
          }),
        }),
      ],
    });

    this.moderatorInfoContainer.append(nickContainer, avatarContainer);
  }

  RenderModeratorInfoContainer() {
    this.moderatorInfoContainer = Flex({
      tag: "div",
      marginTop: "xxs",
      marginRight: "xs",
      className: "brn-feed-item__moderator-info",
    });

    this.gridContainer.append(this.moderatorInfoContainer);
  }
}
