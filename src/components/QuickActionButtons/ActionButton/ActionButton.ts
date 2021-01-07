import HideElement from "@root/helpers/HideElement";
import { Button, Flex } from "@style-guide";
import type { ButtonPropsType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import { TextElement } from "@style-guide/Text";
import tippy, { Instance } from "tippy.js";
import type QuickActionButtonsClassType from "../QuickActionButtons";

type PositionType = "left" | "right";

export default class ActionButton {
  container: FlexElementType;
  button: Button;
  protected buttonTippy: Instance;

  constructor(
    protected main: QuickActionButtonsClassType,
    private position: PositionType,
    private buttonProps: ButtonPropsType,
    private tooltipContent?: string | TextElement<"div">,
  ) {
    this.Render();
  }

  Render() {
    this.container = Flex({
      marginTop: "xxs",
      marginLeft: "xxs",
      marginBottom: "xxs",
      relative: true,
      children: (this.button = new Button({
        size: this.main.props.buttonSize,
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
