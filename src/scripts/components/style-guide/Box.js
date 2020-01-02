import classnames from 'classnames';
import Icon from './Icon';
import AddChildren from './helpers/AddChildren';

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
 *  border?: boolean,
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

const SG = "sg-box";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

export const PADDING = {
  no: 'no-padding',
  small: 'small-padding',
  xsmall: 'xsmall-padding',
  xxsmall: 'xxsmall-padding',
  large: 'large-padding',
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
      [SGD + PADDING[padding]]: PADDING[padding],
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

    AddChildren(content, children);
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
