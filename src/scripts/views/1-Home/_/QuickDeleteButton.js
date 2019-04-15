import Buttons from "../../../components/Buttons";
import { CloseModerationTicket, RemoveQuestion } from "../../../controllers/ActionsOfBrainly";
import QuickDeleteButtons from "./QuickDeleteButtons";

class QuickDeleteButton {
  /**
   * @param {number} reasonId
   * @param {QuickDeleteButtons} main
   */
  constructor(reasonId, main) {
    this.main = main;
    this.reason = System.data.Brainly.deleteReasons.__withIds.task[reasonId];

    if (!this.reason)
      throw `Reason couldn't find ${reasonId}`;

    this.RenderSpinner();
    this.Render();
    this.BindEvent();
  }
  RenderSpinner() {
    this.$spinnerContainer = $(`<div class="sg-spinner-container"></div>`);
    this.$spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`);
  }
  Render() {
    let button = Buttons('RemoveQuestion', {
      text: this.reason.title,
      title: this.reason.text,
      type: "peach",
      icon: "x"
    })
    this.$ = $(button);

    this.$.appendTo(this.$spinnerContainer)
  }
  BindEvent() {
    this.$.click(this.ConfirmDeleteQuestion.bind(this));
  }
  async ConfirmDeleteQuestion() {
    this.ShowSpinner();
    await System.Delay(50);

    if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
      this.DeleteQuestion();
    }
  }
  async DeleteQuestion() {
    let taskData = {
      model_id: this.main.questionId,
      reason_id: this.reason.category_id,
      reason: this.reason.text
    };
    taskData.give_warning = System.canBeWarned(this.reason.id);

    let resRemove = await RemoveQuestion(taskData);

    CloseModerationTicket(this.main.questionId);

    if (!resRemove || !resRemove.success) {
      notification(resRemove.message || System.data.locale.common.notificationMessages.somethingWentWrong, "error");
    } else {
      this.main.target.classList.add("deleted");
    }

    this.HideSpinner();
  }
  ShowSpinner() {
    this.$spinner.appendTo(this.$spinnerContainer);
  }
  HideSpinner() {
    this.$spinner.appendTo("<div />");
  }
}

export default QuickDeleteButton
