import { Checkbox, Flex, Label } from "@style-guide";
import type { LabelPropsType } from "@style-guide/Label";
import type OptionsSectionClassType from "./OptionsSection";

export default class OptionChild {
  main: OptionsSectionClassType;
  #checkBoxLabelProps: LabelPropsType;

  container: import("@style-guide/Flex").FlexElementType;
  checkboxContainer: Checkbox;
  checkbox: HTMLInputElement;

  constructor(
    main: OptionsSectionClassType,
    checkBoxLabelProps: LabelPropsType,
  ) {
    this.main = main;
    this.#checkBoxLabelProps = checkBoxLabelProps;

    this.Render();
  }

  Render() {
    this.checkboxContainer = new Checkbox({
      id: null,
      onClick: this.Clicked.bind(this),
    });

    const children = this.#checkBoxLabelProps.text;
    delete this.#checkBoxLabelProps.text;

    this.container = Flex({
      marginRight: "m",
      children: new Label({
        tag: "label",
        type: "transparent",
        icon: this.checkboxContainer.element,
        children,
        ...this.#checkBoxLabelProps,
      }),
    });

    this.checkbox = this.checkboxContainer.input;
  }

  private Clicked(event: MouseEvent) {
    if (!this.main.main.disabled) return;

    event.preventDefault();
  }
}
