// import type RadioSectionClassType from "./RadioSection";
// import type { OptionPropType } from "./RadioSection";
import { Flex, Radio } from "@style-guide";
import type * as RadioSectionTypes from "./RadioSection";

export default class RadioChild {
  main: RadioSectionTypes.default;
  name: string;
  data: RadioSectionTypes.OptionPropType;
  container: import("@style-guide/Flex").FlexElementType;
  radio: Radio;

  constructor(
    main: RadioSectionTypes.default,
    name: string,
    data: RadioSectionTypes.OptionPropType,
  ) {
    this.main = main;
    this.name = name;
    this.data = data;

    this.Render();
  }

  private Render() {
    this.container = Flex({
      children: this.radio = new Radio({
        name: this.name,
        id: null,
        label: {
          text: this.data.text,
        },
        onClick: this.Clicked.bind(this),
        onChange: this.Selected.bind(this),
      }),
    });
  }

  private Clicked(event: MouseEvent) {
    if (!this.main.main.disabled) return;

    event.preventDefault();
  }

  private Selected() {
    if (!this.radio.checked) {
      this.main.selectedRadio = null;

      this.main.Deselected();

      return;
    }

    this.main.selectedRadio = this;

    this.main.Selected();
  }
}
