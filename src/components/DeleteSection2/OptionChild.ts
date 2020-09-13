import { Checkbox, Flex, LabelDeprecated } from "@style-guide";
import type { LabelPropsType } from "@style-guide/LabelDeprecated";
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
    });
    this.container = Flex({
      children: LabelDeprecated({
        type: "transparent",
        containerTag: "label",
        icon: this.checkboxContainer.element,
        ...this.#checkBoxLabelProps,
      }),
    });

    this.checkbox = this.checkboxContainer.input;
  }
}
