import classnames from 'classnames';

/**
 * @typedef {"short" | "normal" | "tall" | "xtall"} Size
 *
 * @typedef {true | "vertical" | "horizontal" | "both"} Direction
 *
 * @typedef {'default' | 'white'} TextareaColorType
 *
 * @typedef {"textarea"} DefaultTagNamesType
 *
 * @typedef {{
 *  tag?: DefaultTagNamesType | keyof HTMLElementTagNameMap,
 *  placeholder?: string,
 *  value?: string | number,
 *  color?: TextareaColorType,
 *  size?: Size,
 *  valid?: boolean,
 *  invalid?: boolean,
 *  fullWidth?: boolean,
 *  simple?: boolean,
 *  noPadding?: boolean,
 *  autoHeight?: boolean,
 *  resizable?: Direction,
 *  className?: string,
 *  contentEditable?: boolean,
 * } & {[x: string]: *}} Properties
 */

const SG = "sg-textarea";
const SGD = `${SG}--`;

/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {{tag?: DefaultTagNamesType | T} & Properties} param0
 */
export default function({
  valid,
  invalid,
  size = "normal",
  color = "default",
  fullWidth,
  simple,
  noPadding,
  autoHeight,
  value = "",
  className,
  tag = "textarea",
  resizable,
  placeholder,
  contentEditable,
  ...props
} = {}) {
  if (valid === true && invalid === true)
    throw 'Textarea can be either valid or invalid!';

  const textareaClass = classnames(SG, {
    [SGD + size]: size !== "normal",
    [SGD + color]: color !== "default",
    [`${SGD}valid`]: valid,
    [`${SGD}invalid`]: invalid,
    [`${SGD}full-width`]: fullWidth,
    [`${SGD}simple`]: simple,
    [`${SGD}no-padding`]: noPadding,
    [`${SGD}auto-height`]: autoHeight,

    [`${SGD}resizable`]: resizable === true,
    [`${SGD}resizable-${resizable}`]: resizable && resizable !== true
  }, className);

  /**
   * @type {HTMLElementTagNameMap[T]}
   */
  // @ts-ignore
  let textarea = document.createElement(tag);

  textarea.className = textareaClass;

  if (
    textarea instanceof HTMLTextAreaElement ||
    textarea instanceof HTMLInputElement
  ) {
    textarea.value = String(value);
  } else {
    textarea.innerHTML = String(value);

    if (contentEditable)
      textarea.contentEditable = "true";
  }

  if (placeholder)
    textarea.setAttribute("placeholder", placeholder)

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      textarea[propName] = propVal;

  return textarea
}
