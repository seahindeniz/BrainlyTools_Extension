import classnames from 'classnames';

/**
 * @typedef {"button" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week"} Type
 * @typedef {"normal" | "light" | "light-alt"} Color
 * @typedef {"small" | "normal" | "large"} Size
 *
 * @typedef {{Valid: Valid, Invalid: Invalid, Natural: Natural} & HTMLInputElement} InputElement
 *
 * @typedef {{type?: Type, color?: Color, size?: Size, title?: string, value?: string, placeholder?: string, valid?: boolean, invalid?: boolean, fullWidth?: boolean, noBorder?: boolean, className?: string, withIcon?: boolean}} Properties
 */

const sg = "sg-input";
const SGD = `${sg}--`;

/**
 *
 * @param {Properties} param0
 */
export default function Input({ type = "text", color = "normal", size = "normal", title, value, placeholder, valid, invalid, fullWidth, noBorder, className, withIcon } = {}) {
  if (valid === true && invalid === true)
    throw "Input can be either valid or invalid!";

  const inputClass = classnames(sg, {
    [SGD + size]: size !== "normal",
    [SGD + color]: color !== "normal",
    [`${SGD}full-width`]: fullWidth,
    [`${SGD}no-border`]: noBorder,
    [`${SGD}with-icon`]: withIcon
  }, className);

  /**
   * @type {InputElement}
   */
  // @ts-ignore
  let input = document.createElement("input");
  input.type = type;
  input.Valid = Valid;
  input.Invalid = Invalid;
  input.Natural = Natural;
  input.className = inputClass;

  if (title)
    input.title = title;

  if (value)
    input.value = value;

  if (placeholder)
    input.placeholder = placeholder;

  if (valid)
    input.Valid();

  if (invalid)
    input.Invalid();

  return input;
}

/**
 * @this {InputElement}
 * @typedef {Valid} Valid
 */
function Valid() {
  this.Natural();

  this.classList.add(`${SGD}valid`);

  return this;
}

/**
 * @this {InputElement}
 * @typedef {Invalid} Invalid
 */
function Invalid() {
  this.Natural();

  this.classList.add(`${SGD}invalid`);

  return this;
}

/**
 * @this {InputElement}
 * @typedef {Natural} Natural
 */
function Natural() {
  this.classList.remove(`${SGD}valid`, `${SGD}invalid`);

  return this;
}
