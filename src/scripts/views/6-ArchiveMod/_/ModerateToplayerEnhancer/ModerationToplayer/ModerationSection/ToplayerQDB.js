import notification from "@/scripts/components/notification2";
import {
  Button,
  Flex,
  SpinnerContainer
} from "@/scripts/components/style-guide";

export default class ToplayerQDB {
  /**
   * @param {import(".").default} main
   * @param {{
   *  reason: *,
   *  button: import("@style-guide/Button").Properties,
   * }} param1
   */
  constructor(main, { reason, button }) {
    this.main = main;
    this.reason = reason;
    this.buttonProps = button;

    this.RenderButtonContainer();
    this.RenderButton();
    this.BindHandler();
  }
  RenderButtonContainer() {
    this.spinnerContainer = SpinnerContainer();
    this.container = Flex({
      marginLeft: "xs",
      children: this.spinnerContainer,
    });
  }
  RenderButton() {
    this.button = Button({
      size: "xsmall",
      text: this.reason.title,
      title: `${this.reason.title}:\n${this.reason.text}`,
      ...this.buttonProps
    });

    this.spinnerContainer.append(this.button);
  }
  BindHandler() {
    this.button.addEventListener("click", this.Delete.bind(this));
  }
  ShowSpinner() {
    return this.main.ShowSpinner(this.spinnerContainer);
  }
  async Delete() {
    try {
      let message = System.data.locale.common.moderating
        .doYouWantToDeleteWithReason
        .replace("%{reason_title}", this.reason.title)
        .replace("%{reason_message}", this.reason.text);

      await this.ShowSpinner();

      if (this.main.processing || !confirm(message))
        return;

      let data = {
        model_id: this.main.data.id,
        reason: this.reason.text,
        reason_title: this.reason.title,
        reason_id: this.reason.category_id,
        give_warning: System.canBeWarned(this.reason.id),
      };
      this.main.processing = true;
      let resDelete = await this.main.Delete(data);
      this.main.processing = false;

      if (!resDelete)
        throw "Empty response";

      if (!resDelete.success)
        throw { msg: resDelete.message, res: resDelete };

      this.main.Deleted();
    } catch (error) {
      console.error(error);
      this.main.main.main.toplayerZdnObject.setMessage(error.msg || System
        .data.locale.common.notificationMessages.operationError, "failure");
    }

    this.main.HideSpinner();
  }
}
