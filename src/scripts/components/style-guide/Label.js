import classnames from 'classnames';
import mergeDeep from "merge-deep";
import AddChildren from './helpers/AddChildren';
import Icon from './Icon';
import Text from './Text';

/**
 * @typedef {import("./Icon").Properties} IconProperties
 * @typedef {import("./Icon").Type} IconType
 * @typedef {IconType | IconProperties | HTMLElement} LabelIconType
 *
 * @typedef {'strong'} LabelType
 *
 * @typedef {'blue'
 * | 'mint'
 * | 'lavender'
 * | 'peach'
 * | 'mustard'
 * | 'gray'
 * | 'mono'
 * } LabelColorType
 *
 * @typedef {{
 *  type?: LabelType,
 *  color?: LabelColorType,
 *  icon?: LabelIconType,
 *  onClose?: function(MouseEvent): HTMLButtonElement,
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  className?: string,
 *  text?: string,
 *  [x: string]: *,
 * }} Properties
 *
 * @typedef {function(string): LabelElement} ChangeText
 * @typedef {function(LabelIconType): LabelElement} ChangeIcon
 * @typedef {function(LabelColorType): LabelElement} ChangeColor
 *
 * @typedef {{
 *  type: LabelType,
 *  color: LabelColorType,
 *  ChangeText: ChangeText,
 *  ChangeIcon: ChangeIcon,
 *  ChangeColor: ChangeColor,
 * }} CustomProperties
 *
 * @typedef {HTMLDivElement & CustomProperties} LabelElement
 */

const SG = "sg-label";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

export const COLORS_STRONG_MAP = {
  blue: 'blue-primary',
  mint: 'mint-primary',
  lavender: 'lavender-primary',
  peach: 'peach-primary',
  mustard: 'mustard-primary',
  gray: 'gray-primary',
  mono: 'black',
};

export const COLORS_DEFAULT_MAP = {
  blue: 'blue-secondary-light',
  mint: 'mint-secondary-light',
  lavender: 'lavender-secondary-light',
  peach: 'peach-secondary-light',
  mustard: 'mustard-secondary-light',
  gray: 'gray-secondary-light',
  mono: 'white',
};

/**
 * @param {Properties} param0
 */
export default function({
  children,
  type,
  icon,
  onClose,
  color,
  className,
  text,
  ...props
} = {}) {
  /**
   * @type {string}
   */
  const filteredColor = !type ? COLORS_DEFAULT_MAP[color] : COLORS_STRONG_MAP[
    color];

  const labelClass = classnames(SG, {
    [SGD + filteredColor]: color,
    [SGD + type]: type,
    [`${SGD}closable`]: !!onClose,
  }, className);

  /**
   * @type {LabelElement}
   */
  // @ts-ignore
  let labelContainer = document.createElement("div");
  labelContainer.className = labelClass;
  labelContainer.color = color;
  labelContainer.type = type;
  labelContainer.ChangeText = _ChangeText;
  labelContainer.ChangeIcon = _ChangeIcon;
  // @ts-ignore
  labelContainer.ChangeColor = _ChangeColor;

  if (icon)
    AddIcon(labelContainer, icon, type)

  if (text || children) {
    AddTextChildren(labelContainer, { text, children });
  }

  if (onClose) {
    let closeButton = document.createElement("button");
    closeButton.className = `${SG_}close-button`;

    if (typeof onClose == "function")
      closeButton.addEventListener("click", onClose);

    let closeButtonIcon = Icon({
      size: 16,
      type: "close",
      color: !type ? "dark" : "light",
    });

    closeButton.append(closeButtonIcon);
    labelContainer.append(closeButton);
  }

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      labelContainer[propName] = propVal;

  return labelContainer;
}

/**
 * @param {LabelElement} labelContainer
 * @param {LabelIconType} icon
 * @param {LabelType} type
 */
function AddIcon(labelContainer, icon, type) {
  /**
   * @type {import('./Icon').IconElement}
   */
  let iconElement;
  let iconContainer = labelContainer.querySelector(`.${SG_}icon`);

  if (!iconContainer) {
    iconContainer = document.createElement("div");
    iconContainer.className = `${SG_}icon`;
  } else
    iconContainer.innerHTML = "";

  if (icon instanceof HTMLElement)
    // @ts-ignore
    iconElement = icon;
  else {
    /**
     * @type {IconProperties}
     */
    let iconProps = {
      size: 16,
      color: !type ? "dark" : "light",
    };

    if (typeof icon == "string")
      iconProps.type = icon;
    else
      iconProps = mergeDeep(iconProps, icon);

    iconElement = Icon(iconProps);
  }

  iconContainer.appendChild(iconElement);
  labelContainer.appendChild(iconContainer);
}

/**
 * @param {LabelElement} labelContainer
 * @param {{
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  text?: string,
 * }} param0
 */
function AddTextChildren(labelContainer, { text, children }) {
  let textContainer = labelContainer.querySelector(`${SG_}text`);

  if (!textContainer) {
    textContainer = document.createElement("span");
    textContainer.className = `${SG_}text`;
  } else
    textContainer.innerHTML = "";

  if (text) {
    let textElement = Text({
      text,
      size: "small",
      weight: "bold",
      color: labelContainer.type && "white",
    });

    textContainer.append(textElement);
  }

  AddChildren(textContainer, children);

  labelContainer.append(textContainer);
}

/**
 * @this {LabelElement}
 * @param {LabelIconType} icon
 */
function _ChangeIcon(icon) {
  AddIcon(this, icon, this.type);

  return this;
}

/**
 * @this {LabelElement}
 * @param {LabelColorType} color
 */
function _ChangeColor(color) {
  /**
   * @type {string}
   */
  const filteredOldColor = !this.type ? COLORS_DEFAULT_MAP[this.color] :
    COLORS_STRONG_MAP[this.color];
  /**
   * @type {string}
   */
  const filteredColor = !this.type ? COLORS_DEFAULT_MAP[color] :
    COLORS_STRONG_MAP[color];

  this.classList.remove(SGD + filteredOldColor);
  this.classList.add(SGD + filteredColor);

  this.color = color;

  return this;
}

/**
 * @this {LabelElement}
 * @param {string} text
 */
function _ChangeText(text) {
  AddTextChildren(this, { text });

  return this;
}
