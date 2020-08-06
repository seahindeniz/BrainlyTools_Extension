import Build from "@/scripts/helpers/Build";
import classnames from "classnames";
import CreateElement from "../CreateElement";
import Flex from "./Flex";
import Text from "./Text";

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
};

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

    const inputClass = classnames(
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

    const wrapperClass = classnames("sg-input__wrapper", {
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
        className: inputClass,
        value,
      });
      this.element = this.input;
    }
  }
}
