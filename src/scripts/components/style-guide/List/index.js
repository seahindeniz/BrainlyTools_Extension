import classnames from "classnames";
import SetProps from "@style-guide/helpers/SetProps";
import AddChildren from "../helpers/AddChildren";

/**
 * @typedef {{
 *  spaced?: boolean,
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  className?: string,
 * }} Properties
 */

const SG = "sg-list";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default ({ spaced, className, children, ...props } = {}) => {
  const listClass = classnames(
    SG,
    {
      [`${SGD}spaced-elements`]: spaced,
    },
    className,
  );

  const list = document.createElement("ul");
  list.className = listClass;

  AddChildren(list, children);
  SetProps(list, props);

  return list;
};
