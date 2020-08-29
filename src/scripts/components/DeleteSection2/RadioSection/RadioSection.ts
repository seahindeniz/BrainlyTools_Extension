import generateRandomString from "@root/scripts/helpers/generateRandomString";
import { Flex } from "@style-guide";
import type DeleteSectionClassType from "../DeleteSection";
import RadioChild from "./RadioChild";

export type OptionPropType = {
  text: string;
  value: any;
};

export default class RadioSection {
  main: DeleteSectionClassType;
  #options: OptionPropType[];
  container?: import("@style-guide/Flex").FlexElementType;
  #defaultValue: string;
  selectedRadio: RadioChild;

  constructor(
    main: DeleteSectionClassType,
    options: OptionPropType[],
    defaultValue?: string,
  ) {
    this.main = main;
    this.#options = options;
    this.#defaultValue = defaultValue;

    this.Render();
  }

  get value() {
    if (this.#defaultValue) return this.#defaultValue;

    return this.selectedRadio?.data.value;
  }

  private Render() {
    if (this.#defaultValue) {
      this.Selected();

      return;
    }

    this.container = Flex({
      wrap: true,
      marginBottom: "s",
    });

    this.main.radioSectionContainer.append(this.container);

    this.RenderRadios();
  }

  private RenderRadios() {
    const radioName = generateRandomString();

    this.#options.forEach(option => {
      const radio = new RadioChild(this, radioName, option);

      this.container.append(radio.container);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  ShowWarning() {
    //
  }

  // eslint-disable-next-line class-methods-use-this
  Selected() {
    //
  }

  // eslint-disable-next-line class-methods-use-this
  Deselected() {
    //
  }
}
