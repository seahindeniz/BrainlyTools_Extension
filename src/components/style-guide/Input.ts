import Build from "@root/helpers/Build";
import clsx from "clsx";
import CreateElement from "@components/CreateElement";
import Flex from "./Flex";
import Text from "./Text";
import { CommonComponentPropsType } from "./helpers/SetProps";

type InputSizeType = "m" | "l";

type InputColorType = "default" | "white";

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

export type InputPropsType = {
  type?: InputTypeType;
  value?: string | number;
  size?: InputSizeType;
  color?: InputColorType;
  valid?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  withIcon?: boolean;
  errorMessage?: Node | string;
  className?: string;
  [x: string]: any;
} & CommonComponentPropsType;

export default class {
  element: HTMLDivElement | HTMLInputElement;
  input: HTMLInputElement;

  constructor({
    type = "text",
    size = "m",
    color = "default",
    fullWidth,
    withIcon,
    value,
    valid,
    invalid,
    className,
    errorMessage,
    ...props
  }: InputPropsType) {
    if (valid === true && invalid === true)
      throw Error("Input can be either valid or invalid!");

    const inputClass = clsx(
      "sg-input",
      {
        [`sg-input--${String(size)}`]: size !== "m",
        [`sg-input--${String(color)}`]: color !== "default",
        "sg-input--valid": valid,
        "sg-input--invalid": invalid,
        "sg-input--full-width": fullWidth,
        "sg-input--with-icon": withIcon,
      },
      className,
    );

    const wrapperClass = clsx("sg-input__wrapper", {
      "sg-input__wrapper--full-width": fullWidth,
    });

    const errorMessageDisplayed =
      invalid === true && errorMessage !== undefined && errorMessage !== "";

    if (errorMessageDisplayed) {
      this.element = Build(
        CreateElement({
          tag: "div",
          className: wrapperClass,
        }),
        [
          (this.input = CreateElement({
            tag: "input",
            ...props,
            type,
            className: inputClass,
            value,
          })),
          [
            Flex({
              marginTop: "xxs",
              marginLeft: size === "m" ? "s" : "m",
              marginRight: size === "m" ? "s" : "m",
            }),
            Text({
              color: "peach-dark",
              size: size === "m" ? "xsmall" : "small",
              children: errorMessage,
            }),
          ],
        ],
      );
    } else {
      this.input = CreateElement({
        tag: "input",
        ...props,
        type,
        className: inputClass,
        value,
      });
      this.element = this.input;
    }
  }

  Natural() {
    this.input.classList.remove(`sg-input--valid`, `sg-input--invalid`);
  }

  Valid() {
    this.Natural();

    this.input.classList.add(`sg-input--valid`);
  }

  Invalid() {
    this.Natural();

    this.input.classList.add(`sg-input--invalid`);
  }
}
