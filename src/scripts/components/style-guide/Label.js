// @flow
/* eslint-disable no-underscore-dangle */
import classnames from "classnames";
import mergeDeep from "merge-deep";
import Icon from "./Icon";
import type { IconPropsType } from "./Icon";
import Text, { type TextColorType } from "./Text";
import SetProps from "./helpers/SetProps";
import CreateElement from "../CreateElement";
import type { ChildrenParamType } from "./helpers/AddChildren";

/**
 * @typedef {import("./Icon").IconPropsType} IconPropsType
 * @typedef {import("./Icon").IconTypeType} IconType
 *
 * @typedef {""
 * | 'default'
 * | 'solid'
 * | 'transparent'
 * | 'transparent-color'
 * } LabelType
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
 *  icon?: Icon | IconPropsType,
 *  onClose?: function(MouseEvent): HTMLButtonElement,
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  className?: string,
 *  text?: string,
 *  [x: string]: *,
 * }} Properties
 *
 * @typedef {(text: string) => LabelElement} ChangeText
 * @typedef {(icon: Icon | IconPropsType) => LabelElement} ChangeIcon
 * @typedef {(color: LabelColorType) => LabelElement} ChangeColor
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

export const COLORS_SOLID_MAP = {
  blue: "blue-primary",
  mint: "mint-primary",
  lavender: "lavender-primary",
  peach: "peach-primary",
  mustard: "mustard-primary",
  gray: "gray-primary",
  mono: "black",
};

export const COLORS_DEFAULT_MAP = {
  blue: "blue-secondary-light",
  mint: "mint-secondary-light",
  lavender: "lavender-secondary-light",
  peach: "peach-secondary-light",
  mustard: "mustard-secondary-light",
  gray: "gray-secondary-light",
  mono: "white",
};

const TRANSPARENT_COLOR_TEXT_MAP = {
  blue: "blue-dark",
  mint: "mint-dark",
  lavender: "lavender-dark",
  peach: "peach-dark",
  mustard: "mustard-dark",
  gray: "gray-secondary",
  mono: "default",
};

const TRANSPARENT_ICON_COLOR_MAP = {
  blue: "blue",
  mint: "mint",
  lavender: "lavender",
  peach: "peach",
  mustard: "mustard",
  gray: "gray-secondary",
  mono: "dark",
};

/**
 * @param {LabelElement} labelContainer
 * @param {Icon | IconPropsType} icon
 * @param {import("./Icon").IconColorType} color
 */
function AddIcon(labelContainer, icon, color) {
  /**
   * @type {Icon}
   */
  let iconInstance;
  let iconContainer = labelContainer.querySelector(`.${SG_}icon`);

  if (!iconContainer) {
    iconContainer = document.createElement("div");
    iconContainer.className = `${SG_}icon`;
  } else iconContainer.innerHTML = "";

  if (icon instanceof HTMLElement) iconInstance = { element: icon };
  else {
    let iconProps: IconPropsType = {
      size: 16,
      color,
      type: "arrow_down",
    };

    if (!(icon instanceof Icon)) {
      iconProps = mergeDeep(iconProps, icon);

      const iconObj = new Icon(iconProps);
      iconInstance = iconObj;
    }
  }

  if (iconInstance && iconInstance.element)
    iconContainer.appendChild(iconInstance.element);

  labelContainer.appendChild(iconContainer);
}

/**
 * param {LabelElement} labelContainer
 * param {{
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  text?: string,
 *  textColor: import("./Text").TextColorType,
 * }} param0
 */
function AddTextChildren(
  labelContainer: HTMLElement,
  {
    text,
    children,
    textColor,
  }: {
    text?: string,
    children?: ChildrenParamType,
    textColor?: TextColorType,
  },
) {
  let textContainer = labelContainer.querySelector(`${SG_}text`);

  if (!textContainer) {
    textContainer = document.createElement("span");
    textContainer.className = `${SG_}text`;
  } else textContainer.innerHTML = "";

  const textElement = Text({
    size: "small",
    weight: "bold",
    color: textColor,
    text,
    children,
  });

  textContainer.append(textElement);
  labelContainer.append(textContainer);

  /* if (text) {
    const textElement = Text({
      text,
      size: "small",
      weight: "bold",
      color: labelContainer.type ? "white" : "default",
    });

    textContainer.append(textElement);
  }

  AddChildren(textContainer, children);

  labelContainer.append(textContainer); */
}

/**
 * @this {LabelElement}
 * @param {Icon | IconPropsType} icon
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
  const filteredOldColor = !this.type
    ? COLORS_DEFAULT_MAP[this.color]
    : COLORS_SOLID_MAP[this.color];
  /**
   * @type {string}
   */
  const filteredColor = !this.type
    ? COLORS_DEFAULT_MAP[color]
    : COLORS_SOLID_MAP[color];

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

export default function ({
  children,
  type = "default",
  icon,
  onClose,
  color,
  className,
  text,
  ...props
}: Properties) {
  /**
   * @type {string}
   */
  const filteredColor =
    type === "default" ? COLORS_DEFAULT_MAP[color] : COLORS_SOLID_MAP[color];

  const labelClass = classnames(
    SG,
    {
      [SGD + filteredColor]: (color && type === "solid") || type === "default",
      [SGD + type]: type && type !== "default",
      [`${SGD}closable`]: !!onClose,
    },
    className,
  );

  const textColor =
    type === "default" || type === "transparent"
      ? "default"
      : type === "solid"
      ? "white"
      : TRANSPARENT_COLOR_TEXT_MAP[color];

  const iconColor =
    type === "default"
      ? "dark"
      : type === "solid"
      ? "light"
      : TRANSPARENT_ICON_COLOR_MAP[color];

  const closeIconColor =
    type === "default" || type === "transparent"
      ? "dark"
      : type === "solid"
      ? "light"
      : TRANSPARENT_ICON_COLOR_MAP[color];

  /**
   * @type {LabelElement}
   */
  const labelContainer = Object.assign(document.createElement("div"));
  labelContainer.className = labelClass;
  props.color = color;
  props.type = type;
  props.ChangeText = _ChangeText;
  props.ChangeIcon = _ChangeIcon;
  props.ChangeColor = _ChangeColor;

  if (icon) AddIcon(labelContainer, icon, iconColor);

  if (text || children) {
    AddTextChildren(labelContainer, { text, children, textColor });
  }

  if (onClose) {
    const closeButton = CreateElement({
      tag: "button",
      className: `${SG_}close-button`,
      onClick: onClose,
      children: new Icon({
        size: 16,
        type: "close",
        color: closeIconColor,
      }),
    });
    /* const closeButton = document.createElement("button");
    closeButton.className = `${SG_}close-button`;

    if (typeof onClose === "function")
      closeButton.addEventListener("click", onClose);

    const closeButtonIcon = new Icon({
      size: 16,
      type: "close",
      color: closeIconColor,
    });

    closeButton.append(closeButtonIcon.element); */
    labelContainer.append(closeButton);
  }

  SetProps(labelContainer, props);

  return labelContainer;
}
