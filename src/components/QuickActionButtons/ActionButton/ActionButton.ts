import HideElement from "@root/helpers/HideElement";
import { Button, Flex } from "@style-guide";
import type { ButtonPropsType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import { TextElement } from "@style-guide/Text";
import tippy, { Instance } from "tippy.js";
import type QuickActionButtonsClassType from "../QuickActionButtons";

export default class ActionButton {
  container: FlexElementType;
  button: Button;
  protected buttonTippy: Instance;

  constructor(
    protected main: QuickActionButtonsClassType,
    private position: "left" | "right",
    private buttonProps: ButtonPropsType,
    protected tooltipContent?: string | TextElement<"div">,
  ) {
    this.Render();
  }

  Render() {
    this.container = Flex({
      marginTop: "xxs",
      marginLeft: this.main.props.button?.marginLeft || "xxs",
      marginBottom: "xxs",
      relative: true,
      children: (this.button = new Button({
        size: this.main.props.button?.size,
        ...this.buttonProps,
      })),
    });

    if (this.tooltipContent) {
      if (typeof this.tooltipContent === "string")
        this.tooltipContent = this.tooltipContent.replace(/\n/gi, "<br>");

      this.buttonTippy = tippy(this.button.element, {
        allowHTML: true,
        content: this.tooltipContent,
        theme: "light",
      });
    }

    this.Show();
  }

  Show() {
    if (this.position === "left")
      this.main.leftActionButtonContainer.append(this.container);
    else if (this.position === "right")
      this.main.rightActionButtonContainer.append(this.container);
  }

  Hide() {
    this.buttonTippy?.hide();
    HideElement(this.container);
  }

  Selected() {
    this.main.selectedButton = this;

    this.main.Moderating();

    return this.ShowSpinner();
  }

  ShowSpinner() {
    this.button.element.append(this.main.spinner);

    return System.Delay(50);
  }
}
