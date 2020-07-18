// @flow strict

import AddChildren from "@style-guide/helpers/AddChildren";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import SetProps from "@style-guide/helpers/SetProps";
import classNames from "classnames";

type ColorType =
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
  /**
   * Children to be rendered inside of the Box
   * @example <Box>Text inside Box</Box>
   */
  children: ChildrenParamType,

  /**
   * Additional class names
   */
  className?: ?string,

  /**
   * Box background color
   * @example <Box color="mint-secondary">Text on a mint background</Box>
   */
  color?: ?ColorType,

  /**
   * Box shadow
   * @example <Box shadow>Text inside box with shadow</Box>
   * @default false
   */
  shadow?: boolean,

  /**
   * Padding size. Defaults to 'm' size, pass null to set it to 0
   * @example <Box padding="l">Text inside Box with large padding</Box>
   */
  padding?: PaddingType | null,

  /**
   * Disable border radius
   * @example <Box noBorderRadius>Text inside Box with no border radius</Box>
   * @default false
   */
  noBorderRadius?: boolean,

  /**
   * Box border and border color. Using borderColor without border will produce type error
   * @example <Box border borderColor="mint">Text inside bordered Box</Box>
   * @default false
   */
  ...BoxBorderType,

  ...
};

export default class {
  color: ?ColorType;
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

    const classes = classNames(
      "sg-box",
      {
        [`sg-box--padding-${String(padding)}`]: padding !== null && padding,
        [`sg-box--border-color-${String(borderColor)}`]: borderColor,
        "sg-box--border": border,
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
}
