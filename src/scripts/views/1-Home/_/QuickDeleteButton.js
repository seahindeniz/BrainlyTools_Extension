import notification from "../../../components/notification2";
import Action from "../../../controllers/Req/Brainly/Action";
import { Button, Text, SpinnerContainer } from "@style-guide";

class QuickDeleteButton {
  /**
   * @param {number} reasonId
   * @param {number} index
   * @param {import("./QuickDeleteButtons").default} main
   */
  constructor(reasonId, index, main) {
    this.main = main;
    this.index = index;
    this.reason = System.data.Brainly.deleteReasons.__withIds.task[reasonId];

    if (!this.reason)
      throw `Reason couldn't find ${reasonId}`;

    this.RenderSpinnerContainer();
    this.Render();
    this.BindHandler();
  }
  RenderSpinnerContainer() {
    this.spinnerContainer = SpinnerContainer();
  }
  Render() {
    this.button = Button({
      type: "destructive",
      size: "xsmall",
      icon: Text({
        text: this.index + 1,
        weight: "bold",
        color: "white",
      }),
      title: this.reason.text,
      text: this.reason.title
    });

    this.spinnerContainer.append(this.button);
  }
  BindHandler() {
    this.button.addEventListener("click", this.ConfirmDeleteQuestion.bind(
      this));
  }
  async ConfirmDeleteQuestion() {
    this.ShowSpinner();
    await System.Delay(50);

    let confirmDeleting = System.data.locale.common.moderating
      .doYouWantToDeleteWithReason
      .replace("%{reason_title}", this.reason.title)
      .replace("%{reason_message}", this.reason.text);

    if (!confirm(confirmDeleting))
      return this.main.HideSpinner();

    this.DeleteQuestion();
  }
  async DeleteQuestion() {
    let taskData = {
      model_id: this.main.questionId,
      reason: this.reason.text,
      reason_title: this.reason.title,
      reason_id: this.reason.category_id,
    };
    taskData.give_warning = System.canBeWarned(this.reason.id);

    let resRemove = await new Action().RemoveQuestion(taskData);

    System.log(5, { user: this.main.user, data: [this.main.questionId] });
    new Action().CloseModerationTicket(this.main.questionId);

    if (!resRemove || !resRemove.success)
      notification({
        type: "error",
        text: resRemove.message || System.data.locale.common
          .notificationMessages.somethingWentWrong,
      });
    else
      this.main.target.classList.add("deleted");

    this.main.HideSpinner();
  }
  ShowSpinner() {
    this.main.$spinner.appendTo(this.spinnerContainer);
  }
}

export default QuickDeleteButton
