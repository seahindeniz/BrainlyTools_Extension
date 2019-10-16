import classnames from 'classnames';
import Icon from './Icon';

/**
 * @typedef {import("./Icon").Properties} IconProperties
 *
 * @typedef {"small" | "normal" | "large"} Size
 * @typedef {{
 *  size?: Size,
 *  text?: string,
 *  html?: string | HTMLElement,
 *  children?: HTMLElement | HTMLElement[],
 *  number?: number,
 *  icon?: IconProperties | HTMLElement,
 *  htmlFor?: string,
 *  secondary?: boolean,
 *  unstyled?: boolean,
 *  emphasised?: boolean,
 *  elementsToTop?: boolean,
 *  className?: string,
 * }} Properties
 *
 * @typedef {function(HTMLElement | IconProperties): Element} ChangeIcon
 *
 * @typedef {{size: Size, ChangeIcon: ChangeIcon}} CustomProperties
 *
 * @typedef {HTMLDivElement & CustomProperties} Element
 */

const SG = "sg-label";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({
  size = "normal",
  text,
  html,
  children,
  number,
  icon,
  htmlFor,
  secondary,
  unstyled,
  emphasised,
  elementsToTop,
  className,
  ...props
} = {}) {
  const labelClass = classnames(SG, {
    [SGD + size]: size !== "normal",
    [`${SGD}secondary`]: secondary,
    [`${SGD}unstyled`]: unstyled,
    [`${SGD}emphasised`]: emphasised,
    [`${SGD}elements-to-the-top`]: elementsToTop
  }, className);

  /**
   * @type {Element}
   */
  // @ts-ignore
  let container = document.createElement("div");
  container.className = labelClass;

  if (icon) {
    /**
     * @type {HTMLElement}
     */
    let iconElement;
    let iconContainer = document.createElement("div");
    iconContainer.className = `${SG_}icon`;

    if (icon instanceof HTMLElement)
      iconElement = icon;
    else {
      iconElement = Icon({
        ...icon,
        size: size == "small" ? 18 : size == "large" ? 24 : 16
      });
    }

    // @ts-ignore
    if (htmlFor && icon.ChangeId)
      // @ts-ignore
      icon.ChangeId(htmlFor);

    iconContainer.appendChild(iconElement);
    container.appendChild(iconContainer);
  }

  if (text || html) {
    let label = document.createElement("label");
    label.className = `${SG_}text`;

    if (text)
      label.innerText = text;
    else if (html instanceof HTMLElement)
      label.append(html);
    else
      label.innerHTML = html;

    if (htmlFor)
      label.htmlFor = htmlFor;

    container.appendChild(label);
  }

  if (number) {
    let numberContainer = document.createElement("div");
    numberContainer.className = `${SG_}number`;
    numberContainer.innerHTML = String(number);

    container.appendChild(numberContainer);
  }

  if (children && children instanceof HTMLElement)
    container.appendChild(children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      if (propVal)
        container[propName] = propVal;

  container.size = size;
  // @ts-ignore
  container.ChangeIcon = _ChangeIcon;

  return container;
}

/**
 * @this {Element}
 * @param {HTMLElement | IconProperties} icon
 */
function _ChangeIcon(icon) {
  /**
   * @type {HTMLElement}
   */
  let iconElement;
  let iconContainer = this.querySelector(`.${SG_}icon`);
  let oldIcon = iconContainer.firstElementChild;

  if (oldIcon)
    iconContainer.removeChild(oldIcon);

  if (icon instanceof HTMLElement)
    iconElement = icon;
  else {
    iconElement = Icon({
      ...icon,
      size: this.size == "small" ? 18 : this.size == "large" ? 24 : 16
    });
  }

  iconContainer.appendChild(iconElement);
}
