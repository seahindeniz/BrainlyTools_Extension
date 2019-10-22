import classnames from 'classnames';
import Icon, * as IconModule from "../Icon";

/**
 * @typedef {"small" | "normal" | "large"} Size
 * @typedef {"a" | "span" | "label"} Type
 * @typedef {{
 *  className?: string,
 *  children?: HTMLElement | HTMLElement[],
 *  text?: string,
 *  html?: string,
 *  icon?: boolean | HTMLElement | IconModule.Properties,
 *  iconSmall?: boolean,
 * } & Object<string, *>} Properties
 */

const SG = "sg-list";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({
  children,
  className,
  text,
  html,
  icon,
  iconSmall,
  ...props
} = {}) {
  const listItemClass = classnames(`${SG_}element`, className);

  let item = document.createElement("li");
  item.className = listItemClass;

  if (text)
    item.innerText = text;

  if (html)
    item.innerHTML = html;

  if (icon) {
    let iconContainer = document.createElement("div");
    iconContainer.className = classnames(`${SG_}icon`, {
      [`${SG_}icon--spacing-right-small`]: iconSmall,
    });

    let iconElement;

    if (icon instanceof HTMLElement)
      iconElement = icon;
    else if (
      icon === true ||
      icon instanceof Object
    ) {
      iconElement = Icon(
        icon !== true ? {
          type: "arrow_right",
          size: iconSmall ? 14 : 18,
          ...icon
        } : {
          color: "adaptive",
          type: "arrow_right",
          size: iconSmall ? 14 : 18,
        }
      );
    }

    if (iconElement)
      iconContainer.append(iconElement);

    item.append(iconContainer);
  }

  if (children instanceof Array)
    item.append(...children);
  else if (children)
    item.append(children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
        item[propName] = propVal;

  return item;
}
