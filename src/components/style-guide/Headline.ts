import CreateElement from "@components/CreateElement";
import clsx from "clsx";
import type { ChildrenParamType } from "./helpers/AddChildren";
import type { CommonComponentPropsType } from "./helpers/SetProps";

export type HeadlineTagMapType = {
  span: HTMLSpanElement;
} & {
  [tag in "h1" | "h2" | "h3" | "h4" | "h5" | "h6"]: HTMLHeadingElement;
};

export type HeadlineSizeType =
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "xxxlarge";

export type HeadlineColorType =
  | "default"
  | "white"
  | "gray"
  | "gray-secondary"
  | "gray-secondary-light"
  | "mint-dark"
  | "peach-dark"
  | "lavender-dark"
  | "mustard-dark"
  | "blue-dark";

export type HeadlineTransformType = "uppercase" | "lowercase" | "capitalize";

export type HeadlineAlignType =
  | "to-left"
  | "to-center"
  | "to-right"
  | "justify";

export type HeadlinePropsType<T> = {
  tag?: T;
  children?: ChildrenParamType;
  size?: HeadlineSizeType;
  // type?: HeadlineTypeType;
  color?: HeadlineColorType;
  transform?: HeadlineTransformType;
  align?: HeadlineAlignType;
  className?: string;
  extraBold?: boolean;
} & CommonComponentPropsType;

const Headline = <T extends keyof HeadlineTagMapType>({
  children,
  tag,
  size = "medium",
  extraBold,
  transform,
  align,
  color,
  className,
  ...props
}: HeadlinePropsType<T>): HeadlineTagMapType[T] => {
  const headlineClass = clsx(
    "sg-headline",
    {
      [`sg-headline--${size}`]: size !== "medium",
      [`sg-headline--${String(color)}`]: color,
      [`sg-headline--${String(transform)}`]: transform,
      [`sg-headline--${align || ""}`]: align,
      "sg-headline--extra-bold": extraBold,
    },
    className,
  );

  return CreateElement({
    tag: tag || "h1",
    className: headlineClass,
    children,
    ...props,
  });
};

export default Headline;
