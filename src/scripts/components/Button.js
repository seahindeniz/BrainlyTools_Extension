import Icon from "./style-guide/Icon";

/**
 * @typedef {"primary"|"primary-inverted"|"primary-blue"|"primary-mint"} PrimaryType
 * @typedef {"link-button"|"link-button-inverted"|"link-button-peach"|"link-button-mustard"|"link-button-mint"|"link-button-blue"} LinkType
 * @typedef {""|PrimaryType|"secondary"|LinkType|"destructive"|"warning"|"facebook"} Types
 * @typedef {Types|Types[]} Type
 *
 * @typedef {""|"large"|"medium"|"small"|"xsmall"} Size
 * @typedef {boolean | {small: boolean, xsmall: boolean, xxsmall: boolean, large: boolean, xlarge: boolean, xxlarge: boolean}} sizeList
 * @typedef {boolean | {top: sizeList, left: sizeList, bottom: sizeList, right: sizeList}} cornerSpaces
 *
 * @typedef {function(): JQueryButtonElement} Hide
 * @typedef {function(): JQueryButtonElement} Show
 * @typedef {function(): JQueryButtonElement} Enable
 * @typedef {function(): JQueryButtonElement} Disable
 * @typedef {function(): JQueryButtonElement} Active
 * @typedef {function(): JQueryButtonElement} Inactive
 * @typedef {function(): JQueryButtonElement} IsDisabled
 * @typedef {function(Type): JQueryButtonElement} ChangeType
 * @typedef {function(Type): JQueryButtonElement} ToggleType
 *
 * @typedef {{_type: Type, mainType:Type, Hide: Hide, Show: Show, Enable: Enable, Disable: Disable, Active: Active, Inactive: Inactive, ChangeType: ChangeType, ToggleType: ToggleType, IsDisabled: IsDisabled}} CustomProperties
 * @typedef {(HTMLAnchorElement|HTMLButtonElement)&CustomProperties} ButtonElement
 * @typedef {JQuery<ButtonElement>&CustomProperties} JQueryButtonElement
 * @typedef {{tag?: string, type?: Type, size?: Size, icon?: import("./style-guide/Icon").Properties, disabled?: boolean, fullWidth?: boolean, href?: string, title?: string, moreClass?: string, forInput?: string, bold?: boolean, text?: string, spaced?: cornerSpaces}} ButtonOptions
 */
const sg = "sg-button";
const SGD = `${sg}--`;

/**
 * @param {ButtonOptions} param0
 * @returns {JQueryButtonElement}
 */
export default function ({ tag = "button", type, size, icon, disabled, fullWidth, href, title, moreClass, forInput, bold, text, spaced } = {}) {
  if (!icon && typeof text == "undefined")
    throw "Button cannot be empty";

  if (typeof href !== "undefined")
    tag = "a";

  /**
   * @type {ButtonElement}
   */
  // @ts-ignore
  let element = document.createElement(tag);

  element.classList.add(sg);

  if (type) {
    if (typeof type == "string")
      element.classList.add(SGD + type);
    else if (type instanceof Array)
      element.classList.add(SGD + type.join(` ${SGD}`));
  }

  if (size)
    element.classList.add(SGD + size);

  if (icon) {
    let iconElement = Icon({
      size: size == "xsmall" ? 18 : 24,
      color: "adaptive",
      ...icon
    });
    let spanElement = document.createElement("span");

    spanElement.appendChild(iconElement);
    spanElement.classList.add(`${sg}__icon`);

    element.appendChild(spanElement);
  }

  if (disabled) {
    element.setAttribute("disabled", "");
    element.classList.add(`${SGD}disabled`);
  }

  if (fullWidth)
    element.classList.add(`${SGD}full-width`);

  if (href)
    element.setAttribute("href", href);

  if (title)
    element.setAttribute("title", title);

  if (moreClass)
    element.classList.add(...moreClass.replace(/\&/g, SGD).split(" "));

  if (typeof text !== "undefined") {
    let textElement = document.createElement("span");
    textElement.innerHTML = text;

    textElement.classList.add(`${sg}__text`);
    element.appendChild(textElement);

    if (bold)
      textElement.classList.add(`sg-text--bold`);
  }

  if (spaced) {
    let styles = [];

    if (typeof spaced == "boolean")
      styles.push(`${SGD}spaced`);

    if (typeof spaced == "object")
      for (let [corner, sizeName] of Object.entries(spaced)) {
        if (typeof sizeName == "boolean")
          styles.push(`${SGD}spaced-${corner}`);

        if (typeof sizeName == "object") {
          let sizes = Object.keys(sizeName);

          sizes.forEach(size => {
            styles.push(`${SGD}spaced-${corner}-${size}`);
          });
        }
      }

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

  /**
   * @type {JQueryButtonElement}
   */
  let $element = Identify$(element);

  return $element
}

/**
 * @param {ButtonElement} that
 * @returns {JQueryButtonElement}
 */
function Identify$(that) {
  let button = that;

  if (!(this instanceof $)) {
    button = $(button);
    Object.assign(button, {
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
      IsDisabled: that.IsDisabled
    });
  }

  return button
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Disable() {
  let button = Identify$(this);

  button.prop("disabled", true);

  return button.addClass(`${SGD}disabled`);
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Enable() {
  let button = Identify$(this);

  button.prop("disabled", false);

  return button.removeClass(`${SGD}disabled`);
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Active() {
  let button = Identify$(this);

  return button.addClass(`${SGD}active`);
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Inactive() {
  let button = Identify$(this);

  return button.removeClass(`${SGD}active`);
}

/**
 * @this {JQueryButtonElement}
 * @param {Type} type
 * @returns {JQueryButtonElement}
 */
function ChangeType(type) {
  let button = Identify$(this);

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
  let button = Identify$(this);

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
  let button = Identify$(this);

  return button.addClass("js-hidden");
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Show() {
  let button = Identify$(this);

  return button.removeClass("js-hidden");
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function IsDisabled() {
  let button = Identify$(this);

  return button.prop("disabled");
}
