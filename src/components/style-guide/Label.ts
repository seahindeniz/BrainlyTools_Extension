import CreateElement from "@components/CreateElement";
import InsertAfter from "@root/helpers/InsertAfter";
import classnames from "classnames";
import AddChildren, { ChildrenParamType } from "./helpers/AddChildren";
import Icon, { IconColorType } from "./Icon";
import Text, { TextColorType, TextElement } from "./Text";

type LabelType = "" | "default" | "solid" | "transparent" | "transparent-color";

type LabelColorType =
  | "blue"
  | "mint"
  | "lavender"
  | "peach"
  | "mustard"
  | "gray"
  | "mono";

type LabelIconType = Icon | HTMLElement;

export type LabelPropsType = {
  type?: LabelType;
  color?: LabelColorType;
  icon?: LabelIconType;
  onClose?: (event: MouseEvent) => HTMLButtonElement;
  children?: ChildrenParamType;
  className?: string;
  text?: string;
  tag?: "div" | "label";
  [x: string]: any;
};

const SG = "sg-label";
const SGD = `${SG}--`;
const SGL = `${SG}__`;

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

export default class Label {
  type: LabelType;
  color: LabelColorType;

  element: HTMLDivElement | HTMLLabelElement;
  icon: LabelIconType;
  iconContainer: HTMLDivElement;
  childrenContainer: HTMLSpanElement;
  textElement: TextElement<"div">;
  closeButton: HTMLButtonElement;
  #closeIconColor: IconColorType;
  #textColor: TextColorType;
  #iconColor: IconColorType;

  constructor({
    children,
    type = "default",
    icon,
    onClose,
    color = "mono",
    className,
    tag = "div",
    ...props
  }: LabelPropsType) {
    this.type = type;

    // const filteredColor: string =
    //   type === "default" ? COLORS_DEFAULT_MAP[color] : COLORS_SOLID_MAP[color];

    const labelClass = classnames(
      SG,
      {
        // [SGD + filteredColor]:
        //   (color && type === "solid") || type === "default",
        [SGD + type]: type && type !== "default",
        [`${SGD}closable`]: !!onClose,
      },
      className,
    );

    this.element = CreateElement({
      tag,
      className: labelClass,
      ...props,
    });

    this.ChangeColor(color);

    if (icon) {
      this.ChangeIconColor();
      this.ChangeIcon(icon);
    }

    if (children) {
      this.ChangeTextColor();
      this.ChangeChildren(children);
    }

    if (onClose) {
      this.ChangeCloseIconColor();

      this.closeButton = CreateElement({
        tag: "button",
        className: `${SGL}close-button`,
        onClick: onClose,
        children: new Icon({
          size: 16,
          type: "close",
          color: this.#closeIconColor,
        }),
      });

      this.element.append(this.closeButton);
    }
  }

  ChangeIcon(icon: LabelIconType) {
    if (icon) {
      if (!this.iconContainer) {
        this.iconContainer = CreateElement({
          tag: "div",
          className: `${SGL}icon`,
        });

        this.element.prepend(this.iconContainer);
      } else
        while (this.iconContainer.firstChild)
          this.iconContainer.removeChild(this.iconContainer.lastChild);

      if (icon instanceof HTMLElement)
        // @ts-expect-error
        // eslint-disable-next-line no-param-reassign
        icon = { element: icon };

      if (!(icon instanceof HTMLElement))
        this.iconContainer.appendChild(icon.element);
    } else {
      this.iconContainer?.remove();

      this.iconContainer = null;
    }

    this.icon = icon;
  }

  ChangeChildren(children: ChildrenParamType) {
    if (children) {
      if (!this.textElement) {
        this.ChangeTextColor();

        this.textElement = Text({
          tag: "div",
          noWrap: true,
          size: "small",
          weight: "bold",
          color: this.#textColor,
          children,
        });
      } else {
        while (this.textElement.firstChild)
          this.textElement.removeChild(this.textElement.lastChild);

        AddChildren(this.textElement, children);
      }

      if (!this.childrenContainer) {
        this.childrenContainer = CreateElement({
          tag: "span",
          class: `${SGL}text`,
          children: this.textElement,
        });

        if (this.iconContainer)
          InsertAfter(this.childrenContainer, this.iconContainer);
        else {
          this.element.prepend(this.childrenContainer);
        }
      }
    }
  }

  private ChangeCloseIconColor() {
    this.#closeIconColor =
      this.type === "default" || this.type === "transparent"
        ? "dark"
        : this.type === "solid"
        ? "light"
        : TRANSPARENT_ICON_COLOR_MAP[this.color];
  }

  ChangeTextColor() {
    this.#textColor =
      this.type === "default" || this.type === "transparent"
        ? "default"
        : this.type === "solid"
        ? "white"
        : TRANSPARENT_COLOR_TEXT_MAP[this.color];
  }

  ChangeIconColor() {
    this.#iconColor =
      this.type === "default"
        ? "dark"
        : this.type === "solid"
        ? "light"
        : TRANSPARENT_ICON_COLOR_MAP[this.color];

    if ("ChangeColor" in this.icon) {
      this.icon.ChangeColor(this.#iconColor);
    }
  }

  ChangeColor(color: LabelColorType) {
    const filteredOldColor: string =
      !this.type || this.type === "default"
        ? COLORS_DEFAULT_MAP[this.color]
        : COLORS_SOLID_MAP[this.color];

    const filteredColor: string =
      !this.type || this.type === "default"
        ? COLORS_DEFAULT_MAP[color]
        : COLORS_SOLID_MAP[color];

    this.element.classList.remove(SGD + filteredOldColor);
    this.element.classList.add(SGD + filteredColor);

    this.color = color;
  }
}
