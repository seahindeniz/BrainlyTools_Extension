import classnames from 'classnames';

/**
 * @typedef {"small" | "normal" | "large"} Size
 * @typedef {"a" | "span" | "label"} Type
 * @typedef {{
 * text?: string,
 * html?: string,
 * children?: HTMLElement | HTMLElement[],
 * href?: string,
 * type?: Type,
 * className?: string,
 * } & Object<string, *>} Properties
 */

const SG = "sg-menu-list";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({
  text,
  html,
  children,
  href,
  type = "a",
  className,
  ...props
} = {}) {
  const linkClass = classnames(`${SG_}link sg-text--link`, className);

  let element = document.createElement("li");
  element.className = `${SG_}element`;

  let link = document.createElement(type);
  link.className = linkClass;

  element.append(link);

  if (href)
    link.setAttribute("href", href);

  if (text)
    link.innerText = text;

  if (html)
    link.innerHTML = html;

  if (children instanceof Array)
    link.append(...children);
  else if (children)
    link.append(children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
        link[propName] = propVal;

  return element;
}
