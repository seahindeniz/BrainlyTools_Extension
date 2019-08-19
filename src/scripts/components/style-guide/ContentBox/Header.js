import classnames from 'classnames';

/**
 * @typedef {"xxsmall" | "xsmall" | "small" | "normal" | "large" | "xlarge" | "xxlarge"} Size
 *
 * @typedef {"left" | "center" | "right"} Alignment
 *
 * @typedef {{children?: HTMLElement, spaced?: boolean, spacedSmall?: boolean, spacedTop?: Size, spacedBottom?: Size,full?: boolean, className?: string, align?: Alignment}} Properties
 */
const SG = "sg-content-box__header";
const SGD = `${SG}--`

/**
 * @param {Properties} param0
 */
export default function({ children, spaced, spacedSmall, spacedTop, spacedBottom, className, align = "left", ...props } = {}) {
  const contentBoxClass = classnames(SG, {
    [`${SGD}with-centered-elements`]: align === "center",
    [`${SGD}spaced`]: spaced,
    [`${SGD}spaced-small`]: spacedSmall,
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
      div[propName] = propVal;

  return div;
}
