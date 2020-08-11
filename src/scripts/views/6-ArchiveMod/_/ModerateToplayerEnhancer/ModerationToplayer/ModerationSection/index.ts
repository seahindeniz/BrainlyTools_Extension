/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-duplicates */
import { Flex, Spinner } from "@root/scripts/components/style-guide";
import type { DeleteReasonContentTypeNameType } from "@root/scripts/controllers/System";
import HideElement from "@root/scripts/helpers/HideElement";
import InsertAfter from "@root/scripts/helpers/InsertAfter";
import type ModerationToplayerClassType from "..";
import type { AnswerEntryType, QuestionEntryType } from "..";
import ToplayerQDB from "./ToplayerQDB";

export default class ModerationSection {
  main: ModerationToplayerClassType;
  data: QuestionEntryType | AnswerEntryType;
  contentType: DeleteReasonContentTypeNameType;
  deleted: boolean;
  processing: boolean;
  container: HTMLElement;
  header: HTMLElement;
  report: HTMLElement;
  buttonContainer: import("@style-guide/Flex").FlexElementType;
  buttonSpinner: HTMLDivElement;

  constructor(
    main: ModerationToplayerClassType,
    data: QuestionEntryType | AnswerEntryType,
  ) {
    this.main = main;
    this.data = data;

    this.deleted = false;
    this.processing = false;
    this.container = data?.element[0];
    this.header = this.container.firstElementChild as HTMLElement;
    this.report = this.container.querySelector(".report");

    this.RenderButtonContainer();
    this.RenderButtonSpinner();
  }

  RenderButtonContainer() {
    this.buttonContainer = Flex({
      justifyContent: "flex-end",
      fullWidth: true,
      marginTop: "xs",
    });

    InsertAfter(this.buttonContainer, this.header);
  }

  RenderButtonSpinner() {
    this.buttonSpinner = Spinner({
      overlay: true,
      size: "small",
    });
  }

  ShowSpinner(targetElement?: HTMLElement) {
    if (!targetElement) return undefined;

    targetElement.append(this.buttonSpinner);

    return System.Delay(50);
  }

  HideSpinner() {
    HideElement(this.buttonSpinner);
  }

  /**
   * @param {import("@style-guide/Button").Properties} [button]
   */
  RenderDeleteButtons(button) {
    /**
     * @type {number[]}
     */
    const reasonIds =
      System.data.config.quickDeleteButtonsReasons[this.contentType];

    if (!reasonIds || reasonIds.length === 0) return;

    const reasons =
      System.data.Brainly.deleteReasons.__withIds[this.contentType];

    reasonIds.forEach(reasonId => {
      const reason = reasons[reasonId];

      if (!reason) return;

      // @ts-expect-error
      const quickActionButton = new ToplayerQDB(this, {
        reason,
        button,
      });

      this.buttonContainer.append(quickActionButton.container);
    });
  }

  Deleted() {
    this.deleted = true;

    this.buttonContainer.remove();
    this.container.classList.add("removed");
    this.container.classList.remove("reported");

    if (this.report) this.report.remove();

    const removableElements = this.container.querySelectorAll(
      ".actions, .action-box",
    );

    if (removableElements && removableElements.length > 0)
      removableElements.forEach(box => box.remove());
  }
}
