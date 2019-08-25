import classnames from 'classnames';

/**
 * @typedef {"xxsmall" | "xsmall" | "small" | "normal" | "large" | "xlarge" |
 * "xxlarge"} Size
 * @typedef {"left" | "center" | "right"} Alignment
 * @typedef {{
 * children?: HTMLElement,
 * spacedTop?: Size,
 * spacedBottom?: Size,
 * align?: Alignment,
 * className?: string,
 * }} Properties
 * @typedef {HTMLDivElement} Element
 */
const SG = "sg-content-box__actions";
const SGD = `${SG}--`

/**
 * @param {Properties} param0
 * @returns {Element}
 */
export default function({
  children,
  spacedTop,
  spacedBottom,
  className,
  align = "left",
  ...props
} = {}) {
  const contentBoxClass = classnames(SG, {
    [`${SGD}with-centered-elements`]: align === "center",
    [`${SGD}with-elements-to-right`]: align === "right",
    [`${SGD}spaced-top`]: spacedTop === "normal",
    [`${SGD}spaced-top-${spacedTop || ''}`]: spacedTop && spacedTop !== "normal",
    [`${SGD}spaced-bottom`]: spacedBottom === "normal",
    [`${SGD}spaced-bottom-${spacedBottom || ''}`]: spacedBottom && spacedBottom !== "normal"
  }, className);

  let div = document.createElement("div");
  div.className = contentBoxClass;

  if (children)
    div.appendChild(children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      div.setAttribute(propName, propVal)

  return div;
}
