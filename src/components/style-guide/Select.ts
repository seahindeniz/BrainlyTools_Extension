import CreateElement from "@components/CreateElement";
import classnames from "classnames";
import { CommonComponentPropsType } from "./helpers/SetProps";
import Icon from "./Icon";

const SG = "sg-select";
const SGD = `${SG}--`;

type SelectSizeType = "m" | "l";

type SelectColorType = "default" | "white";

type OptionPropsType = {
  value?: string | number;
  text?: string;
  title?: string;
} & ObjectAnyType;

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
} & CommonComponentPropsType;

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
    size,
    color,
    className,
    multiple,
    options = [],
    ...props
  }: SelectPropsType = {}) {
    if (valid === true && invalid === true)
      throw Error("Select can be either valid or invalid!");

    this.value = value;
    this.options = options.filter(Boolean);

    const selectClass = classnames(
      SG,
      {
        [`${SGD}valid`]: valid,
        [`${SGD}invalid`]: invalid,
        [`${SGD}capitalized`]: capitalized,
        [`${SGD}full-width`]: fullWidth,

        [`${SGD}multiple`]: multiple,
        [SGD + size]: size && size !== "m",
        [SGD + String(color)]: color,
      },
      className,
    );

    if (!multiple) {
      this.iconContainer = CreateElement({
        tag: "div",
        className: `${SG}__icon`,
        children: new Icon({
          type: "arrow_down",
          color: "gray-secondary",
          size: size === "l" ? 24 : 16,
        }),
      });
    }

    this.select = CreateElement({
      tag: "select",
      className: `${SG}__element`,
      onChange: props.onChange,
      multiple,
    });

    delete props.onChange;

    this.element = CreateElement({
      tag: "div",
      className: selectClass,
      children: [this.iconContainer, this.select],
      ...props,
    });

    this.RenderOptions();
  }

  RenderOptions() {
    this.optionElements = this.options.map(option => {
      if (option instanceof HTMLElement) {
        this.select.append(option);

        return option;
      }

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

  Natural() {
    this.element.classList.remove(`sg-select--valid`, `sg-select--invalid`);
  }

  Valid() {
    this.Natural();

    this.element.classList.add(`sg-select--valid`);
  }

  Invalid() {
    this.Natural();

    this.element.classList.add(`sg-select--invalid`);
  }
}
