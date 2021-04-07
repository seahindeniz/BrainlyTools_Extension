import { QuickActionButtonsForQuestion } from "@components";
import HideElement from "@root/helpers/HideElement";
import type ContentModerationClassType from "./ContentModeration";

export default class Question {
  questionId: number;
  private author: {
    nick: string;
    databaseId: number;
  };

  private deleted: boolean;
  private quickActionButtons?: QuickActionButtonsForQuestion;

  constructor(
    private main: ContentModerationClassType,
    private container: HTMLLIElement,
  ) {
    this.FindId();
    this.FindAuthor();
    this.BindListeners();
  }

  FindId() {
    const questionLinkAnchor = this.container.querySelector<HTMLAnchorElement>(
      ".task-content > a",
    );

    this.questionId = System.ExtractId(questionLinkAnchor.href);
  }

  FindAuthor() {
    const profileLinkAnchor = this.container.querySelector<HTMLAnchorElement>(
      ".task-header > span.fleft > a",
    );

    this.author = {
      nick: profileLinkAnchor.title,
      databaseId: System.ExtractId(profileLinkAnchor.href),
    };
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
    if (this.quickActionButtons?.moderating) return;

    this.main.focusedQuestion = null;

    HideElement(this.quickActionButtons?.container);
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

    this.container.prepend(this.quickActionButtons.container);
  }

  InitQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForQuestion({
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
  }

  private async Moderate() {
    await this.main.moderatePanelController.Moderate(this);
    this.quickActionButtons.NotModerating();
  }

  Deleted() {
    this.deleted = true;

    this.container.classList.add("deleted");

    this.quickActionButtons = null;
  }
}
