import classnames from 'classnames';

/**
 * @typedef {"small" | "normal" | "large"} Size
 * @typedef {{
 * children?: HTMLElement | HTMLElement[],
 * overlay?: HTMLElement,
 * className?: string,
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
      if (propVal)
        box[propName] = propVal;

  if (children instanceof Array)
    box.append(...children);
  else if (children)
    box.append(children);

  let overlayElement = document.createElement("div");
  overlayElement.className = `${SG_}overlay`;

  if (overlay)
    overlayElement.appendChild(overlay);

  box.append(overlayElement);

  return box;
}
