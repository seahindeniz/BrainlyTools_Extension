import { Flex, Spinner } from "@/scripts/components/style-guide";
import InsertAfter from "@/scripts/helpers/InsertAfter";
import ToplayerQDB from "./ToplayerQDB";

export default class ModerationSection {
  /**
   * @param {import("..").default} main
   * @param {import("..").QuestionEntryType | import("..").AnswerEntryType} data
   */
  constructor(main, data) {
    this.main = main;
    this.data = data;
    /**
     * @type {string}
     */
    this.contentType;
    this.deleted = false;
    this.processing = false;
    this.container = this.data.element[0];
    this.header = this.container.firstElementChild;
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
  /**
   * @param {HTMLElement} targetElement
   */
  ShowSpinner(targetElement) {
    if (!targetElement)
      return;

    targetElement.append(this.buttonSpinner);

    return System.Delay(50);
  }
  HideSpinner() {
    this.main.main.main.HideElement(this.buttonSpinner);
  }
  /**
   * @param {import("@style-guide/Button").Properties} [button]
   */
  RenderDeleteButtons(button) {
    /**
     * @type {number[]}
     */
    let reasonIds = System.data.config.quickDeleteButtonsReasons[this
      .contentType];

    if (!reasonIds || reasonIds.length == 0)
      return;

    let reasons = System.data.Brainly.deleteReasons.__withIds[this
      .contentType];

    reasonIds.forEach(reasonId => {
      let reason = reasons[reasonId];

      if (!reason)
        return;

      let quickActionButton = new ToplayerQDB(this, {
        reason,
        button,
      });

      this.buttonContainer.append(quickActionButton.container);
    });
  }
  /**
   * @param {{
   *  model_id?: number,
   *  reason: any,
   *  reason_title: any,
   *  reason_id: any,
   *  give_warning: boolean,
   * }} _
   * @returns {Promise<*>}
   */
  Delete(_) {
    throw "No content type specified";
  }
  Deleted() {
    this.deleted = true;

    this.buttonContainer.remove();
    this.container.classList.add("removed");
    this.container.classList.remove("reported");

    if (this.report)
      this.report.remove();

    let removableElements = this.container
      .querySelectorAll(".actions, .action-box");

    if (removableElements && removableElements.length > 0)
      removableElements.forEach(box => box.remove());
  }
}
