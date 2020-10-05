import HideElement from "@root/helpers/HideElement";
import { Button, Flex } from "@style-guide";
import type { ButtonPropsType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import { TextElement } from "@style-guide/Text";
import tippy from "tippy.js";
import type QuickActionButtonsClassType from "../QuickActionButtons";

type PositionType = "left" | "right";

export default class ActionButton {
  main: QuickActionButtonsClassType;
  #position: PositionType;
  buttonProps: ButtonPropsType;
  #tooltipContent: string | TextElement<"div">;

  container: FlexElementType;
  button: Button;

  constructor(
    main: QuickActionButtonsClassType,
    position: PositionType,
    buttonProps: ButtonPropsType,
    tooltipContent?: string | TextElement<"div">,
  ) {
    this.main = main;
    this.#position = position;
    this.buttonProps = buttonProps;
    this.#tooltipContent = tooltipContent;

    this.Render();
  }

  Render() {
    this.container = Flex({
      marginTop: "xxs",
      marginLeft: "xxs",
      marginBottom: "xxs",
      relative: true,
      children: this.button = new Button({
        size: this.main.buttonSize,
        ...this.buttonProps,
      }),
    });

    if (this.#tooltipContent) {
      // const tp =
      if (typeof this.#tooltipContent === "string")
        this.#tooltipContent = this.#tooltipContent.replace(/\n/gi, "<br>");

      tippy(this.button.element, {
        allowHTML: true,
        content: this.#tooltipContent,
        theme: "light",
      });
    }

    this.Show();
  }

  Show() {
    if (this.#position === "left")
      this.main.leftActionButtonContainer.append(this.container);
    else if (this.#position === "right")
      this.main.rightActionButtonContainer.append(this.container);
  }

  Hide() {
    HideElement(this.container);
  }

  Selected() {
    this.main.selectedButton = this;

    this.main.DisableButtons();

    return this.ShowSpinner();
  }

  ShowSpinner() {
    this.button.element.append(this.main.spinner);

    return System.Delay(50);
  }
}
