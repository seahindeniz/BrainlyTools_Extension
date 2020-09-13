import type { DeleteReasonSubCategoryType } from "@root/controllers/System";
import { Button, Flex, Text } from "@style-guide";
import { ButtonColorType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type AnswerClassType from "./Answer";

export default class QuickDeleteButton {
  main: AnswerClassType;
  buttonColor: ButtonColorType;
  reason: DeleteReasonSubCategoryType;
  index: number;

  container: FlexElementType;
  button: Button;

  constructor(
    main: AnswerClassType,
    buttonColor: ButtonColorType,
    reason: DeleteReasonSubCategoryType,
    index: number,
  ) {
    this.main = main;
    this.buttonColor = buttonColor;
    this.reason = reason;
    this.index = index;

    if (!this.reason) throw Error("Can't find the delete reason");

    this.Render();
  }

  Render() {
    this.container = Flex({
      relative: true,
      marginRight: "xs",
      children: this.button = new Button({
        ...this.buttonColor,
        title: `${this.reason.title}:\n\n${this.reason.text}`,
        iconOnly: true,
        icon: Text({
          color: "white",
          weight: "bold",
          children: this.index,
        }),
        onClick: this.DeleteContent.bind(this),
      }),
    });

    tippy(this.button.element, {
      allowHTML: true,
      content: `<b>${this.reason.title}</b>:<br><br>${this.reason.text}`,
      theme: "light",
    });
  }

  DeleteContent() {
    const confirmMessage = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", this.reason.title)
      .replace("%{reason_message}", this.reason.text);

    if (!confirm(confirmMessage)) return;

    this.container.append(this.main.actionButtonSpinner);

    const giveWarning = System.canBeWarned(this.reason.id);

    this.main.Delete({
      model_id: undefined,
      reason_id: this.reason.category_id,
      reason: this.reason.text,
      reason_title: this.reason.title,
      give_warning: giveWarning,
      take_points: giveWarning,
    });
  }
}
