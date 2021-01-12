import clsx from "clsx";
import CreateElement from "@components/CreateElement";
import Text, { TextPropsType } from "./Text";

type BadgeSizeType = "small" | "normal" | "large";

type BadgeColorType =
  | "light"
  | "peach"
  | "mustard"
  | "mint"
  | "mint-secondary"
  | "blue-secondary"
  | "blue"
  | "gray-secondary"
  | "mint-secondary-light"
  | "peach-secondary-light"
  | "blue-secondary-light"
  | "lavender";

type BadgePropsType = {
  textProps?: TextPropsType<"div">;
  color?: BadgeColorType;
  size?: BadgeSizeType;
  rounded?: boolean;
  withAnimation?: boolean;
  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType;
  className?: string;
  [x: string]: any;
};

const BADGE_COLOR = {
  NORMAL: "light",
  PEACH: "peach",
  MUSTARD: "mustard",
  MINT: "mint",
  MINT_SECONDARY: "mint-secondary",
  BLUE_SECONDARY: "blue-secondary",
  BLUE: "blue",
  GRAY_SECONDARY: "gray-secondary",
  MINT_SECONDARY_LIGHT: "mint-secondary-light",
  PEACH_SECONDARY_LIGHT: "peach-secondary-light",
  BLUE_SECONDARY_LIGHT: "blue-secondary-light",
  LAVENDER: "lavender",
};

const TEXT_COLOR_MAPPING = {
  [BADGE_COLOR.NORMAL]: "",
  [BADGE_COLOR.PEACH]: "white",
  [BADGE_COLOR.MUSTARD]: "white",
  [BADGE_COLOR.MINT]: "white",
  [BADGE_COLOR.MINT_SECONDARY]: "white",
  [BADGE_COLOR.BLUE_SECONDARY]: "white",
  [BADGE_COLOR.BLUE]: "white",
  [BADGE_COLOR.GRAY_SECONDARY]: "white",
  [BADGE_COLOR.MINT_SECONDARY_LIGHT]: "mint-dark",
  [BADGE_COLOR.PEACH_SECONDARY_LIGHT]: "peach-dark",
  [BADGE_COLOR.BLUE_SECONDARY_LIGHT]: "blue-dark",
  [BADGE_COLOR.LAVENDER]: "white",
};

const SG = "sg-badge";
const SGD = `${SG}--`;

export default ({
  textProps,
  color = "light",
  size = "normal",
  rounded,
  withAnimation,
  children,
  className,
  ...props
}: BadgePropsType = {}) => {
  const badgeClass = clsx(
    SG,
    {
      [SGD + color]: color !== BADGE_COLOR.NORMAL,
      [SGD + size]: size !== "normal",
      [`${SGD}rounded`]: rounded,
      [`${SGD}animation`]: withAnimation,
    },
    className,
  );

  const textElement = Text({
    weight: "bold",
    // @ts-expect-error
    color: TEXT_COLOR_MAPPING[color],
    size: size === "large" ? "medium" : "xsmall",
    children,
    ...textProps,
  });

  return CreateElement({
    tag: "div",
    className: badgeClass,
    children: textElement,
    ...props,
  });
};
