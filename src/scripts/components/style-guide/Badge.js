import classnames from 'classnames';
import Text from './Text';

/**
 * @typedef {"light" | "peach" | "mustard" | "mint" | "mint-secondary" |
 * "blue-secondary" | "blue" | "gray-secondary" | "mint-secondary-light" |
 * "peach-secondary-light" | "blue-secondary-light" | "lavender"} Color
 *
 * @typedef {"small" | "normal" | "large"} Size
 *
 * @typedef {{
 * text?: import("./Text").Properties,
 * color?: Color, size?: Size,
 * rounded?: boolean,
 * withAnimation?: boolean,
 * children?: HTMLElement,
 * className?: string,
 * }} Properties
 */

const BADGE_COLOR = {
  NORMAL: 'light',
  PEACH: 'peach',
  MUSTARD: 'mustard',
  MINT: 'mint',
  MINT_SECONDARY: 'mint-secondary',
  BLUE_SECONDARY: 'blue-secondary',
  BLUE: 'blue',
  GRAY_SECONDARY: 'gray-secondary',
  MINT_SECONDARY_LIGHT: 'mint-secondary-light',
  PEACH_SECONDARY_LIGHT: 'peach-secondary-light',
  BLUE_SECONDARY_LIGHT: 'blue-secondary-light',
  LAVENDER: 'lavender',
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
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({
  text,
  color = "light",
  size = "normal",
  rounded,
  withAnimation,
  children,
  className,
  ...props
} = {}) {
  const badgeClass = classnames(
    SG, {
      [SGD + color]: color !== BADGE_COLOR.NORMAL,
      [SGD + size]: size !== "normal",
      [`${SGD}rounded`]: rounded,
      [`${SGD}animation`]: withAnimation,
    },
    className
  );

  let badge = document.createElement("div");
  badge.className = badgeClass;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      badge[propName] = propVal;

  let textElement = Text({
    weight: "bold",
    // @ts-ignore
    color: TEXT_COLOR_MAPPING[color],
    size: size === "large" ? "normal" : "xsmall",
    children,
    ...text
  });

  badge.append(textElement);

  return badge;
}
