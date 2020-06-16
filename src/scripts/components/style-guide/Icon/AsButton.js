import classnames from "classnames";
import SetProps from "@style-guide/helpers/SetProps";
import Icon, * as IconModule from ".";
import AddChildren from "../helpers/AddChildren";
/**
 * @typedef {{
 *  color?: IconModule.Color,
 *  size?: keyof SIZE,
 *  type?: IconModule.IconTypeType,
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  action?: boolean,
 *  transparent?: boolean,
 *  active?: boolean,
 *  border?: boolean,
 *  className?: string,
 *  title?: string,
 *  disabled?: boolean,
 *  pulsing?: boolean,
 *  iconSize?: IconModule.Size,
 *  [x: string]: *,
 * }} Properties
 *
 * @typedef {function(): ButtonElement} Enable
 * @typedef {function(): ButtonElement} Disable
 * @typedef {function(): ButtonElement} ToggleBorder
 * @typedef {function(IconModule.Color): ButtonElement} ChangeColor
 *
 * @typedef {{
 *  icon: IconModule.IconElement,
 *  color: IconModule.Color,
 *  Enable: Enable,
 *  Disable: Disable,
 *  ChangeColor: ChangeColor,
 *  ToggleBorder: ToggleBorder,
 * }} CustomProperties
 *
 * @typedef {CustomProperties &
 * (HTMLButtonElement | HTMLAnchorElement)
 * } ButtonElement
 */

const SG = "sg-icon-as-button";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;
const SIZE = {
  normal: 26,
  small: 18,
  xsmall: 14,
  xxsmall: 10,
};

/**
 * @param {Properties} param0
 * @returns {ButtonElement}
 */
export default function ({
  color,
  size = "normal",
  type,
  children,
  action,
  transparent,
  active,
  border,
  className,
  title,
  disabled,
  pulsing,
  iconSize,
  ...props
} = {}) {
  const buttonClass = classnames(
    SG,
    {
      [SGD + color]: color,
      [SGD + size]: size,
      [`${SGD}with-border`]: border,
      [`${SGD}action`]: action,
      [`${SGD}action-active`]: action === true && active === true,
      [`${SGD}transparent`]: transparent,
      [`${SGD}transparent-active`]: transparent === true && active === true,
      [`${SGD}disabled`]: disabled,
    },
    className,
  );

  let RenderTag = "button";

  if (props.href !== undefined && props.href !== null && props.href !== "")
    RenderTag = "a";

  /**
   * @type {ButtonElement}
   */
  // @ts-ignore
  const button = document.createElement(RenderTag);
  button.className = buttonClass;
  button.color = color;
  // @ts-ignore
  button.Enable = _Enable;
  // @ts-ignore
  button.Disable = _Disable;
  // @ts-ignore
  button.ChangeColor = _ChangeColor;
  // @ts-ignore
  button.ToggleBorder = _ToggleBorder;

  if (title) button.title = title;

  if (disabled && button instanceof HTMLButtonElement) button.disabled = true;

  SetProps(button, props);

  const hole = document.createElement("div");
  hole.className = `${SG_}hole`;

  button.append(hole);

  let content;

  if (type) {
    const icon = new Icon({
      type,
      color: "adaptive",
      // @ts-ignore
      size: iconSize || SIZE[size],
      title,
      pulsing,
    });
    content = icon.element;
    button.icon = content;
  } else content = children;

  AddChildren(hole, content);

  return button;
}

/**
 * @this {ButtonElement}
 * @returns {ButtonElement}
 */
function _Enable() {
  if (this instanceof HTMLButtonElement) this.disabled = false;

  this.classList.remove(`${SGD}disabled`);

  return this;
}

/**
 * @this {ButtonElement}
 * @returns {ButtonElement}
 */
function _Disable() {
  if (this instanceof HTMLButtonElement) this.disabled = true;

  this.classList.add(`${SGD}disabled`);

  return this;
}
/**
 * @this {ButtonElement}
 * @param {IconModule.Color} color
 */
function _ChangeColor(color) {
  this.classList.remove(SGD + this.color);
  this.classList.add(SGD + color);

  this.color = color;

  return this;
}
/**
 * @this {ButtonElement}
 */
function _ToggleBorder() {
  this.classList.toggle(`${SGD}with-border`);

  this.className = this.className;

  return this;
}
