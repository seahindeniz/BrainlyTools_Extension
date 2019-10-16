import Spinner from ".";
import classnames from 'classnames';

/**
 * @typedef {"xxsmall" | "xsmall" | "small" | "normal" | "large" | "xlarge" |
 * "xxlarge"} Size
 * @typedef {{
 * loading?: boolean,
 * light?: boolean,
 * size?: import("./index").Size,
 * children?: HTMLElement | HTMLElement[],
 * className?: string,
 * }} Properties
 */
const SG = "sg-spinner-container";
const SG_ = `${SG}__`

/**
 * @param {Properties} param0
 */
export default function({
  loading,
  light,
  size,
  children,
  className,
  ...props
} = {}) {

  let spinnerContainerClass = classnames(SG, className);

  let container = document.createElement("div");
  container.className = spinnerContainerClass;

  if (children instanceof Array && children.length > 0)
    container.append(...children);
  else if (children instanceof HTMLElement)
    container.append(children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
    if (propVal)
      container[propName] = propVal;

  if (loading) {
    let overlay = document.createElement("div");
    overlay.className = `${SG_}overlay`;

    container.appendChild(overlay);

    let spinner = Spinner({
      light,
      size
    });

    overlay.appendChild(spinner);
  }

  return container;
}
