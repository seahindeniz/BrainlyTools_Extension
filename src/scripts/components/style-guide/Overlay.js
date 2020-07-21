import classnames from "classnames";
import AddChildren from "./helpers/AddChildren";
import SetProps from "./helpers/SetProps";

/**
 * @typedef {{
 *  partial?: boolean,
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  className?: string,
 * }} Properties
 */
const SG = "sg-overlay";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default function ({ partial, children, className, ...props } = {}) {
  const overlayClass = classnames(
    SG,
    {
      [`${SGD}partial`]: partial,
    },
    className,
  );

  const container = document.createElement("div");
  container.className = overlayClass;

  AddChildren(container, children);
  SetProps(container, props);

  return container;
}
