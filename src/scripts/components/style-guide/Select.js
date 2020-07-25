// @flow strict

import classnames from "classnames";
import AddChildren, { type ChildrenParamType } from "./helpers/AddChildren";
import SetProps from "./helpers/SetProps";

const SG = "sg-select";
const SGD = `${SG}--`;

type SelectSizeType = "large" | "normal";

type SelectColorType = "default" | "white";

type OptionPropsType = {
  value?: string | number,
  text?: string,
  title?: string,
  [x: string]: *,
};

type SelectPropsType = {
  value?: string | number | string[] | number[],
  valid?: boolean,
  invalid?: boolean,
  capitalized?: boolean,
  fullWidth?: boolean,
  multiple?: boolean,
  size?: SelectSizeType,
  color?: SelectColorType,
  className?: string,
  options?: (OptionPropsType | HTMLOptionElement | HTMLOptGroupElement)[],
  children?: ChildrenParamType,
  ...
};

export default class Select {
  value: ?(string | number | string[] | number[]);
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

    this.element = document.createElement("div");
    this.element.className = selectClass;

    if (multiple !== null && multiple !== undefined) {
      this.iconContainer = document.createElement("div");
      this.iconContainer.className = `${SG}__icon`;

      this.element.append(this.iconContainer);
    }

    this.select = document.createElement("select");
    this.select.className = `${SG}__element`;

    this.RenderOptions();
    AddChildren(this.select, children);
    SetProps(this.select, props);

    this.element.append(this.select);
  }

  RenderOptions() {
    this.optionElements = this.options.map(option => {
      if (option instanceof HTMLElement) return option;

      const { value, text, title, ...props } = option;
      const optionElement = document.createElement("option");

      if (title !== undefined && title !== null) optionElement.title = title;

      if (text !== undefined && text !== null) optionElement.innerHTML = text;

      if (value !== undefined && value !== null)
        optionElement.value = String(value);

      if (this.value !== undefined && this.value !== null)
        if (this.value instanceof Array)
          // @ts-ignore
          optionElement.selected = this.value.includes(value);
        else optionElement.selected = this.value === value;

      SetProps(optionElement, props);

      this.select.appendChild(optionElement);

      return optionElement;
    });
  }
}
