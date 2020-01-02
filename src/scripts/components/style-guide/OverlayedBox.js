import classnames from 'classnames';
import AddChildren from './helpers/AddChildren';

/**
 * @typedef {"small" | "normal" | "large"} Size
 * @typedef {{
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  overlay?: HTMLElement,
 *  className?: string,
 * }} Properties
 */

const SG = "sg-overlayed-box";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({
  children,
  overlay,
  className,
  ...props
} = {}) {
  const boxClass = classnames(SG, className);

  let box = document.createElement("div");
  box.className = boxClass;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      box[propName] = propVal;

  AddChildren(box, children);

  let overlayElement = document.createElement("div");
  overlayElement.className = `${SG_}overlay`;

  if (overlay)
    overlayElement.appendChild(overlay);

  box.append(overlayElement);

  return box;
}
