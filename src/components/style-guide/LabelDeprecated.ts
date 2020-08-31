/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
import CreateElement from "@components/CreateElement";
import InsertAfter from "@root/helpers/InsertAfter";
import classnames from "classnames";
import type { ChildrenParamType } from "./helpers/AddChildren";
import SetProps from "./helpers/SetProps";
import Icon, { IconColorType, IconPropsType } from "./Icon";
import Text, { TextColorType } from "./Text";

type LabelType = "" | "default" | "solid" | "transparent" | "transparent-color";
type LabelColorType =
  | "blue"
  | "mint"
  | "lavender"
  | "peach"
  | "mustard"
  | "gray"
  | "mono";
export type LabelPropsType = {
  type?: LabelType;
  color?: LabelColorType;
  icon?: Icon | IconPropsType | HTMLElement;
  onClose?: (event: MouseEvent) => HTMLButtonElement;
  children?: ChildrenParamType;
  className?: string;
  text?: string;
  containerTag?: "div" | "label";
  [x: string]: any;
};

type CustomProperties = {
  type: LabelType;
  color: LabelColorType;
  ChangeText: typeof ChangeText;
  ChangeIcon: typeof ChangeIcon;
  ChangeColor: typeof ChangeColor;
};

export type LabelElementType = HTMLDivElement & CustomProperties;

const SG = "sg-label";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

export const COLORS_SOLID_MAP = {
  blue: "blue-primary",
  mint: "mint-primary",
  lavender: "lavender-primary",
  peach: "peach-primary",
  mustard: "mustard-primary",
  gray: "gray-secondary",
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

const TRANSPARENT_COLOR_TEXT_MAP: {
  [colorName in
    | "blue"
    | "mint"
    | "lavender"
    | "peach"
    | "mustard"
    | "gray"
    | "mono"]: TextColorType;
} = {
  blue: "blue-dark",
  mint: "mint-dark",
  lavender: "lavender-dark",
  peach: "peach-dark",
  mustard: "mustard-dark",
  gray: "gray-secondary",
  mono: "default",
};

const TRANSPARENT_ICON_COLOR_MAP: {
  [colorName in
    | "blue"
    | "mint"
    | "lavender"
    | "peach"
    | "mustard"
    | "gray"
    | "mono"]: IconColorType;
} = {
  blue: "blue",
  mint: "mint",
  lavender: "lavender",
  peach: "peach",
  mustard: "mustard",
  gray: "gray-secondary",
  mono: "dark",
};

function AddIcon(
  labelContainer: LabelElementType,
  icon: Icon | IconPropsType | HTMLElement,
  color: IconColorType,
) {
  let iconInstance: Icon;
  let iconContainer = labelContainer.querySelector(`.${SG_}icon`);

  if (!iconContainer) {
    iconContainer = document.createElement("div");
    iconContainer.className = `${SG_}icon`;
  } else iconContainer.innerHTML = "";

  if (icon instanceof HTMLElement) {
    // @ts-expect-error
    iconInstance = { element: icon };
  } else {
    let iconProps: IconPropsType = {
      size: 16,
      color,
      type: "arrow_down",
    };

    if (!(icon instanceof Icon)) {
      // @ts-expect-error
      iconProps = {
        ...iconProps,
        ...icon,
      };

      const iconObj = new Icon(iconProps);
      iconInstance = iconObj;
    }
  }

  if (iconInstance && iconInstance.element)
    iconContainer.appendChild(iconInstance.element);

  labelContainer.appendChild(iconContainer);
}

function AddTextChildren(
  labelContainer: HTMLElement,
  {
    text,
    children,
    textColor,
  }: {
    text?: string;
    children?: ChildrenParamType;
    textColor?: TextColorType;
  },
) {
  let textContainer = labelContainer.querySelector(`.${SG_}text`);

  if (!textContainer) {
    textContainer = document.createElement("span");
    textContainer.className = `${SG_}text`;

    const iconContainer = labelContainer.firstElementChild;

    if (iconContainer && iconContainer.classList.contains(`${SG_}icon`)) {
      InsertAfter(textContainer, iconContainer);
    } else {
      labelContainer.prepend(textContainer);
    }
  } else textContainer.innerHTML = "";

  const textElement = Text({
    noWrap: true,
    size: "small",
    weight: "bold",
    color: textColor,
    text,
    children,
  });

  textContainer.append(textElement);
}

/**
 * @this {LabelElementType}
 * @param {Icon | IconPropsType} icon
 */
function ChangeIcon(icon) {
  AddIcon(this, icon, this.type);

  return this;
}

function ChangeColor(this: LabelElementType, color: LabelColorType) {
  const filteredOldColor: string = !this.type
    ? COLORS_DEFAULT_MAP[this.color]
    : COLORS_SOLID_MAP[this.color];

  const filteredColor: string = !this.type
    ? COLORS_DEFAULT_MAP[color]
    : COLORS_SOLID_MAP[color];

  this.classList.remove(SGD + filteredOldColor);
  this.classList.add(SGD + filteredColor);

  this.color = color;

  return this;
}

function ChangeText(this: LabelElementType, children: string) {
  AddTextChildren(this, { children });

  return this;
}

export default function ({
  children,
  type = "default",
  icon,
  onClose,
  color = "mono",
  className,
  text,
  containerTag = "div",
  ...props
}: LabelPropsType) {
  const filteredColor: string =
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

  const textColor: TextColorType =
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

  const closeIconColor: IconColorType =
    type === "default" || type === "transparent"
      ? "dark"
      : type === "solid"
      ? "light"
      : TRANSPARENT_ICON_COLOR_MAP[color];

  const labelContainer: LabelElementType = Object.assign(
    document.createElement(containerTag),
  );
  labelContainer.className = labelClass;
  props.color = color;
  props.type = type;
  props.ChangeText = ChangeText;
  props.ChangeIcon = ChangeIcon;
  props.ChangeColor = ChangeColor;

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
