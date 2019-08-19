import classnames from 'classnames';
import Icon from './Icon';
import Text from './Text';

/**
 * @typedef {"small" | "normal" | "large"} Size
 * @typedef {{size?: Size, text?: string, html?: string, children?: HTMLElement, number?: number, icon?: import("./Icon").Properties, htmlFor?: string, secondary?: boolean, unstyled?: boolean, emphasised?: boolean, elementsToTop?: boolean, className?: string}} Properties
 */

const SG = "sg-label";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({ size = "normal", text, html, children, number, icon, htmlFor, secondary, unstyled, emphasised, elementsToTop, className, ...props } = {}) {
  const labelClass = classnames(SG, {
    [SGD + size]: size !== "normal",
    [`${SGD}secondary`]: secondary,
    [`${SGD}unstyled`]: unstyled,
    [`${SGD}emphasised`]: emphasised,
    [`${SGD}elements-to-the-top`]: elementsToTop
  }, className);

  let container = document.createElement("div");
  container.className = labelClass;

  if (icon) {
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

    iconContainer.appendChild(iconElement);
    container.appendChild(iconContainer);
  }

  if (text || html) {
    let label = document.createElement("label");
    label.className = `${SG_}text`;

    if (text)
      label.innerText = text;
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
      container.setAttribute(propName, propVal)

  return container;
}
