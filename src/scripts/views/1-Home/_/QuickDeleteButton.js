import Button from "../../../components/Button";
import Action from "../../../controllers/Req/Brainly/Action";

let System = require("../../../helpers/System");

class QuickDeleteButton {
  /**
   * @param {number} reasonId
   * @param {import("./QuickDeleteButtons").default} main
   */
  constructor(reasonId, main) {
    if (typeof System == "function")
      System = System();

    this.main = main;
    this.reason = System.data.Brainly.deleteReasons.__withIds.task[reasonId];

    if (!this.reason)
      throw `Reason couldn't find ${reasonId}`;

    this.RenderSpinnerContainer();
    this.Render();
    this.BindHandler();
  }
  RenderSpinnerContainer() {
    this.$spinnerContainer = $(`<div class="sg-spinner-container"></div>`);
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

    let confirmDeleting = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", this.reason.title)
      .replace("%{reason_message}", this.reason.text);

    if (!confirm(confirmDeleting))
      return this.main.HideSpinner();

    this.DeleteQuestion();
  }
  async DeleteQuestion() {
    let taskData = {
      model_id: this.main.questionId,
      reason_id: this.reason.category_id,
      reason: this.reason.text,
      reason_title: this.reason.title
    };
    taskData.give_warning = System.canBeWarned(this.reason.id);

    let resRemove = await new Action().RemoveQuestion(taskData);

    System.log(5, { user: this.main.user, data: [this.main.questionId] });
    new Action().CloseModerationTicket(this.main.questionId);

    if (!resRemove || !resRemove.success) {
      notification(resRemove.message || System.data.locale.common.notificationMessages.somethingWentWrong, "error");
    } else {
      this.main.target.classList.add("deleted");
    }

    this.main.HideSpinner();
  }
  ShowSpinner() {
    this.main.$spinner.appendTo(this.$spinnerContainer);
  }
}

export default QuickDeleteButton
