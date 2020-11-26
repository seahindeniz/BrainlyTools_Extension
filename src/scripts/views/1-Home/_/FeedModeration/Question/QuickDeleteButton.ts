import Action from "@BrainlyAction";
import notification from "@components/notification2";
import { DeleteReasonSubCategoryType } from "@root/controllers/System";
import { Button, Flex, Text } from "@style-guide";
import type QuestionClassType from "./Question";

export default class QuickDeleteButton {
  main: QuestionClassType;
  reason: DeleteReasonSubCategoryType;
  index: number;
  button: Button;
  container: import("@style-guide/Flex").FlexElementType;

  constructor(
    main: QuestionClassType,
    reason: DeleteReasonSubCategoryType,
    index: number,
  ) {
    this.main = main;
    this.reason = reason;
    this.index = index;

    this.Render();
  }

  Render() {
    this.container = Flex({
      children: this.button = new Button({
        children: this.reason.title,
        icon: Text({
          children: this.index + 1,
          color: "white",
          weight: "bold",
        }),
        iconOnly: true,
        onClick: this.ConfirmDeletion.bind(this),
        onMouseEnter: this.ShowText.bind(this),
        onMouseLeave: this.HideText.bind(this),
        title: this.reason.text,
        type: "solid-mustard",
      }),
      marginBottom: "xs",
    });

    this.main.rightActionButtonContainer.append(this.container);
  }

  ShowText() {
    this.button.IconOnly(false);
  }

  HideText() {
    this.button.IconOnly(true);
  }

  async ConfirmDeletion() {
    this.ShowSpinner();
    await System.Delay(50);

    const confirmDeleting = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", this.reason.title)
      .replace("%{reason_message}", this.reason.text);

    if (!confirm(confirmDeleting)) {
      this.main.HideActionButtonSpinner();

      return;
    }

    this.DeleteQuestion();
  }

  async DeleteQuestion() {
    try {
      this.main.DisableActionButtons();

      this.main.deleting = true;

      const giveWarning = System.canBeWarned(this.reason.id);
      const res = await new Action().RemoveQuestion({
        model_id: this.main.questionId,
        reason: this.reason.text,
        reason_title: this.reason.title,
        reason_id: this.reason.category_id,
        give_warning: giveWarning,
        take_points: true,
        return_points: false,
      });
      // console.log({
      //   model_id: this.main.questionId,
      //   reason: this.reason.text,
      //   reason_title: this.reason.title,
      //   reason_id: this.reason.category_id,
      //   give_warning: giveWarning,
      //   take_points: giveWarning,
      //   return_points: !giveWarning,
      // });
      // await System.TestDelay();
      // const res = { success: true, message: "Failed" };

      new Action().CloseModerationTicket(this.main.questionId);

      if (!res) {
        throw Error("No response");
      }

      if (res.success === false) {
        throw res?.message ? { msg: res?.message } : res;
      }

      this.main.Deleted();

      System.log(5, {
        user: {
          id: this.main.author.id,
          nick: this.main.author.nick,
        },
        data: [this.main.questionId],
      });
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    this.main.deleting = false;

    this.main.HideActionButtonSpinner();
    this.main.EnableActionButtons();
  }

  ShowSpinner() {
    this.button.element.append(this.main.actionButtonSpinner);
  }
}
