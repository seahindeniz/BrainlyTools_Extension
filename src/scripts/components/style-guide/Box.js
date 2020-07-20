// @flow

import AddChildren from "@style-guide/helpers/AddChildren";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import SetProps from "@style-guide/helpers/SetProps";
import classNames from "classnames";

export type ColorType =
  | "dark"
  | "light"
  | "blue"
  | "lavender"
  | "mint"
  | "mint-secondary"
  | "mint-secondary-light"
  | "mint-secondary-ultra-light"
  | "blue-secondary"
  | "blue-secondary-light"
  | "gray-secondary-lightest"
  | "gray-secondary-ultra-light"
  | "mustard-primary"
  | "peach"
  | "peach-secondary"
  | "peach-secondary-light";

type PaddingType = "xxs" | "xs" | "s" | "m" | "l" | "xl";

type BoxBorderType =
  | {
      border: true,
      borderColor?: ColorType,
    }
  | {
      border?: false,
      borderColor?: null,
    };

type BoxPropsType = {
  children?: ChildrenParamType,
  className?: ?string,
  color?: ?ColorType,
  shadow?: boolean,
  padding?: PaddingType | null,
  noBorderRadius?: boolean,
  border: boolean,
  borderColor?: ColorType,
  ...
} /* & BoxBorderType */;

export default class {
  color: ?ColorType;
  borderColor: ?ColorType;
  element: HTMLDivElement;

  constructor({
    children,
    className,
    color,
    padding = "m",
    border = false,
    borderColor = "gray-secondary-lightest",
    noBorderRadius = false,
    shadow = false,
    ...props
  }: BoxPropsType) {
    this.color = color;
    this.borderColor = borderColor;

    const classes = classNames(
      "sg-box",
      {
        [`sg-box--padding-${String(padding)}`]: padding !== null && padding,
        "sg-box--border": border,
        [`sg-box--border-color-${String(borderColor)}`]: border && borderColor,
        "sg-box--shadow": shadow,
        "sg-box--no-border-radius": noBorderRadius,
      },
      className,
    );

    this.element = document.createElement("div");
    this.element.className = classes;

    this.ChangeColor(color);
    SetProps(this.element, props);
    AddChildren(this.element, children);
  }

  ChangeColor(color: ?ColorType) {
    if (this.color)
      this.element.classList.remove(`sg-box--${String(this.color)}`);

    this.element.classList.add(`sg-box--${String(color)}`);

    this.color = color;
  }

  ChangeBorderColor(borderColor: ?ColorType) {
    if (this.borderColor)
      this.element.classList.remove(
        `sg-box--border-color-${String(this.borderColor)}`,
      );

    this.element.classList.add(`sg-box--border-color-${String(borderColor)}`);

    this.borderColor = borderColor;
  }
}
