import { Flex, Radio } from "@style-guide";
import type * as RadioSectionTypes from "./RadioSection";

export default class RadioChild {
  main: RadioSectionTypes.default;
  name: string;
  data: RadioSectionTypes.OptionPropType;
  container: import("@style-guide/Flex").FlexElementType;
  radio: Radio;
  radioChecked: boolean;

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
    this.radioChecked = false;

    this.container = Flex({
      marginRight: "m",
      children: this.radio = new Radio({
        name: this.name,
        id: null,
        label: {
          children: this.data.text,
        },
        onClick: this.Clicked.bind(this),
        onChange: this.Selected.bind(this),
      }),
    });
  }

  private Clicked(event: MouseEvent) {
    if (this.main.main.disabled) {
      event.preventDefault();

      return;
    }

    if (this.main.selectedRadio === this && this.radioChecked === true) {
      this.radio.checked = false;
      this.radioChecked = false;

      this.Selected();
    }
  }

  private Selected() {
    if (!this.radio.checked) {
      this.main.selectedRadio = null;

      this.main.Deselected();
    } else {
      this.main.selectedRadio = this;

      this.main.Selected();
    }

    this.radioChecked = this.radio.checked;
  }
}
