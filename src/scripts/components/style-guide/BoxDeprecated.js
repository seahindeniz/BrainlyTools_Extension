/* eslint-disable no-underscore-dangle */
import classnames from "classnames";
import Icon from "./Icon";
import AddChildren from "./helpers/AddChildren";
import SetProps from "./helpers/SetProps";

/**
 * @typedef {(
 * | "blue"
 * | "lavender"
 * | "dark"
 * | "mint"
 * | "mint-secondary"
 * | "mint-secondary-light"
 * | "navyblue-secondary"
 * | "blue-secondary"
 * | "blue-secondary-light"
 * | "gray-secondary-lightest"
 * | "gray-secondary-ultra-light"
 * | "mustard-primary"
 * | "peach"
 * | "peach-secondary"
 * | "peach-secondary-light"
 * | "transparent"
 * )} Color
 *
 * @typedef {(
 * | "light"
 * | "dark"
 * )} CloseIconColor
 *
 * @typedef {(
 * | "no"
 * | "small"
 * | "xsmall"
 * | "xxsmall"
 * | "large"
 * )} Padding
 *
 * @typedef {"small" | "normal" | "large"} Size
 *
 * @typedef {{
 *  color?: Color,
 *  padding?: Padding,
 *  full?: boolean,
 *  children?: import('./helpers/AddChildren').ChildrenParamType,
 *  border?: "default" | "no" | "light",
 *  imgSrc?: string,
 *  noMinHeight?: boolean,
 *  shadow?: boolean,
 *  noBorderRadius?: boolean,
 *  onClose?: EventListenerOrEventListenerObject,
 *  closeIconColor?: CloseIconColor,
 *  className?: ?string,
 *  [x: string]: *,
 * }} Properties
 *
 * @typedef {function(Color):BoxElement} ChangeColor
 *
 * @typedef {{color?: Color, ChangeColor?: ChangeColor}} CustomProps
 *
 * @typedef {HTMLDivElement & CustomProps} BoxElement
 */

const SG = "sg-box-deprecated";
const SGD = `${SG}--`;

export const PADDING = {
  no: "no-padding",
  small: "small-padding",
  xsmall: "xsmall-padding",
  xxsmall: "xxsmall-padding",
  large: "large-padding",
};

/**
 * @this {BoxElement}
 * @param {Color} color
 */
function _ChangeColor(color) {
  this.classList.remove(SGD + this.color);
  this.classList.add(SGD + color);

  this.color = color;

  return this;
}

/**
 * @param {Properties} param0
 */
export default function ({
  color,
  padding,
  full,
  children,
  border = color ? "no" : "default",
  imgSrc,
  noMinHeight,
  shadow,
  noBorderRadius,
  onClose,
  closeIconColor,
  className,
  ...props
} = {}) {
  const boxClass = classnames(
    SG,
    {
      [SGD + color]: color,
      [`${SGD + border}-border`]: border && border !== "default",
      [`${SGD}full`]: full,
      [SGD + PADDING[padding]]: PADDING[padding],
      [`${SGD}image-wrapper`]: imgSrc,
      [`${SGD}no-min-height`]: noMinHeight,
      [`${SGD}with-shadow`]: shadow,
      [`${SGD}no-border-radius`]: noBorderRadius,
    },
    className,
  );

  /**
   * @type {BoxElement}
   */
  // @ts-ignore
  const box = document.createElement("div");
  box.className = boxClass;

  if (onClose) {
    const close = document.createElement("div");
    close.className = `${SG}__close`;
    close.addEventListener("click", onClose);

    box.append(close);

    const icon = new Icon({
      size: 16,
      type: "close",
      color: closeIconColor,
    });

    close.append(icon.element);
  }

  let content;

  if (imgSrc !== undefined && imgSrc !== null) {
    content = document.createElement("img");
    content.className = `${SG}__image`;
    content.src = imgSrc;
  } else {
    content = document.createElement("div");
    content.className = `${SG}__hole`;

    AddChildren(content, children);
  }

  box.append(content);

  SetProps(box, props);

  box.color = color;
  // @ts-ignore
  box.ChangeColor = _ChangeColor;

  return box;
}
