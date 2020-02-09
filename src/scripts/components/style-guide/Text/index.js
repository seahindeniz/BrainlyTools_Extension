import classnames from 'classnames';
import AddChildren from '../helpers/AddChildren';

/**
 * @typedef {TEXT_ALIGN} TextAlignType
 */
const TEXT_ALIGN = {
  LEFT: 'to-left',
  CENTER: 'to-center',
  RIGHT: 'to-right',
  JUSTIFY: 'justify'
};

/**
 * @typedef {'xsmall'
 * | 'small'
 * | 'normal'
 * | 'large'
 * | 'xlarge'
 * | 'xxlarge'
 * } TextSizeType
 *
 * @typedef {'default'
 * | 'white'
 * | 'gray'
 * | 'gray-secondary'
 * | 'gray-secondary-light'
 * | 'mint-dark'
 * | 'peach-dark'
 * | 'mustard-dark'
 * | 'lavender-dark'
 * | 'blue-dark'
 * } TextColorType
 *
 * @typedef {"mustard" | "mint" | "peach" | "light-gray" | "blue-dark" |
 * "blue-light"} TextBgColorType
 *
 * @typedef {"regular" | "bold" | "extraBold"} TextWeightType
 *
 * @typedef {"uppercase" | "lowercase" | "capitalize"} TextTransformType
 *
 * @typedef {"div" | "a"} TextDefaultTagNamesType
 *
 * @typedef {{
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  text?: string | number,
 *  html?: string,
 *  size?: TextSizeType,
 *  weight?: TextWeightType,
 *  color?: TextColorType,
 *  transform?: TextTransformType,
 *  align?: keyof TextAlignType,
 *  noWrap?: boolean,
 *  asContainer?: boolean,
 *  full?: boolean,
 *  breakWords?: boolean,
 *  title?: string,
 *  href?: string,
 *  underlined?: boolean,
 *  unstyled?: boolean,
 *  className?: string,
 *  bgColor?: TextBgColorType,
 *  tag?: TextDefaultTagNamesType | keyof HTMLElementTagNameMap,
 *  [x: string]: *
 * }} TextProperties
 *
 * @typedef {function(TextColorType): TextElement} ChangeColor
 *
 * @typedef {{
 *  color: TextColorType,
 *  ChangeColor: ChangeColor,
 * }} TextCustomProperties
 *
 * @typedef {TextCustomProperties & HTMLElement} TextElement
 */

const SG = "sg-text";
const SGD = `${SG}--`;

/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {{tag?: TextDefaultTagNamesType | T} & TextProperties} param0
 */
export default function({
  children,
  text,
  html,
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
  tag = "div",
  ...props
} = {}) {
  const textClass = classnames('sg-text', {
    [`sg-text--${String(size)}`]: size !== "normal",
    [`sg-text--${String(color)}`]: color !== "default",
    [`sg-text--${String(weight)}`]: weight !== "regular",
    [`sg-text--${transform || ''}`]: transform,
    [`sg-text--${TEXT_ALIGN[align] || ''}`]: TEXT_ALIGN[align],
    'sg-text--container': asContainer,
    'sg-text--full': full,
    'sg-text--no-wrap': noWrap,
    'sg-text--break-words': breakWords,

    [`sg-text--background-${bgColor}`]: bgColor,
    [`sg-text--underlined`]: underlined,
    [`sg-text--unstyled`]: unstyled,
  }, className);

  if (href !== undefined && href !== "")
    tag = "a";

  /**
   * @type {HTMLElementTagNameMap[T] & TextElement}
   */
  // @ts-ignore
  let textElement = document.createElement(tag);
  textElement.className = textClass;
  textElement.color = color;
  // @ts-ignore
  textElement.ChangeColor = _ChangeColor;

  if (tag === "a" || href !== undefined) {
    textElement.classList.add(`sg-text--link`);

    if (textElement instanceof HTMLAnchorElement && href)
      textElement.href = href;
  }

  if (title)
    textElement.title = title;

  if (text !== undefined)
    textElement.innerText = String(text);

  /* if (html !== undefined)
    textElement.innerHTML = html; */
  if (html && children)
    console.error("Alert: Text component has html and children");

  if (html)
    children = html;

  AddChildren(textElement, children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      textElement[propName] = propVal;

  return textElement;
}

/**
 * @this {TextElement}
 * @param {TextColorType} color
 */
function _ChangeColor(color) {
  this.classList.remove(SGD + this.color);
  this.classList.add(SGD + color);

  this.color = color;

  return this;
}
