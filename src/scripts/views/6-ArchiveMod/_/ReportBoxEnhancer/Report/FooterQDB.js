/* eslint-disable camelcase */
import notification from "@/scripts/components/notification2";
import {
  ButtonRound,
  Flex,
  SpinnerContainer,
  Text,
} from "@/scripts/components/style-guide";

export default class FooterQDB {
  /**
   * @param {import(".").default} main
   * @param {{
   *  reason: *,
   *  color: {
   *    button: import("@style-guide/ButtonRound").RoundButtonColorType,
   *    text: import("@style-guide/Text").TextColorType,
   *  },
   *  buttonText: string,
   * }} param1
   */
  constructor(main, { reason, color, buttonText }) {
    this.main = main;
    this.reason = reason;
    this.color = color;
    this.buttonText = buttonText;

    this.RenderButtonContainer();
    this.RenderButton();
    this.BindHandler();
  }

  RenderButtonContainer() {
    this.spinnerContainer = SpinnerContainer();
    this.container = Flex({
      marginRight: "xs",
      children: this.spinnerContainer,
    });
  }

  RenderButton() {
    this.button = ButtonRound({
      color: this.color.button,
      filled: true,
      icon: Text({
        text: this.buttonText,
        color: this.color.text,
        size: "normal",
        weight: "bold",
      }),
      title: `${this.reason.title}:\n${this.reason.text}`,
    });

    this.container.append(this.button);
  }

  BindHandler() {
    this.button.addEventListener("click", this.Delete.bind(this));
  }

  async Delete() {
    try {
      const message = System.data.locale.common.moderating.doYouWantToDeleteWithReason
        .replace("%{reason_title}", this.reason.title)
        .replace("%{reason_message}", this.reason.text);

      await this.ShowSpinner();

      if (!confirm(message)) return;

      const { model_id } = this.main.zdnObject.data;
      const { model_type_id } = this.main.zdnObject.data;
      const data = {
        model_id,
        reason: this.reason.text,
        reason_title: this.reason.title,
        reason_id: this.reason.category_id,
        give_warning: System.canBeWarned(this.reason.id),
      };

      this.processing = true;
      const resDelete = await this.main.Delete(data);
      this.processing = false;

      if (!resDelete) throw Error("Empty response");

      // eslint-disable-next-line no-throw-literal
      if (!resDelete.success) throw { msg: resDelete.message, res: resDelete };

      this.main.deleted = true;

      this.main.container.classList.add("removed");
      System.log(model_type_id === 1 ? 5 : model_type_id === 2 ? 6 : 7, {
        user: this.main.zdnObject.data.user,
        data: [model_id],
      });
    } catch (error) {
      console.error(error);
      notification({
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
        type: "error",
      });
    }

    this.main.HideButtons();
  }

  ShowSpinner() {
    this.spinnerContainer.append(this.main.buttonSpinner);

    return System.Delay(50);
  }
}
