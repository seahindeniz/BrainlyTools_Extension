/* eslint-disable no-underscore-dangle */
import classnames from "classnames";
import SetProps from "./helpers/SetProps";

/**
 * @typedef {'button'
 * | 'color'
 * | 'date'
 * | 'datetime-local'
 * | 'email'
 * | 'file'
 * | 'hidden'
 * | 'image'
 * | 'month'
 * | 'number'
 * | 'password'
 * | 'range'
 * | 'reset'
 * | 'search'
 * | 'submit'
 * | 'tel'
 * | 'text'
 * | 'time'
 * | 'url'
 * | 'week'
 * } Type
 *
 * @typedef {'default' | 'white'} Color
 * @typedef {'m' | 'l'} Size
 *
 * @typedef {{
 *  Valid: _Valid,
 *  Invalid: _Invalid,
 *  Natural: _Natural
 * } & HTMLInputElement} InputElement
 *
 * @typedef {{
 *  type?: Type,
 *  color?: Color,
 *  size?: Size,
 *  title?: string,
 *  value?: string,
 *  placeholder?: string,
 *  valid?: boolean,
 *  invalid?: boolean,
 *  fullWidth?: boolean,
 *  noBorder?: boolean,
 *  className?: string,
 *  withIcon?: boolean,
 *  errorMessage?: string,
 *  [x: string]: *
 * }} Properties
 */

const sg = "sg-input";
const SGD = `${sg}--`;

/**
 * @this {InputElement}
 */
function _Valid() {
  this.Natural();

  this.classList.add(`${SGD}valid`);

  return this;
}

/**
 * @this {InputElement}
 */
function _Invalid() {
  this.Natural();

  this.classList.add(`${SGD}invalid`);

  return this;
}

/**
 * @this {InputElement}
 */
function _Natural() {
  this.classList.remove(`${SGD}valid`, `${SGD}invalid`);

  return this;
}

/**
 *
 * @param {Properties} param0
 */
export default ({
  type = "text",
  color = "default",
  size = "m",
  title,
  value,
  placeholder,
  valid,
  invalid,
  fullWidth,
  noBorder,
  className,
  withIcon,
  errorMessage,
  ...props
} = {}) => {
  if (valid === true && invalid === true)
    throw Error("Input can be either valid or invalid!");

  const inputClass = classnames(
    sg,
    {
      [SGD + size]: size !== "normal",
      [SGD + color]: color !== "default",
      [`${SGD}full-width`]: fullWidth,
      [`${SGD}no-border`]: noBorder,
      [`${SGD}with-icon`]: withIcon,
    },
    className,
  );

  const wrapperClass = classnames("sg-input__wrapper", {
    "sg-input__wrapper--full-width": fullWidth,
  });
  const errorMessageDisplayed =
    invalid === true && errorMessage !== undefined && errorMessage !== "";

  /**
   * @type {InputElement}
   */
  // @ts-ignore
  const input = document.createElement("input");
  input.type = type;
  input.Valid = _Valid;
  input.Invalid = _Invalid;
  input.Natural = _Natural;
  input.className = inputClass;

  if (title) input.title = title;

  if (value) input.value = value;

  if (placeholder) input.placeholder = placeholder;

  SetProps(input, props);

  if (valid) input.Valid();

  if (invalid) input.Invalid();

  if (!errorMessageDisplayed) return input;
};
