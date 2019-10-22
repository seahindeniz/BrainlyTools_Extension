import classnames from 'classnames';

export const TEXT_ALIGN = Object.freeze({
  LEFT: 'to-left',
  CENTER: 'to-center',
  RIGHT: 'to-right',
  JUSTIFY: 'justify'
});
/**
 * @typedef {"span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" |
 * "label" | "a" | "blockquote"} Type
 *
 * @typedef {"xsmall" | "small" | "normal" | "large" | "xlarge" | "xxlarge"} Size
 *
 * @typedef {"" | "white" | "gray" | "gray-secondary" | "gray-secondary-light" |
 * "mint-dark" | "peach-dark" | "mustard-dark" | "lavender-dark" | "blue-dark"
 * } Color
 *
 * @typedef {"mustard" | "mint" | "peach" | "light-gray" | "blue-dark" |
 * "blue-light"} BgColor
 *
 * @typedef {"regular" | "bold"} Weight
 *
 * @typedef {"uppercase" | "lowercase" | "capitalize"} Transform
 *
 * @typedef {"LEFT" | "CENTER" | "RIGHT" | "JUSTIFY"} Align
 *
 * @typedef {{
 *  children?: HTMLElement | HTMLElement[],
 *  text?: string | number,
 *  html?: string,
 *  type?: Type,
 *  size?: Size,
 *  weight?: Weight,
 *  color?: Color,
 *  transform?: Transform,
 *  align?: Align,
 *  noWrap?: boolean,
 *  asContainer?: boolean,
 *  full?: boolean,
 *  breakWords?: boolean,
 *  title?: string,
 *  href?: string,
 *  underlined?: boolean,
 *  unstyled?: boolean,
 *  className?: string,
 *  bgColor?: BgColor,
 * } & Object<string, *>} Properties
 *
 *
 *
 * @typedef {function(Color): TextElement} ChangeColor
 *
 * @typedef {{
 *  color: Color,
 *  ChangeColor: ChangeColor,
 * }} CustomProperties
 *
 * @typedef {CustomProperties & (HTMLDivElement | HTMLAnchorElement)} TextElement
 */

const SG = "sg-text";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default function({
  children,
  text,
  html,
  type = "div",
  size = "normal",
  weight = "regular",
  color,
  transform,
  align,
  noWrap,
  asContainer,
  full,
  breakWords,
  title,
  href,
  underlined,
  unstyled,
  className,
  bgColor,
  ...props
} = {}) {
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
    [`${SGD}break-words`]: breakWords,
    [`${SGD}underlined`]: underlined,
    [`${SGD}unstyled`]: unstyled,
  }, className);

  if (href !== undefined && href !== "")
    type = "a";

  /**
   * @type {TextElement}
   */
  // @ts-ignore
  let textElement = document.createElement(type);
  textElement.className = textClass;
  textElement.color = color;
  // @ts-ignore
  textElement.ChangeColor = _ChangeColor;

  if (textElement instanceof HTMLAnchorElement) {
    textElement.classList.add(`${SGD}link`);

    if (href)
      textElement.href = href;
  }

  if (title)
    textElement.title = title;

  if (text !== undefined)
    textElement.innerText = String(text);

  if (html !== undefined)
    textElement.innerHTML = html;

  if (children instanceof Array && children.length > 0)
    textElement.append(...children);
  else if (children instanceof HTMLElement)
    textElement.append(children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
        textElement[propName] = propVal;

  return textElement;
}

/**
 * @this {TextElement}
 * @param {Color} color
 */
function _ChangeColor(color) {
  this.classList.remove(SGD + this.color);
  this.classList.add(SGD + color);

  this.color = color;

  return this;
}
