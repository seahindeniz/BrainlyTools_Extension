import classnames from "classnames";
import CreateElement from "../CreateElement";
import { ChildrenParamType } from "./helpers/AddChildren";

const SG = "sg-select";
const SGD = `${SG}--`;

type SelectSizeType = "large" | "normal";

type SelectColorType = "default" | "white";

type OptionPropsType = {
  value?: string | number;
  text?: string;
  title?: string;
  [x: string]: any;
};

type SelectPropsType = {
  value?: string | number | string[] | number[];
  valid?: boolean;
  invalid?: boolean;
  capitalized?: boolean;
  fullWidth?: boolean;
  multiple?: boolean;
  size?: SelectSizeType;
  color?: SelectColorType;
  className?: string;
  options?: (OptionPropsType | HTMLOptionElement | HTMLOptGroupElement)[];
  children?: ChildrenParamType;
  [x: string]: any;
};

export default class Select {
  value: string | number | string[] | number[];
  options: (OptionPropsType | HTMLOptionElement | HTMLOptGroupElement)[];

  element: HTMLDivElement;
  select: HTMLSelectElement;
  iconContainer: HTMLDivElement;

  optionElements: (HTMLOptionElement | HTMLOptGroupElement)[];

  constructor({
    valid,
    invalid,
    capitalized,
    fullWidth,
    value,
    size = "normal",
    color,
    className,
    multiple,
    options = [],
    children,
    ...props
  }: SelectPropsType = {}) {
    if (valid === true && invalid === true)
      throw Error("Select can be either valid or invalid!");

    this.value = value;
    this.options = options;

    const selectClass = classnames(
      SG,
      {
        [`${SGD}valid`]: valid,
        [`${SGD}invalid`]: invalid,
        [`${SGD}capitalized`]: capitalized,
        [`${SGD}full-width`]: fullWidth,

        [`${SGD}multiple`]: multiple,
        [SGD + size]: multiple === true && size !== "normal",
        [SGD + String(color)]: color,
      },
      className,
    );

    if (multiple !== null && multiple !== undefined) {
      this.iconContainer = document.createElement("div");
      this.iconContainer.className = `${SG}__icon`;
    }

    this.select = document.createElement("select");
    this.select.className = `${SG}__element`;

    this.element = CreateElement({
      tag: "div",
      className: selectClass,
      children: [this.iconContainer, children, this.select],
      ...props,
    });

    this.RenderOptions();
  }

  RenderOptions() {
    this.optionElements = this.options.map(option => {
      if (option instanceof HTMLElement) return option;

      const { value, text, title, ...props } = option;
      const optionElement = CreateElement({
        tag: "option",
        title,
        children: [text],
        value,
        selected:
          this.value instanceof Array
            ? // @ts-expect-error
              this.value.includes(value)
            : this.value === value,
        ...props,
      });

      /* if (this.value !== undefined && this.value !== null)
        if (this.value instanceof Array)
          // @ts-ignore
          optionElement.selected = this.value.includes(value);
        else optionElement.selected = this.value === value; */

      this.select.appendChild(optionElement);

      return optionElement;
    });
  }
}
