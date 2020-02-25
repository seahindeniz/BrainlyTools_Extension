import classnames from 'classnames';
import mergeDeep from "merge-deep";
import Icon from './Icon';

/**
 * @typedef {"xsmall" |
 * "small" | "medium" | "large" | "xlarge"} RoundButtonSizeType
 *
 * @typedef {import("./Icon").Properties} IconProperties
 *
 * @typedef {import("./Icon").Type} IconType
 *
 * @typedef {import("./Icon").Color} IconColor
 *
 * @typedef {IconType | IconProperties | HTMLElement} RoundButtonIconType
 *
 * @typedef {"black"
 * | "blue"
 * | "mint"
 * | "mustard"
 * | "peach"
 * } RoundButtonColorType
 *
 * @typedef {{
 *  size?: RoundButtonSizeType,
 *  icon?: RoundButtonIconType,
 *  color?: RoundButtonColorType,
 *  filled?: boolean,
 *  title?: string,
 *  className?: string,
 *  [x: string]: *,
 * }} Properties
 *
 * @typedef {function(): ButtonElement} Enable
 * @typedef {function(): ButtonElement} Disable
 * @typedef {function(): ButtonElement} ToggleBorder
 * @typedef {function(IconColor): ButtonElement} ChangeColor
 *
 * @typedef {{
 *  filled?: boolean,
 *  color: RoundButtonColorType,
 *  icon: import("./Icon").IconElement,
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

const SG = "sg-round-button";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

const ICON_SIZE_MAP = {
  xsmall: 14,
  small: 16,
  large: 32,
  xlarge: 46,
  default: 24,
}
/**
 * @param {Properties} param0
 * @returns {ButtonElement}
 */
export default function({
  size = 'medium',
  icon = 'heart',
  color,
  filled,
  className,
  title,
  ...props
} = {}) {
  const buttonClass = classnames(SG, {
    [SGD + color]: color,
    [SGD + size]: size,
    [`${SGD}filled`]: filled,
  }, className);
  /**
   * @type {"button" | "a"}
   */
  let buttonTagName = "button";

  if (props.href !== undefined && props.href !== null && props.href !== '')
    buttonTagName = "a";

  /**
   * @type {ButtonElement}
   */
  // @ts-ignore
  let button = document.createElement(buttonTagName);
  button.className = buttonClass;
  button.filled = filled;
  button.color = color;
  // @ts-ignore
  button.Enable = _Enable;
  // @ts-ignore
  button.Disable = _Disable;
  // @ts-ignore
  button.ChangeColor = _ChangeColor;
  // @ts-ignore
  button.ToggleBorder = _ToggleBorder;

  if (title)
    button.title = title;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      button[propName] = propVal;

  let span = document.createElement("span");
  span.className = `${SG_}hole`;

  button.append(span);

  if (icon instanceof HTMLElement) {
    // @ts-ignore
    button.icon = icon;
  } else {
    /**
     * @type {IconProperties}
     */
    let iconProps = {
      size: ICON_SIZE_MAP[size] || ICON_SIZE_MAP.default,
      color: filled !== undefined ? 'light' : color === 'black' ? 'dark' :
        color,
    };

    if (typeof icon === "string")
      iconProps.type = icon;
    else
      iconProps = mergeDeep(iconProps, icon);

    button.icon = Icon(iconProps);
  }

  span.append(button.icon);

  return button;
}

/**
 * @this {ButtonElement}
 * @returns {ButtonElement}
 */
function _Enable() {
  if (this instanceof HTMLButtonElement)
    this.disabled = false;

  this.classList.remove(`${SGD}disabled`);

  return this;
}

/**
 * @this {ButtonElement}
 * @returns {ButtonElement}
 */
function _Disable() {
  if (this instanceof HTMLButtonElement)
    this.disabled = true;

  this.classList.add(`${SGD}disabled`);

  return this;
}

/**
 * @this {ButtonElement}
 * @param {RoundButtonColorType} color
 */
function _ChangeColor(color) {
  this.classList.remove(SGD + this.color);
  this.classList.add(SGD + color);
  this.icon.ChangeColor(
    this.filled !== undefined ? 'light' : color === 'black' ? 'dark' : color
  );

  this.color = color;

  return this;
}

/**
 * @this {ButtonElement}
 */
function _ToggleBorder() {
  this.classList.toggle(`${SGD}with-border`)

  this.className = this.className;

  return this;
}
