import classnames from 'classnames';

export const TEXT_ALIGN = Object.freeze({
  LEFT: 'to-left',
  CENTER: 'to-center',
  RIGHT: 'to-right',
  JUSTIFY: 'justify'
});
/**
 * @typedef {"span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "label" | "a" | "blockquote"} Type
 *
 * @typedef {"xsmall" | "small" | "normal" | "large" | "xlarge" | "xxlarge"} Size
 *
 * @typedef {"" | "white" | "gray" | "gray-secondary" | "gray-secondary-light" | "mint-dark" | "peach-dark" | "mustard-dark" | "lavender-dark" | "blue-dark"} Color
 *
 * @typedef {"mustard" | "mint" | "peach" | "light-gray" | "blue-dark" | "blue-light"} BgColor
 *
 * @typedef {"regular" | "bold"} Weight
 *
 * @typedef {"uppercase" | "lowercase" | "capitalize"} Transform
 *
 * @typedef {"LEFT" | "CENTER" | "RIGHT" | "JUSTIFY"} Align
 *
 * @typedef {{children?: HTMLElement, text?: string | number, html?: string, type?: Type, size?: Size, weight?: Weight, color?: Color, transform?: Transform, align?: Align, noWrap?: boolean, asContainer?: boolean, full?: boolean, breakWords?: boolean, className?: string, bgColor?: BgColor}} Properties
 */

const SG = "sg-text";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default function({ children, text, html, type = "div", size = "normal", weight = "regular", color, transform, align, noWrap, asContainer, full, breakWords, className, bgColor, ...props } = {}) {
  const textClass = classnames('sg-text', {
    [SGD + size]: size !== "normal",
    [SGD + color]: color,
    [`${SGD}background-${bgColor}`]: bgColor,
    [SGD + weight]: weight !== "regular",
    [SGD + transform]: transform,
    [SGD + TEXT_ALIGN[align]]: TEXT_ALIGN[align],
    [`${SGD}container`]: asContainer,
    [`${SGD}full`]: full,
    [`${SGD}no-wrap`]: noWrap,
    [`${SGD}break-words`]: breakWords
  }, className);

  let textElement = document.createElement(type);
  textElement.className = textClass;

  if (children)
    textElement.appendChild(children);

  if (text !== undefined)
    textElement.innerText = String(text);

  if (html !== undefined)
    textElement.innerHTML = html;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      textElement.setAttribute(propName, propVal)

  return textElement;
}
