import SetProps from "@style-guide/helpers/SetProps";
import classnames from "classnames";
import AddChildren, { ChildrenParamType } from "../helpers/AddChildren";
import Icon, { IconPropsType } from "../Icon";

type ListItemPropsType = {
  className?: string;
  children?: ChildrenParamType;
  text?: string;
  html?: string;
  icon?: boolean | HTMLElement | IconPropsType;
  iconSmall?: boolean;
  [x: string]: any;
};

const SG = "sg-list";
const SGL = `${SG}__`;

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
}: ListItemPropsType = {}) {
  const listItemClass = classnames(`${SGL}element`, className);

  const item = document.createElement("li");
  item.className = listItemClass;

  if (text) item.innerText = text;

  if (html) item.innerHTML = html;

  if (icon) {
    const iconContainer = document.createElement("div");
    iconContainer.className = classnames(`${SGL}icon`, {
      [`${SGL}icon--spacing-right-small`]: iconSmall,
    });

    let iconElement;

    if (icon instanceof HTMLElement) iconElement = icon;
    else if (icon === true || icon instanceof Object) {
      const iconInstance = new Icon(
        // @ts-expect-error
        icon !== true
          ? {
              ...icon,
              type: "arrow_right",
              size: iconSmall ? 14 : 18,
            }
          : {
              color: "adaptive",
              type: "arrow_right",
              size: iconSmall ? 14 : 18,
            },
      );
      iconElement = iconInstance.element;
    }

    if (iconElement) iconContainer.append(iconElement);

    item.prepend(iconContainer);
  }

  AddChildren(item, children);

  SetProps(item, props);

  return item;
}
