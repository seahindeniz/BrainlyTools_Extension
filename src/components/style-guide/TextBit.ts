import CreateElement from "@components/CreateElement";
import clsx from "clsx";
import { ChildrenParamType } from "./helpers/AddChildren";
import { CommonComponentPropsType } from "./helpers/SetProps";

type TextBitTypeType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";

type TextBitSizeType = "small" | "medium" | "large" | "xlarge";

type TextBitColorType =
  | "blue-primary"
  | "blue-secondary"
  | "mint-primary"
  | "mint-secondary"
  | "lavender-primary"
  | "lavender-secondary"
  | "peach-primary"
  | "peach-secondary"
  | "mustard-primary"
  | "mustard-secondary"
  | "gray-secondary"
  | "gray-secondary-light"
  | "white"
  | "black";

type TextBitPropsType<T> = {
  children: ChildrenParamType;
  type?: T;
  size?: TextBitSizeType;
  color?: TextBitColorType;
  className?: string;
} & CommonComponentPropsType;

const TextBit = <T extends TextBitTypeType>({
  children,
  type,
  size = "medium",
  color,
  className,
  ...props
}: TextBitPropsType<T>): HTMLElementTagNameMap[T] => {
  const textClass = clsx(
    "sg-text-bit",
    {
      [`sg-text-bit--${size}`]: size && size !== "medium",
      [`sg-text-bit--${color || ""}`]: color,
    },
    className,
  );

  return CreateElement({
    ...props,
    tag: type || "h1",
    children,
    className: textClass,
  });
};

export default TextBit;
