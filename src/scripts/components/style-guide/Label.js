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
 * @typedef {function(LabelIconType): LabelElement} ChangeIcon
 *
 * @typedef {{
 *  type: LabelType,
 *  ChangeIcon: ChangeIcon
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

  if (icon)
    AddIcon(labelContainer, icon, type)

  if (text || children) {
    let textContainer = document.createElement("span");
    textContainer.className = `${SG_}text`;

    if (children)
      AddChildren(textContainer, children);
    else {
      let textElement = Text({
        text,
        size: "small",
        weight: "bold",
        color: type && "white",
      });

      textContainer.append(textElement);
    }
    labelContainer.append(textContainer);
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

  labelContainer.type = type;
  // @ts-ignore
  labelContainer.ChangeIcon = _ChangeIcon;

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
 * @this {LabelElement}
 * @param {LabelIconType} icon
 */
function _ChangeIcon(icon) {
  AddIcon(this, icon, this.type);

  return this;
}
