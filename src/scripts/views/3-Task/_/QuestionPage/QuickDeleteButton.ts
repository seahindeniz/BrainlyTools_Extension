import type { DeleteReasonSubCategoryType } from "@root/controllers/System";
import { Button, Flex, Text } from "@style-guide";
import { ButtonColorType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type AnswerSectionClassType from "./AnswerSection";
import type QuestionSectionClassType from "./QuestionSection";

export default class QuickDeleteButton {
  main: QuestionSectionClassType | AnswerSectionClassType;
  buttonColor: ButtonColorType;
  reason: DeleteReasonSubCategoryType;
  index: number;

  container: FlexElementType;
  button: Button;

  constructor(
    main: QuestionSectionClassType | AnswerSectionClassType,
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
      children: (this.button = new Button({
        ...this.buttonColor,
        title: `${this.reason.title}:\n\n${this.reason.text}`,
        size: "s",
        iconOnly: true,
        icon: Text({
          color: "white",
          weight: "bold",
          children: this.index,
        }),
        onClick: this.DeleteContent.bind(this),
      })),
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

    this.container.append(this.main.main.actionButtonSpinner);
    this.main.Delete(this.reason);
  }
}
