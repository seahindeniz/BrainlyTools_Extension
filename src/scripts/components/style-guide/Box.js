import classnames from 'classnames';
import Icon from './Icon';

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
 * )} Color
 *
 * @typedef {(
 * | "light"
 * | "dark"
 * )} CloseIconColor
 *
 * @typedef {(
 * | "no-padding"
 * | "small-padding"
 * | "xsmall-padding"
 * | "xxsmall-padding"
 * | "large-padding"
 * )} Padding
 *
 * @typedef {"small" | "normal" | "large"} Size
 *
 * @typedef {{
 * color?: Color,
 * padding?: Padding,
 * full?: boolean,
 * children?: HTMLElement | HTMLElement[],
 * border?: boolean,
 * imgSrc?: string,
 * noMinHeight?: boolean,
 * shadow?: boolean,
 * noBorderRadius?: boolean,
 * onClose?: EventListenerOrEventListenerObject,
 * closeIconColor?: CloseIconColor,
 * className?: ?string,
 * }} Properties
 *
 * @typedef {function(Color):BoxElement} ChangeColor
 *
 * @typedef {{color?: Color, ChangeColor?: ChangeColor}} CustomProps
 *
 * @typedef {HTMLDivElement & CustomProps} BoxElement
 */

const SG = "sg-box";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

export const PADDING = {
  NO: 'no-padding',
  SMALL: 'small-padding',
  XSMALL: 'xsmall-padding',
  XXSMALL: 'xxsmall-padding',
  LARGE: 'large-padding',
};

/**
 * @param {Properties} param0
 */
export default function({
  color,
  padding,
  full,
  children,
  border = !color,
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
    SG, {
      [SGD + color]: color,
      [`${SGD}no-border`]: !border,
      [`${SGD}full`]: full,
      [SGD + padding]: padding,
      [`${SGD}image-wrapper`]: imgSrc,
      [`${SGD}no-min-height`]: noMinHeight,
      [`${SGD}with-shadow`]: shadow,
      [`${SGD}no-border-radius`]: noBorderRadius,
    },
    className
  );

  /**
   * @type {BoxElement}
   */
  // @ts-ignore
  let box = document.createElement("div");
  box.className = boxClass;

  if (onClose) {
    let close = document.createElement("div");
    close.className = `${SG_}close`;
    close.addEventListener("click", onClose);

    box.append(close);

    let icon = Icon({
      size: 16,
      type: "close",
      color: closeIconColor,
    });

    close.append(icon);
  }

  let content;

  if (imgSrc !== undefined && imgSrc !== null) {
    content = document.createElement("img");
    content.className = `${SG_}image`;
    content.src = imgSrc;
  } else {
    content = document.createElement("div");
    content.className = `${SG_}hole`;

    if (children instanceof Array && children.length > 0)
      content.append(...children);
    else if (children instanceof HTMLElement)
      content.append(children);
  }

  box.append(content);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      box[propName] = propVal;

  box.color = color;
  // @ts-ignore
  box.ChangeColor = _ChangeColor;

  return box;
}

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
