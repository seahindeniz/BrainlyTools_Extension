/* eslint-disable no-underscore-dangle */
import Icon from "./style-guide/Icon";
import type { IconPropsType } from "./style-guide/Icon";

const sg = "sg-button";
const SGD = `${sg}--`;

/**
 * @param {ButtonElement} that
 * @returns {JQueryButtonElement}
 */
function Identify$(
  that: ButtonElementType | JQueryButtonElementType,
): JQueryButtonElementType {
  if (!(that instanceof HTMLElement)) return that;

  const $button = $(that);

  Object.assign($button, {
    _type: that._type,
    mainType: that._type,
    Hide: that.Hide,
    Show: that.Show,
    Enable: that.Enable,
    Disable: that.Disable,
    Active: that.Active,
    Inactive: that.Inactive,
    ChangeType: that.ChangeType,
    ToggleType: that.ToggleType,
    IsDisabled: that.IsDisabled,
  });

  // @ts-expect-error
  return $button;
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Disable() {
  const button = Identify$(this);

  button.prop("disabled", true);

  return button.addClass(`${SGD}disabled`);
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Enable() {
  const button = Identify$(this);

  button.prop("disabled", false);

  return button.removeClass(`${SGD}disabled`);
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Active() {
  const button = Identify$(this);

  return button.addClass(`${SGD}active`);
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Inactive() {
  const button = Identify$(this);

  return button.removeClass(`${SGD}active`);
}

/**
 * @param {Type} type
 * @returns {JQueryButtonElement}
 */
function ChangeType(type: ButtonTypeType) {
  const button = Identify$(this);

  button.removeClass(SGD + button._type);
  button.removeClass(SGD + button.mainType);
  button.addClass(SGD + type);

  button._type = type;
  button.mainType = type;
  button.prop("_type", type);
  button.prop("mainType", type);

  return button;
}

/**
 * @this {JQueryButtonElement}
 * @param {Type} type
 * @returns {JQueryButtonElement}
 */
function ToggleType(type) {
  const button = Identify$(this);

  button.toggleClass(SGD + button.mainType).toggleClass(SGD + type);
  button._type = button.hasClass(SGD + type) ? type : button.mainType;
  button.prop("_type", button._type);

  return button;
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Hide() {
  const button = Identify$(this);

  return button.addClass("js-hidden");
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Show() {
  const button = Identify$(this);

  return button.removeClass("js-hidden");
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function IsDisabled() {
  const button = Identify$(this);

  return button.prop("disabled");
}

type ButtonSizeType = "large" | "medium" | "small" | "xsmall";

type ButtonCornerSizeType =
  | boolean
  | {
      small: boolean;
      xsmall: boolean;
      xxsmall: boolean;
      large: boolean;
      xlarge: boolean;
      xxlarge: boolean;
    };

type ButtonCornerSpacesType =
  | boolean
  | {
      top: ButtonCornerSizeType;
      left: ButtonCornerSizeType;
      bottom: ButtonCornerSizeType;
      right: ButtonCornerSizeType;
    };

type ButtonTypeType =
  | "solid"
  | "solid-inverted"
  | "solid-blue"
  | "solid-mint"
  | "solid-peach"
  | "solid-mustard"
  | "transparent"
  | "transparent-inverted"
  | "transparent-peach"
  | "transparent-mustard"
  | "transparent-mint"
  | "transparent-blue"
  | "outline"
  | "destructive"
  | "warning"
  | "facebook";

type ButtonPropsType = {
  tag?: string;
  type?: ButtonTypeType | ButtonTypeType[];
  size?: ButtonSizeType;
  icon?: IconPropsType;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  title?: string;
  moreClass?: string;
  forInput?: string;
  bold?: boolean;
  text?: string;
  spaced?: ButtonCornerSpacesType;
};

type ButtonElementCustomPropsType = {
  _type: ButtonTypeType | ButtonTypeType[];
  mainType: ButtonTypeType | ButtonTypeType[];
  Hide: typeof Hide;
  Show: typeof Show;
  Enable: typeof Enable;
  Disable: typeof Disable;
  Active: typeof Active;
  Inactive: typeof Inactive;
  ChangeType: typeof ChangeType;
  ToggleType: typeof ToggleType;
  IsDisabled: typeof IsDisabled;
};

type ButtonElementType = HTMLButtonElement & ButtonElementCustomPropsType;

export type JQueryButtonElementType = JQuery<ButtonElementType> &
  ButtonElementCustomPropsType;

/**
 * @param {ButtonOptions} param0
 * @returns {JQueryButtonElement}
 */
export default function JqueryButton({
  tag = "button",
  type,
  size,
  icon,
  disabled,
  fullWidth,
  href,
  title,
  moreClass,
  bold,
  text,
  spaced,
}: ButtonPropsType = {}): JQueryButtonElementType {
  if (!icon && typeof text === "undefined")
    throw Error("Button cannot be empty");

  /**
   * @type {ButtonElement}
   */
  // @ts-ignore
  const element: ButtonElementType = document.createElement(
    typeof href !== "undefined" ? "a" : tag,
  );

  element.classList.add(sg);

  if (type) {
    if (typeof type === "string") element.classList.add(SGD + type);
    else if (type instanceof Array)
      element.classList.add(SGD + type.join(` ${SGD}`));
  }

  if (size) element.classList.add(SGD + size);

  if (icon) {
    const iconObj = new Icon({
      size: size === "xsmall" ? 22 : 24,
      color: "adaptive",
      ...icon,
    });
    const spanElement = document.createElement("span");

    spanElement.appendChild(iconObj.element);
    spanElement.classList.add(`${sg}__icon`);

    element.appendChild(spanElement);
  }

  if (disabled) {
    element.setAttribute("disabled", "");
    element.classList.add(`${SGD}disabled`);
  }

  if (fullWidth) element.classList.add(`${SGD}full-width`);

  if (href) element.setAttribute("href", href);

  if (title) element.setAttribute("title", title);

  if (moreClass)
    element.classList.add(...moreClass.replace(/&/g, SGD).split(" "));

  if (typeof text !== "undefined") {
    const textElement = document.createElement("span");
    textElement.innerHTML = text;

    textElement.classList.add(`${sg}__text`);
    element.appendChild(textElement);

    if (bold) textElement.classList.add(`sg-text--bold`);
  }

  if (spaced) {
    const styles = [];

    if (typeof spaced === "boolean") styles.push(`${SGD}spaced`);

    if (typeof spaced === "object")
      Object.entries(spaced).forEach(([corner, sizeName]) => {
        if (typeof sizeName === "boolean")
          styles.push(`${SGD}spaced-${corner}`);

        if (typeof sizeName === "object") {
          const sizes = Object.keys(sizeName);

          sizes.forEach(_size => {
            styles.push(`${SGD}spaced-${corner}-${_size}`);
          });
        }
      });

    element.classList.add(...styles);
  }

  element._type = type;
  element.mainType = type;
  element.Hide = Hide;
  element.Show = Show;
  element.Enable = Enable;
  element.Disable = Disable;
  element.Active = Active;
  element.Inactive = Inactive;
  element.ChangeType = ChangeType;
  element.ToggleType = ToggleType;
  element.IsDisabled = IsDisabled;

  return Identify$(element);
}
