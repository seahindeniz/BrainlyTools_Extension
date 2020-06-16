import { Button, Text, SpinnerContainer } from "@style-guide";
import notification from "../../../components/notification2";
import Action from "../../../controllers/Req/Brainly/Action";

class QuickDeleteButton {
  /**
   * @param {number} reasonId
   * @param {number} index
   * @param {import("./QuickDeleteButtons").default} main
   */
  constructor(reasonId, index, main) {
    this.main = main;
    this.index = index;
    this.reason = System.DeleteReason({
      id: reasonId,
      type: "question",
    });

    this.RenderSpinnerContainer();
    this.Render();
    this.BindHandler();
  }

  RenderSpinnerContainer() {
    this.spinnerContainer = SpinnerContainer();
  }

  Render() {
    this.button = new Button({
      type: "solid-peach",
      size: "xsmall",
      icon: Text({
        text: this.index + 1,
        weight: "bold",
        color: "white",
      }),
      title: this.reason.text,
      text: this.reason.title,
    });

    this.spinnerContainer.append(this.button.element);
  }

  BindHandler() {
    this.button.element.addEventListener(
      "click",
      this.ConfirmDeleteQuestion.bind(this),
    );
  }

  async ConfirmDeleteQuestion() {
    this.ShowSpinner();
    await System.Delay(50);

    const confirmDeleting = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", this.reason.title)
      .replace("%{reason_message}", this.reason.text);

    if (!confirm(confirmDeleting)) {
      this.main.HideSpinner();

      return;
    }

    this.DeleteQuestion();
  }

  async DeleteQuestion() {
    const taskData = {
      model_id: this.main.questionId,
      reason: this.reason.text,
      reason_title: this.reason.title,
      reason_id: this.reason.category_id,
    };
    taskData.give_warning = System.canBeWarned(this.reason.id);
    taskData.take_points = taskData.give_warning;
    taskData.return_points = !taskData.give_warning;

    const resRemove = await new Action().RemoveQuestion(taskData);

    System.log(5, { user: this.main.user, data: [this.main.questionId] });
    new Action().CloseModerationTicket(this.main.questionId);

    if (!resRemove || !resRemove.success)
      notification({
        type: "error",
        text:
          resRemove.message ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    else this.main.target.classList.add("deleted");

    this.main.HideSpinner();
  }

  ShowSpinner() {
    this.main.$spinner.appendTo(this.spinnerContainer);
  }
}

export default QuickDeleteButton;
