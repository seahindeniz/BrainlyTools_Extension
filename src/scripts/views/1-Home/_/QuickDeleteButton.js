import Button from "../../../components/Button";
import Action from "../../../controllers/Req/Brainly/Action";
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
    this.BindHandler();
  }
  RenderSpinner() {
    this.$spinnerContainer = $(`<div class="sg-spinner-container"></div>`);
    this.$spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`);
  }
  Render() {
    this.$ = Button({
      type: "destructive",
      size: "xsmall",
      icon: "x",
      title: this.reason.text,
      text: this.reason.title
    });

    this.$.appendTo(this.$spinnerContainer)
  }
  BindHandler() {
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

    let resRemove = await new Action().RemoveQuestion(taskData);

    new Action().CloseModerationTicket(this.main.questionId);

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
