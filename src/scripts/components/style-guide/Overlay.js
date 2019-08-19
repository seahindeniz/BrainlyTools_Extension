import classnames from 'classnames';

/**
 * @typedef {{partial?: boolean, children?: HTMLElement, className?: string}} Properties
 */
const SG = "sg-overlay";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default function({ partial, children, className, ...props } = {}) {
  const overlayClass = classnames(SG, {
      [`${SGD}partial`]: partial
    },
    className);

  let container = document.createElement("div");
  container.className = overlayClass;

  if (children)
    container.appendChild(children)

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      container.setAttribute(propName, propVal);

  return container;
}
