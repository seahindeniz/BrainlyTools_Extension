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
 * @typedef {""|"answer"|"answered"|"arrow_down"|"arrow_double_down"|"arrow_left"|"arrow_right"|"arrow_up"|"attachment"|"bold"|"camera"|"change_status"|"check"|"comment"|"counter"|"cup"|"equation"|"exclamation_mark"|"excellent"|"expert"|"friends"|"heart"|"keyboard"|"lightning"|"logout"|"menu"|"messages"|"notifications"|"pencil"|"planet"|"plus"|"podium"|"points"|"profile"|"profile_edit"|"profile_view"|"question"|"reload"|"report_flag"|"search"|"seen"|"star"|"stream"|"student"|"symbols"|"thumbs_up"|"unseen"|"verified"|"x"|"fb"} Icon
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
 * @typedef {{type: Type, size: Size, icon: Icon, disabled: boolean, fullWidth: boolean, href: string, title: string, moreClass: string, forInput: string, bold: boolean, text: string, tag: string, spaced: cornerSpaces}} ButtonOptions
 */
const sg = "sg-button";
const sgd = `${sg}--`;

/**
 * @param {ButtonOptions} options
 * @returns {JQueryButtonElement}
 */
export default function Button({ tag = "button", type: type, size, icon, disabled, fullWidth, href, title, moreClass, forInput, bold, text, spaced } = {}) {
  if (!icon && typeof text == "undefined")
    throw "Button cannot be empty";

  if (typeof href !== "undefined")
    tag = "a";

  if (typeof forInput !== "undefined")
    tag = "label";

  /**
   * @type {ButtonElement}
   */
  let element = document.createElement(tag);

  element.classList.add(sg);

  if (type) {
    if (typeof type == "string")
      element.classList.add(sgd + type);
    else if (type instanceof Array)
      element.classList.add(sgd + type.join(` ${sgd}`));
  }

  if (size)
    element.classList.add(sgd + size);

  if (icon) {
    let iconElement = CreateIcon(icon, size);

    element.appendChild(iconElement);
  }

  if (disabled) {
    element.setAttribute("disabled", "");
    element.classList.add(`${sgd}disabled`);
  }

  if (fullWidth)
    element.classList.add(`${sgd}full-width`);

  if (href)
    element.setAttribute("href", href);

  if (title)
    element.setAttribute("title", title);

  if (moreClass)
    element.classList.add(...moreClass.replace(/\&/g, sgd).split(" "));

  if (forInput)
    element.setAttribute("for", forInput);

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
      styles.push(`${sgd}spaced`);

    if (typeof spaced == "object")
      for (let [corner, sizeName] of Object.entries(spaced)) {
        if (typeof sizeName == "boolean")
          styles.push(`${sgd}spaced-${corner}`);

        if (typeof sizeName == "object") {
          let sizes = Object.keys(sizeName);

          sizes.forEach(size => {
            styles.push(`${sgd}spaced-${corner}-${size}`);
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
  element.Inactive = Inctive;
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
 * @param {Icon} icon
 * @param {Size} size
 */
function CreateIcon(icon, size) {
  let iconSize = 24;
  let spanElement = document.createElement("span");
  let divElement = document.createElement("div");
  let svgElement = document.createElementNS('http://www.w3.org/2000/svg', "svg");
  let useElement = document.createElementNS('http://www.w3.org/2000/svg', "use");

  svgElement.appendChild(useElement);
  divElement.appendChild(svgElement);
  spanElement.appendChild(divElement);

  divElement.classList.add(`sg--icon`);
  svgElement.classList.add("sg-icon__svg");
  spanElement.classList.add(`${sg}__icon`, `${sg}__icon--${size}`);
  useElement.setAttributeNS('http://www.w3.org/1999/xlink', "xlink:href", `#icon-${icon}`);

  if (size == "xsmall")
    iconSize = 18;

  divElement.classList.add("sg-icon--adaptive", `sg-icon--x${iconSize}`);

  return spanElement;
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

  return button.addClass(`${sgd}disabled`);
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Enable() {
  let button = Identify$(this);

  button.prop("disabled", false);

  return button.removeClass(`${sgd}disabled`);
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Active() {
  let button = Identify$(this);

  return button.addClass(`${sgd}active`);
}

/**
 * @this {JQueryButtonElement}
 * @returns {JQueryButtonElement}
 */
function Inctive() {
  let button = Identify$(this);

  return button.removeClass(`${sgd}active`);
}

/**
 * @this {JQueryButtonElement}
 * @param {Type} type
 * @returns {JQueryButtonElement}
 */
function ChangeType(type) {
  let button = Identify$(this);

  console.log("old:", sgd + button._type, sgd + button.mainType);
  console.log("new:", type);
  button.removeClass(sgd + button._type);
  button.removeClass(sgd + button.mainType);
  button.addClass(sgd + type);
  console.log(button[0]);

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

  button.toggleClass(sgd + button.mainType).toggleClass(sgd + type);
  button._type = button.hasClass(sgd + type) ? type : button.mainType;
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
