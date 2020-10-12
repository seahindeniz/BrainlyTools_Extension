import Action, { RemoveAnswerReqDataType } from "@BrainlyAction";
import CreateElement from "@components/CreateElement";
import notification from "@components/notification2";
import HideElement from "@root/helpers/HideElement";
import { Button, Checkbox, Flex, Icon, Spinner } from "@style-guide";
import type ShortAnswersClassType from "..";
import QuickDeleteButton from "./QuickDeleteButton";

export default class Answer {
  main: ShortAnswersClassType;
  rowElement: HTMLTableRowElement;

  actionButtons: Button[];

  author: {
    id: number;
    nick: string;
  };

  questionId: number;
  answerId: number;
  moderateButtonContainer: HTMLTableDataCellElement;
  moderateButton: Button;
  quickDeleteButtonContainer: import("@style-guide/Flex").FlexElementType;
  #actionButtonSpinner: HTMLDivElement;
  dateCell: HTMLTableCellElement;
  deleted: boolean;
  deleting: boolean;
  checkboxContainer?: HTMLTableDataCellElement;
  checkbox?: Checkbox;

  constructor(main: ShortAnswersClassType, rowElement: HTMLTableRowElement) {
    this.main = main;
    this.rowElement = rowElement;

    this.actionButtons = [];

    this.FindAuthor();
    this.FindDateCell();
    this.FindQuestionId();
    this.FindAnswerId();
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

  RenderActionButtonSpinner() {
    this.#actionButtonSpinner = Spinner({ overlay: true });
  }

  FindAuthor() {
    const authorProfileAnchor: HTMLAnchorElement = this.rowElement.querySelector(
      `td:nth-child(3) > a`,
    );

    if (!authorProfileAnchor) {
      throw Error("Can't find author anchor");
    }

    this.author = {
      id: System.ExtractId(authorProfileAnchor.href),
      nick: authorProfileAnchor.innerText.trim(),
    };
  }

  FindDateCell() {
    this.dateCell = this.rowElement.querySelector("td.last");

    if (!this.dateCell) {
      throw Error("Can't find answers date cell");
    }

    this.dateCell.classList.remove("last");
    this.dateCell.classList.add("ext-qdb-cell");
  }

  FindQuestionId() {
    const questionLink: HTMLAnchorElement = this.rowElement.querySelector(
      `td:nth-child(2) > a`,
    );

    this.questionId = System.ExtractId(questionLink.innerText);

    if (Number.isNaN(this.questionId) || !this.questionId)
      throw Error("Can't find question id");
  }

  FindAnswerId() {
    const correctLink: HTMLAnchorElement = this.rowElement.querySelector(
      `a[id^="correct"]`,
    );

    this.answerId = System.ExtractId(correctLink.id);

    if (Number.isNaN(this.answerId) || !this.answerId)
      throw Error("Can't find answer id");
  }

  RenderModerateButton() {
    this.moderateButtonContainer = CreateElement({
      tag: "td",
      className: "last",
      children: this.moderateButton = new Button({
        size: "s",
        type: "solid-blue",
        iconOnly: true,
        icon: new Icon({
          type: "pencil",
        }),
        onClick: this.Moderate.bind(this),
      }),
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

  RenderCheckbox() {
    if (!System.checkUserP(15)) return;

    this.checkboxContainer = CreateElement({
      tag: "td",
      children: this.checkbox = new Checkbox({
        id: null,
      }),
    });

    this.rowElement.prepend(this.checkboxContainer);
  }

  BindListener() {
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

  ShowQuickDeleteButtons() {
    if (this.deleted) return;

    if (!this.quickDeleteButtonContainer) {
      this.RenderQuickDeleteButtons();
    }

    this.dateCell.append(this.quickDeleteButtonContainer);
  }

  HideQuickDeleteButtons() {
    if (this.deleting) return;

    HideElement(this.quickDeleteButtonContainer);
  }

  RenderQuickDeleteButtons() {
    this.quickDeleteButtonContainer = Flex({
      className: "ext-qdb-container",
    });

    System.data.config.quickDeleteButtonsReasons.answer.forEach(
      (reasonId, index) => {
        const reason = System.DeleteReason({ id: reasonId, type: "answer" });

        if (!reason) return;

        const qdb = new QuickDeleteButton(
          this,
          { type: "solid-peach" },
          reason,
          index + 1,
        );

        this.actionButtons.push(qdb.button);
        this.quickDeleteButtonContainer.append(qdb.container);
      },
    );
  }

  async Delete(data: RemoveAnswerReqDataType) {
    try {
      this.DisableActionButtons();

      this.deleting = true;

      const res = await new Action().RemoveAnswer({
        ...data,
        model_id: this.answerId,
      });
      // console.log({
      //   ...data,
      //   model_id: this.answerId,
      // });
      // await System.TestDelay();
      // const res = { success: true, message: "Failed" };

      new Action().CloseModerationTicket(this.answerId);

      if (!res) {
        throw Error("No response");
      }

      if (res.success === false) {
        throw res?.message ? { msg: res?.message } : res;
      }

      this.Deleted();

      System.log(6, {
        user: {
          id: this.author.id,
          nick: this.author.nick,
        },
        data: [this.answerId],
      });
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.deleting = false;

    this.HideActionButtonSpinner();
    this.EnableActionButtons();
  }

  DisableActionButtons() {
    this.actionButtons.forEach(button => button.Disable());
  }

  EnableActionButtons() {
    this.actionButtons.forEach(button => button.Enable());
  }

  HideActionButtonSpinner() {
    if (!this.#actionButtonSpinner) return;

    HideElement(this.#actionButtonSpinner);
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
}
