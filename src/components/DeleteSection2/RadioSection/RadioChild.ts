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
    this.BindListener();
  }

  Render() {
    this.container = Flex({
      children: this.radio = new Radio({
        name: this.name,
        id: null,
        label: {
          text: this.data.text,
        },
      }),
    });
  }

  BindListener() {
    this.radio.input.addEventListener("click", this.Clicked.bind(this));
  }

  Clicked() {
    this.radio.checked = !this.radio.checked;

    if (!this.radio.checked) {
      this.main.selectedRadio = null;

      this.main.Deselected();
    } else {
      this.main.selectedRadio = this;

      this.main.Selected();
    }
  }
}
