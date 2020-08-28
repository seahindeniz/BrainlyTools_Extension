import CreateElement from "@root/scripts/components/CreateElement";
import HideElement from "@root/scripts/helpers/HideElement";
import { Button, Flex } from "@style-guide";
import type { ButtonPropsType } from "@style-guide/Button";
import type { FlexElementType } from "@style-guide/Flex";
import { TextElement } from "@style-guide/Text";
import tippy from "tippy.js";
import type QuickActionButtonsClassType from "../QuickActionButtons";

export default class ActionButton {
  main: QuickActionButtonsClassType;
  buttonProps: ButtonPropsType;
  #tooltipContent: string | TextElement<"div">;

  container: FlexElementType;
  button: Button;

  constructor(
    main: QuickActionButtonsClassType,
    buttonProps: ButtonPropsType,
    tooltipContent?: string | TextElement<"div">,
  ) {
    this.main = main;
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
      children: CreateElement({
        tag: "div",
        style: {
          position: "relative",
        },
        children: [
          (this.button = new Button({
            size: this.main.buttonSize,
            ...this.buttonProps,
          })),
        ],
      }),
    });

    if (this.#tooltipContent) {
      // const tp =
      tippy(this.button.element, {
        allowHTML: true,
        content: this.#tooltipContent,
        theme: "light",
        // trigger: "manual",
      });

      // TODO remove this comment
      /* this.button.element.addEventListener("mouseenter", () => {
        tp.show();
      }); */
    }

    this.Show();
  }

  Show(prepend?: boolean) {
    if (!prepend) {
      this.main.container.append(this.container);

      return;
    }

    this.main.container.prepend(this.container);
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
