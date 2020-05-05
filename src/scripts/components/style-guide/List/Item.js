import SetProps from "@style-guide/helpers/SetProps";
import classnames from "classnames";
import AddChildren from "../helpers/AddChildren";
import Icon from "../Icon";

/**
 * @typedef {"small" | "normal" | "large"} Size
 * @typedef {"a" | "span" | "label"} Type
 * @typedef {{
 *  className?: string,
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  text?: string,
 *  html?: string,
 *  icon?: boolean | HTMLElement | import("../Icon").IconPropsType,
 *  iconSmall?: boolean,
 * } & Object<string, *>} Properties
 */

const SG = "sg-list";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function ({
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

  if (text) item.innerText = text;

  if (html) item.innerHTML = html;

  if (icon) {
    let iconContainer = document.createElement("div");
    iconContainer.className = classnames(`${SG_}icon`, {
      [`${SG_}icon--spacing-right-small`]: iconSmall,
    });

    let iconElement;

    if (icon instanceof HTMLElement) iconElement = icon;
    else if (icon === true || icon instanceof Object) {
      const iconObj = new Icon(
        icon !== true
          ? {
              type: "arrow_right",
              size: iconSmall ? 14 : 18,
              ...icon,
            }
          : {
              color: "adaptive",
              type: "arrow_right",
              size: iconSmall ? 14 : 18,
            },
      );
      iconElement = iconObj.element;
    }

    if (iconElement) iconContainer.append(iconElement);

    item.append(iconContainer);
  }

  AddChildren(item, children);

  SetProps(item, props);

  return item;
}
