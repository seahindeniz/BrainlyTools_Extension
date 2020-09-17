import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import { Button, Flex, Icon, Spinner } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FeedModerationClassType from "../FeedModeration";
import QuickDeleteButton from "./QuickDeleteButton";

export default class Question {
  main: FeedModerationClassType;
  container: HTMLDivElement;
  author: {
    id: number;
    nick: string;
  };

  questionId: number;
  actionButtonsContainer: FlexElementType;
  leftActionButtonContainer: FlexElementType;
  rightActionButtonContainer: FlexElementType;
  moderateButton: Button;
  actionButtons: Button[];
  deleted: boolean;
  deleting: boolean;
  #actionButtonSpinner: HTMLDivElement;

  constructor(
    main: FeedModerationClassType,
    questionId: number,
    container: HTMLDivElement,
  ) {
    this.main = main;
    this.questionId = questionId;
    this.container = container;

    this.actionButtons = [];

    this.FindAuthor();
    this.BindListeners();
  }

  FindAuthor() {
    const profileLinkAnchor: HTMLAnchorElement = this.container.querySelector(
      ".brn-feed-item__avatar .sg-avatar > a",
    );

    if (!profileLinkAnchor)
      throw Error("Can't find authors profile link element");

    this.author = {
      id: System.ExtractId(profileLinkAnchor.href),
      nick: profileLinkAnchor.title,
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
    if (this.deleting) return;

    this.main.focusedQuestion = null;

    HideElement(this.actionButtonsContainer);
  }

  ShowActionButtons() {
    if (this.main.focusedQuestion && this.main.focusedQuestion !== this) {
      this.main.focusedQuestion.HideActionButtons();
    }

    this.main.focusedQuestion = this;

    if (this.deleted) return;

    if (!this.actionButtonsContainer) {
      this.RenderActionButtonContainer();
      this.RenderModerateButton();
      this.RenderQuickDeleteButtons();
    }

    this.container.prepend(this.actionButtonsContainer);

    this.leftActionButtonContainer.style.maxWidth = `${this.moderateButton.element.offsetWidth}px`;
    this.rightActionButtonContainer.style.maxWidth = `${this.moderateButton.element.offsetWidth}px`;
  }

  RenderActionButtonContainer() {
    this.actionButtonsContainer = Build(
      Flex({
        relative: true,
      }),
      [
        [
          Flex({
            className: "ext-action-buttons__container",
          }),
          [
            (this.leftActionButtonContainer = Flex({
              alignItems: "flex-end",
              direction: "column",
              marginRight: "xs",
            })),
            (this.rightActionButtonContainer = Flex({ direction: "column" })),
          ],
        ],
      ],
    );
  }

  RenderModerateButton() {
    const moderateButtonContainer = Flex({
      children: this.moderateButton = new Button({
        iconOnly: true,
        children: System.data.locale.common.moderating.moderate,
        icon: new Icon({
          type: "pencil",
        }),
        reversedOrder: true,
        type: "solid-blue",
        onClick: this.Moderate.bind(this),
        onMouseEnter: this.ShowText.bind(this),
        onMouseLeave: this.HideText.bind(this),
      }),
    });

    this.actionButtons.push(this.moderateButton);
    this.leftActionButtonContainer.append(moderateButtonContainer);
  }

  async Moderate() {
    this.ShowModerateButtonSpinner();
    await System.Delay(50);
    await this.main.moderatePanelController.Moderate(this);
    this.HideActionButtonSpinner();
  }

  ShowModerateButtonSpinner() {
    this.moderateButton.element.append(this.actionButtonSpinner);
  }

  HideActionButtonSpinner() {
    HideElement(this.#actionButtonSpinner);
  }

  get actionButtonSpinner() {
    if (!this.#actionButtonSpinner) {
      this.RenderActionButtonSpinner();
    }

    return this.#actionButtonSpinner;
  }

  RenderActionButtonSpinner() {
    this.#actionButtonSpinner = Spinner({ overlay: true });
  }

  Deleted() {
    this.deleted = true;

    this.actionButtonsContainer.remove();
    this.container.classList.add("deleted");
  }

  ShowText() {
    this.moderateButton.IconOnly(false);
  }

  HideText() {
    this.moderateButton.IconOnly(true);
  }

  RenderQuickDeleteButtons() {
    System.data.config.quickDeleteButtonsReasons.question.forEach(
      (reasonId, index) => {
        const reason = System.DeleteReason({
          id: reasonId,
          type: "question",
        });

        const qdb = new QuickDeleteButton(this, reason, index);

        this.actionButtons.push(qdb.button);
      },
    );
  }

  DisableActionButtons() {
    this.actionButtons.forEach(actionButton => actionButton.Disable());
  }

  EnableActionButtons() {
    this.actionButtons.forEach(actionButton => actionButton.Enable());
  }
}
