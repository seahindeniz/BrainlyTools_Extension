import SetProps from "@style-guide/helpers/SetProps";
import classnames from "classnames";
import MenuListItem from "./Item";

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

/**
 * @param {Properties} param0
 */
export default function ({ items, size = "normal", className, ...props } = {}) {
  const listClass = classnames(
    SG,
    {
      [SGD + size]: size !== "normal",
    },
    className,
  );

  const list = document.createElement("ul");
  list.className = listClass;

  SetProps(list, props);

  if (items) items.forEach(item => list.append(MenuListItem(item)));

  return list;
}
