import { Checkbox, Flex, LabelDeprecated } from "@style-guide";
import type { CheckboxElementType } from "@style-guide/Checkbox";
import type { LabelPropsType } from "@style-guide/LabelDeprecated";
import type OptionsSectionClassType from "./OptionsSection";

export default class OptionChild {
  main: OptionsSectionClassType;
  #checkBoxProps: LabelPropsType;

  container: import("@style-guide/Flex").FlexElementType;
  checkboxContainer: CheckboxElementType;
  checkbox: HTMLInputElement;

  constructor(main: OptionsSectionClassType, checkBoxProps: LabelPropsType) {
    this.main = main;
    this.#checkBoxProps = checkBoxProps;

    this.Render();
  }

  Render() {
    this.container = Flex({
      children: LabelDeprecated({
        type: "transparent",
        containerTag: "label",
        icon: this.checkboxContainer = Checkbox({
          id: null,
        }),
        ...this.#checkBoxProps,
      }),
    });

    this.checkbox = this.checkboxContainer
      .firstElementChild as HTMLInputElement;
  }
}
