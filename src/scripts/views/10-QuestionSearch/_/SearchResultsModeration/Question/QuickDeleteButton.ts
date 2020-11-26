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
        reversedOrder: !(this.index % 2),
        iconOnly: true,
        onClick: this.ConfirmDeletion.bind(this),
        onMouseEnter: this.ShowText.bind(this),
        onMouseLeave: this.HideText.bind(this),
        title: this.reason.text,
        type: "solid-mustard",
      }),
      marginBottom: "xs",
    });

    this.main[
      this.index < 2 || this.index % 2
        ? "rightActionButtonContainer"
        : "leftActionButtonContainer"
    ].append(this.container);
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

  DeleteQuestion() {
    const giveWarning = System.canBeWarned(this.reason.id);

    this.main.Delete({
      model_id: this.main.questionId,
      reason: this.reason.text,
      reason_title: this.reason.title,
      reason_id: this.reason.category_id,
      give_warning: giveWarning,
      take_points: true,
      return_points: false,
    });
  }

  ShowSpinner() {
    this.button.element.append(this.main.actionButtonSpinner);
  }
}
