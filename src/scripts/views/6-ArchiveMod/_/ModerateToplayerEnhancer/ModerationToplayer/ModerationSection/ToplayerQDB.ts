import { Button, Flex, SpinnerContainer } from "@style-guide";
import { ButtonPropsType } from "@style-guide/Button";
import type AnswerSectionClassType from "./Answer";
import type QuestionSectionClassType from "./Question";

export default class ToplayerQDB {
  main: AnswerSectionClassType | QuestionSectionClassType;
  reason: any;
  buttonProps: ButtonPropsType;
  button: Button;
  spinnerContainer: HTMLDivElement;
  container: import("@style-guide/Flex").FlexElementType;

  constructor(
    main: AnswerSectionClassType | QuestionSectionClassType,
    {
      reason,
      button,
    }: {
      reason: any;
      button: ButtonPropsType;
    },
  ) {
    this.main = main;
    this.reason = reason;
    this.buttonProps = button;

    this.RenderButton();
    this.RenderButtonContainer();
    this.BindHandler();
  }

  RenderButton() {
    this.button = new Button({
      size: "xs",
      text: this.reason.title,
      title: `${this.reason.title}:\n${this.reason.text}`,
      ...this.buttonProps,
    });
  }

  RenderButtonContainer() {
    this.spinnerContainer = SpinnerContainer({
      children: this.button.element,
    });
    this.container = Flex({
      marginLeft: "xs",
      children: this.spinnerContainer,
    });
  }

  BindHandler() {
    this.button.element.addEventListener("click", this.Delete.bind(this));
  }

  ShowSpinner() {
    return this.main.ShowSpinner(this.spinnerContainer);
  }

  async Delete() {
    try {
      const message = System.data.locale.common.moderating.doYouWantToDeleteWithReason
        .replace("%{reason_title}", this.reason.title)
        .replace("%{reason_message}", this.reason.text);

      await this.ShowSpinner();

      if (this.main.processing || !confirm(message)) {
        this.main.HideSpinner();

        return;
      }

      const giveWarning = System.canBeWarned(this.reason.id);
      const data = {
        model_id: this.main.data.id,
        reason: this.reason.text,
        reason_title: this.reason.title,
        reason_id: this.reason.category_id,
        give_warning: giveWarning,
        take_points: true,
      };

      this.main.processing = true;

      const resDelete = await this.main.Delete(data);

      this.main.processing = false;

      if (!resDelete) throw Error("Empty response");

      if (resDelete.success === false)
        // eslint-disable-next-line no-throw-literal
        throw { msg: resDelete.message, res: resDelete };

      this.main.Deleted();
    } catch (error) {
      console.error(error);
      this.main.main.main.toplayerZdnObject.setMessage(
        error.msg ||
          System.data.locale.common.notificationMessages.operationError,
        "failure",
      );
    }

    this.main.HideSpinner();
  }
}
