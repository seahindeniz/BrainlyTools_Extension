/* eslint-disable no-use-before-define */
import classnames from "classnames";
import SetProps from "./helpers/SetProps";

type InputTypeType =
  | "button"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

type InputColorType = "default" | "white";

type InputSizeType = "m" | "l";

export type InputElementType = {
  Valid: typeof Valid;
  Invalid: typeof Invalid;
  Natural: typeof Natural;
} & HTMLInputElement;

type InputPropsType = {
  type?: InputTypeType;
  color?: InputColorType;
  size?: InputSizeType;
  title?: string;
  value?: string;
  placeholder?: string;
  valid?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  noBorder?: boolean;
  className?: string;
  withIcon?: boolean;
  errorMessage?: string;
  [x: string]: any;
};

const sg = "sg-input";
const SGD = `${sg}--`;

function Valid(this: InputElementType) {
  this.Natural();

  this.classList.add(`${SGD}valid`);

  return this;
}

function Invalid(this: InputElementType) {
  this.Natural();

  this.classList.add(`${SGD}invalid`);

  return this;
}

function Natural(this: InputElementType) {
  this.classList.remove(`${SGD}valid`, `${SGD}invalid`);

  return this;
}

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
}: InputPropsType = {}): InputElementType => {
  if (valid === true && invalid === true)
    throw Error("Input can be either valid or invalid!");

  const inputClass = classnames(
    sg,
    {
      [SGD + size]: size,
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

  // @ts-expect-error
  const input: InputElementType = document.createElement("input");
  input.type = type;
  props.Valid = Valid;
  props.Invalid = Invalid;
  props.Natural = Natural;
  input.className = inputClass;

  if (title) input.title = title;

  if (value) input.value = value;

  if (placeholder) input.placeholder = placeholder;

  SetProps(input, props);

  if (valid) input.Valid();

  if (invalid) input.Invalid();

  if (!errorMessageDisplayed) return input;
};
