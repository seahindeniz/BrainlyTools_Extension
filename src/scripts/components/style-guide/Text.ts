/* eslint-disable no-underscore-dangle */
import classnames from "classnames";
import CreateElement from "../CreateElement";
import { ChildrenParamType } from "./helpers/AddChildren";

const TEXT_ALIGN = {
  LEFT: "to-left",
  CENTER: "to-center",
  RIGHT: "to-right",
  JUSTIFY: "justify",
};

type TextSizeType =
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge";

export type TextColorType =
  | "default"
  | "white"
  | "gray"
  | "gray-secondary"
  | "gray-secondary-light"
  | "mint-dark"
  | "peach-dark"
  | "mustard-dark"
  | "lavender-dark"
  | "blue-dark";

type TextWhiteSpaceType = "pre-wrap" | "pre-line" | "nowrap";

type TextBgColorType =
  | "mustard"
  | "mint"
  | "peach"
  | "light-gray"
  | "blue-dark"
  | "blue-light";

type TextWeightType = "regular" | "bold" | "extra-bold";

type TextTransformType = "uppercase" | "lowercase" | "capitalize";

export type TextPropsType<T> = {
  children?: ChildrenParamType;
  text?: string | number;
  html?: string;
  size?: TextSizeType;
  weight?: TextWeightType;
  color?: TextColorType;
  transform?: TextTransformType;
  align?: keyof typeof TEXT_ALIGN;
  noWrap?: boolean;
  asContainer?: boolean;
  full?: boolean;
  breakWords?: boolean;
  whiteSpace?: TextWhiteSpaceType;
  title?: string;
  href?: string;
  underlined?: boolean;
  unstyled?: boolean;
  className?: string;
  bgColor?: TextBgColorType;
  tag?: T;
  fixPosition?: boolean;
  [x: string]: any;
};
type TextCustomProperties = {
  color?: TextColorType;
  // eslint-disable-next-line no-use-before-define
  ChangeColor?: typeof ChangeColor;
};

export type TextElement = TextCustomProperties & HTMLElement;

const SG = "sg-text";
const SGD = `${SG}--`;

function ChangeColor(this: TextElement, color: TextColorType) {
  this.classList.remove(SGD + this.color);

  if (color !== "default") this.classList.add(SGD + color);

  this.color = color;

  return this;
}

/**
 * template {keyof HTMLElementTagNameMap} T
 * param {{tag?: TextDefaultTagNamesType | T} & TextProperties} param0
 */
const Text = <T extends keyof HTMLElementTagNameMap>({
  children,
  text,
  html,
  size = "medium",
  weight = "regular",
  color = "default",
  transform,
  align,
  noWrap,
  asContainer,
  full,
  breakWords,
  whiteSpace,
  title,
  href,
  underlined,
  unstyled,
  className,
  bgColor,
  tag,
  fixPosition,
  ...props
}: TextPropsType<T>): TextCustomProperties & HTMLElementTagNameMap[T] => {
  const textClass = classnames(
    "sg-text",
    {
      [`sg-text--${String(size)}`]: size !== "medium",
      [`sg-text--${String(color)}`]: color !== "default",
      [`sg-text--${String(weight)}`]: weight !== "regular",
      [`sg-text--${transform || ""}`]: transform,
      [`sg-text--${TEXT_ALIGN[align] || ""}`]: TEXT_ALIGN[align],
      "sg-text--container": asContainer,
      "sg-text--full": full,
      "sg-text--no-wrap": noWrap,
      "sg-text--break-words": breakWords,
      "sg-text--pre-wrap": whiteSpace === "pre-wrap",
      "sg-text--pre-line": whiteSpace === "pre-line",
      "sg-text--nowrap": whiteSpace === "nowrap",

      [`sg-text--background-${bgColor}`]: bgColor,
      [`sg-text--underlined`]: underlined,
      [`sg-text--unstyled`]: unstyled,
      [`sg-text--fix-position`]: fixPosition,
      "sg-text--link": tag === "a" || href !== undefined,
    },
    className,
  );

  const textElement = CreateElement({
    tag: href !== undefined ? "a" : tag || "div",
    className: textClass,
    color,
    ChangeColor,
    children: [text, html, children],
    title,
    ...props,
  });

  if (textElement instanceof HTMLAnchorElement && href) textElement.href = href;

  // @ts-expect-error
  return textElement;
};

export default Text;
