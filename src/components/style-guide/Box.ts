import CreateElement from "@components/CreateElement";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import clsx from "clsx";
import { CommonComponentPropsType } from "./helpers/SetProps";

type ExtraBoxColorType =
  | "lavender-secondary"
  | "megaman"
  | "surf-crest"
  | "mustard-secondary";

export type BoxColorType =
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
  | "mustard-secondary-light"
  | "peach"
  | "peach-secondary"
  | "peach-secondary-light"
  | ExtraBoxColorType;

type PaddingType = "xxs" | "xs" | "s" | "m" | "l" | "xl";

const CLASS_PROP_NAMES = {
  border: "border",
  shadow: "shadow",
  noBorderRadius: "no-border-radius",
  fullHeight: "full-height",
};

export type BoxPropsType = {
  children?: ChildrenParamType;
  className?: string;
  color?: BoxColorType;
  shadow?: boolean;
  padding?: PaddingType | null;
  noBorderRadius?: boolean;
  border: boolean;
  borderColor?: BoxColorType;
  // additional
  fullHeight?: boolean;
  thinBorder?: boolean;
} & CommonComponentPropsType;

export default class {
  color: BoxColorType;
  borderColor: BoxColorType;
  element: HTMLDivElement;
  firstChild: any;

  constructor({
    children,
    className,
    color,
    padding = "m",
    border = false,
    borderColor,
    noBorderRadius = false,
    shadow = false,
    fullHeight,
    thinBorder,
    ...props
  }: BoxPropsType) {
    this.color = color;
    this.borderColor = borderColor;

    const classes = clsx(
      "sg-box",
      {
        [`sg-box--padding-${String(padding)}`]: padding,
        "sg-box--border": border,
        [`sg-box--border-color-${String(borderColor)}`]: border && borderColor,
        "sg-box--shadow": shadow,
        "sg-box--no-border-radius": noBorderRadius,
        "sg-box--full-height": fullHeight,
        "sg-box--border-thin": thinBorder,
      },
      className,
    );

    this.ChangeColor(color);

    this.element = CreateElement({
      tag: "div",
      className: classes,
      children,
      ...props,
    });
  }

  ChangeColor(color?: BoxColorType) {
    if (this.color)
      this.element.classList.remove(`sg-box--${String(this.color)}`);

    if (color) {
      this.element.classList.add(`sg-box--${String(color)}`);
    }

    this.color = color;
  }

  ChangeBorderColor(borderColor?: BoxColorType) {
    if (borderColor === this.borderColor) return;

    if (this.borderColor)
      this.element.classList.remove(
        `sg-box--border-color-${String(this.borderColor)}`,
      );

    if (borderColor)
      this.element.classList.add(
        "sg-box--border",
        `sg-box--border-color-${String(borderColor)}`,
      );
    else {
      this.element.classList.remove("sg-box--border");
    }

    this.borderColor = borderColor;
  }

  // eslint-disable-next-line class-methods-use-this
  ChangeProps(props: {
    border?: boolean;
    shadow?: boolean;
    noBorderRadius?: boolean;
    // additional
    fullHeight?: boolean;
  }) {
    Object.entries(props).forEach(([propName, propValue]) => {
      const className = CLASS_PROP_NAMES[propName];

      if (!className) return;

      if (propValue) {
        this.element.classList.add(`sg-box--${className}`);
      } else {
        this.element.classList.remove(`sg-box--${className}`);
      }
    });
  }

  ToggleThinBorder() {
    this.element.classList.toggle("sg-box--border-thin");
  }

  ShowBorder() {
    this.element.classList.add("sg-box--border");
  }

  HideBorder() {
    this.element.classList.remove("sg-box--border");
  }
}
