import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import classNames from "classnames";
import CreateElement from "../CreateElement";

type BubbleColorType =
  | "blue"
  | "lavender"
  | "dark"
  | "mint"
  | "mint-secondary"
  | "mint-secondary-light"
  | "navyblue-secondary"
  | "blue-secondary"
  | "blue-secondary-light"
  | "gray-secondary-lightest"
  | "peach";

type AlignmentType = "start" | "center" | "end";

type DirectionType = "left" | "right" | "top" | "bottom";

type BubblePropsType = {
  children?: ChildrenParamType;
  className?: string;
  alignment?: AlignmentType;
  direction?: DirectionType;
  color?: BubbleColorType;
  full?: boolean;
  noShadow?: boolean;
  [x: string]: any;
};

export default ({
  alignment = "center",
  direction,
  color,
  full,
  noShadow,
  children,
  className,
  ...props
}: BubblePropsType) => {
  let alignmentClass;

  if (direction === "left" || direction === "right") {
    alignmentClass = `sg-bubble--column-${alignment}`;
  } else {
    alignmentClass = `sg-bubble--row-${alignment}`;
  }

  const bubbleClass = classNames(
    "sg-bubble",
    {
      "sg-bubble--full": full,
      "sg-bubble--no-shadow": noShadow,
      [`sg-bubble--${String(color)}`]: color,
      [`sg-bubble--${direction}`]: direction,
      [alignmentClass]: alignment !== "center",
    },
    className,
  );

  return CreateElement({
    ...props,
    tag: "div",
    className: bubbleClass,
    children,
  });
};
