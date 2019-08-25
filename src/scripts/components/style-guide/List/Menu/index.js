import classnames from 'classnames';
import { MenuListItem } from '../..';

/**
 * @typedef {"small" | "normal" | "large"} Size
 * @typedef {{
 * items?: import("./Item").Properties[],
 * size?: Size,
 * className?: string,
 * }} Properties
 */

const SG = "sg-menu-list";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({ items, size = "normal", className, ...props } = {}) {
  const listClass = classnames(SG, {
      [SGD + size]: size !== "normal",
    },
    className
  );

  let list = document.createElement("ul");
  list.className = listClass;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      list[propName] = propVal;

  if (items)
    items.forEach(item => list.append(MenuListItem(item)));

  return list;
}
