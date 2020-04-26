import classnames from "classnames";
import AddChildren from "./helpers/AddChildren";
import SetProps from "./helpers/SetProps";

/**
 * @typedef {'large' | 'normal'} SelectSizeType
 *
 * @typedef {'default' | 'white'} SelectColorType
 *
 * @typedef {{
 *  value?: string | number,
 *  text?: string,
 *  title?: string,
 *  [x: string]: *
 * }} OptionProperties
 *
 * @typedef {{
 *  value?: string | number | string[] | number[],
 *  valid?: boolean,
 *  invalid?: boolean,
 *  capitalized?: boolean,
 *  fullWidth?: boolean,
 *  multiple?: boolean,
 *  size?: SelectSizeType,
 *  color?: SelectColorType,
 *  className?: string,
 *  options?: (OptionProperties | HTMLOptionElement)[],
 *  children?: import('./helpers/AddChildren').ChildrenParamType,
 *  [propName: string]: *
 * }} SelectProperties
 */
const SG = "sg-select";
const SGD = `${SG}--`;

class Select {
  /**
   * @param {SelectProperties} param0
   */
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
  } = {}) {
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
        [SGD + color]: color,
      },
      className,
    );

    this.container = document.createElement("div");
    this.container.className = selectClass;

    if (!multiple) {
      this.icon = document.createElement("div");
      this.icon.className = `${SG}__icon`;

      this.container.append(this.icon);
    }

    this.select = document.createElement("select");
    this.select.className = `${SG}__element`;

    this.RenderOptions();
    AddChildren(this.select, children);
    SetProps(this.select, props);

    this.container.append(this.select);
  }

  RenderOptions() {
    this.optionElements = this.options.map(option => {
      if (option instanceof HTMLElement) return option;

      const { value, text, title, ...props } = option;
      const optionElement = document.createElement("option");

      if (title) optionElement.title = title;

      if (text) optionElement.innerHTML = text;

      if (value) optionElement.value = String(value);

      if (this.value)
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

/**
 * @param {SelectProperties} props
 */
export default function (props) {
  return new Select(props);
}
