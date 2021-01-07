import { QuickActionButtonsForAnswer } from "@components";
import CreateElement from "@components/CreateElement";
import HideElement from "@root/helpers/HideElement";
import { Button, Checkbox, Flex, Icon, Label, Spinner } from "@style-guide";
import type ShortAnswersClassType from "..";
import type { AnswerAttachmentType } from "../answerAttachment.fragment";

export default class Answer {
  private main: ShortAnswersClassType;
  private rowElement: HTMLTableRowElement;

  private actionButtons: Button[];

  private author: {
    databaseId: number;
    nick: string;
  };

  questionId: number;
  answerId: number;
  private moderateButtonContainer: HTMLTableDataCellElement;
  private moderateButton: Button;
  private quickDeleteButtonContainer: import("@style-guide/Flex").FlexElementType;
  #actionButtonSpinner: HTMLDivElement;
  private dateCell: HTMLTableCellElement;
  deleted: boolean;
  private checkboxContainer?: HTMLTableDataCellElement;
  checkbox?: Checkbox;

  attachments: AnswerAttachmentType[];
  private contentCell: HTMLTableCellElement;
  quickActionButtons: QuickActionButtonsForAnswer;

  constructor(main: ShortAnswersClassType, rowElement: HTMLTableRowElement) {
    this.main = main;
    this.rowElement = rowElement;

    this.actionButtons = [];

    this.FindAuthor();
    this.FindDateCell();
    this.FindQuestionId();
    this.FindAnswerId();
    this.FindContentCell();
    this.RenderModerateButton();
    this.RenderCheckbox();
    this.BindListener();
  }

  get actionButtonSpinner() {
    if (!this.#actionButtonSpinner) {
      this.RenderActionButtonSpinner();
    }

    return this.#actionButtonSpinner;
  }

  private RenderActionButtonSpinner() {
    this.#actionButtonSpinner = Spinner({ overlay: true });
  }

  private FindAuthor() {
    const authorProfileAnchor: HTMLAnchorElement = this.rowElement.querySelector(
      `td:nth-child(3) > a`,
    );

    if (!authorProfileAnchor) {
      throw Error("Can't find author anchor");
    }

    this.author = {
      databaseId: System.ExtractId(authorProfileAnchor.href),
      nick: authorProfileAnchor.innerText.trim(),
    };
  }

  private FindDateCell() {
    this.dateCell = this.rowElement.querySelector("td.last");

    if (!this.dateCell) {
      throw Error("Can't find answers date cell");
    }

    this.dateCell.classList.remove("last");
    this.dateCell.classList.add("ext-qdb-cell");
  }

  private FindQuestionId() {
    const questionLink: HTMLAnchorElement = this.rowElement.querySelector(
      `td:nth-child(2) > a`,
    );

    this.questionId = System.ExtractId(questionLink.innerText);

    if (Number.isNaN(this.questionId) || !this.questionId)
      throw Error("Can't find question id");
  }

  private FindAnswerId() {
    const correctLink: HTMLAnchorElement = this.rowElement.querySelector(
      `a[id^="correct"]`,
    );

    this.answerId = System.ExtractId(correctLink.id);

    if (Number.isNaN(this.answerId) || !this.answerId)
      throw Error("Can't find answer id");
  }

  private FindContentCell() {
    this.contentCell = this.rowElement.querySelector("td:nth-child(4)");

    if (!this.contentCell) {
      throw Error("Can't find answer's content cell");
    }
  }

  private RenderModerateButton() {
    this.moderateButtonContainer = CreateElement({
      tag: "td",
      className: "last",
      children: (this.moderateButton = new Button({
        size: "s",
        type: "solid-blue",
        iconOnly: true,
        icon: new Icon({
          type: "pencil",
        }),
        onClick: this.Moderate.bind(this),
      })),
    });

    this.actionButtons.push(this.moderateButton);
    this.rowElement.append(this.moderateButtonContainer);
  }

  async Moderate() {
    this.moderateButton.Disable();

    const ticketData = await this.main.moderatePanelController.Moderate(this);

    this.moderateButton.Enable();

    return ticketData;
  }

  private RenderCheckbox() {
    if (!System.checkUserP(15)) return;

    this.checkboxContainer = CreateElement({
      tag: "td",
      children: (this.checkbox = new Checkbox({
        id: null,
      })),
    });

    this.rowElement.prepend(this.checkboxContainer);
  }

  private BindListener() {
    if (!System.checkUserP(2)) return;

    this.rowElement.addEventListener(
      "mouseenter",
      this.ShowQuickDeleteButtons.bind(this),
    );
    this.rowElement.addEventListener(
      "mouseleave",
      this.HideQuickDeleteButtons.bind(this),
    );
  }

  private ShowQuickDeleteButtons() {
    if (this.deleted) return;

    if (!this.quickActionButtons) {
      this.InitQuickActionButtons();
    }

    this.dateCell.append(this.quickDeleteButtonContainer);
  }

  private HideQuickDeleteButtons() {
    if (this.quickActionButtons.moderating) return;

    HideElement(this.quickDeleteButtonContainer);
  }

  InitQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForAnswer({
      content: {
        databaseId: this.answerId,
        author: this.author,
      },
      containerProps: {
        className: "ext-qdb-container",
      },
      onDelete: this.Deleted.bind(this),
      moreButton: true,
    });

    this.quickDeleteButtonContainer = Flex({
      relative: true,
      children: this.quickActionButtons.container,
    });
  }

  Deleted() {
    this.deleted = true;

    if (this.checkbox) {
      this.checkbox.input.disabled = true;
    }

    this.rowElement.classList.add("deleted");
    this.moderateButton.element.remove();
    this.quickDeleteButtonContainer?.remove();
  }

  RenderAttachmentIcon() {
    const attachmentContainer = Flex({
      marginBottom: "xxs",
      children: new Label({
        color: "gray",
        icon: new Icon({
          type: "attachment",
        }),
        children: this.attachments.length,
      }),
    });

    this.contentCell.prepend(attachmentContainer);
  }
}
