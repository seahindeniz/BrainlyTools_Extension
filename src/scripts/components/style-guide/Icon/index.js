import classnames from 'classnames';

/**
 * @typedef {"ext-trash"
 * | "ext-info"
 * | "ext-icon"
 * } ExtensionTypes
 *
 * @typedef {ExtensionTypes
 * | 'all_questions'
 * | 'answer'
 * | 'arrow_double_down'
 * | 'arrow_down'
 * | 'arrow_left'
 * | 'arrow_right'
 * | 'arrow_up'
 * | 'ask_parent_to_pay'
 * | 'attachment'
 * | 'bold'
 * | 'bulleted_list'
 * | 'camera'
 * | 'check'
 * | 'close'
 * | 'counter'
 * | 'credit_card'
 * | 'equation'
 * | 'excellent'
 * | 'exclamation_mark'
 * | 'facebook'
 * | 'friends'
 * | 'heading'
 * | 'heart'
 * | 'image'
 * | 'instagram'
 * | 'italic'
 * | 'less'
 * | 'linkedin'
 * | 'lock_with_play'
 * | 'logout'
 * | 'medium'
 * | 'menu'
 * | 'messages'
 * | 'mic'
 * | 'money_transfer'
 * | 'more'
 * | 'notifications'
 * | 'numbered_list'
 * | 'padlock'
 * | 'pencil'
 * | 'play'
 * | 'plus'
 * | 'points'
 * | 'profile'
 * | 'profile_view'
 * | 'question'
 * | 'recent_questions'
 * | 'reload'
 * | 'report_flag'
 * | 'rotate'
 * | 'search'
 * | 'seen'
 * | 'settings'
 * | 'share'
 * | 'sms'
 * | 'star_half'
 * | 'star'
 * | 'subtitle'
 * | 'symbols'
 * | 'title'
 * | 'toughest_questions'
 * | 'twitter'
 * | 'underlined'
 * | 'verified'
 * | 'youtube'
 * } Type
 *
 * @typedef {120
 * | 118
 * | 104
 * | 102
 * | 80
 * | 78
 * | 64
 * | 62
 * | 56
 * | 54
 * | 48
 * | 46
 * | 32
 * | 30
 * | 26
 * | 24
 * | 22
 * | 20
 * | 18
 * | 16
 * | 14
 * | 10
 * } Size
 *
 * @typedef {'adaptive'
 * | 'blue'
 * | 'dark'
 * | 'gray'
 * | 'gray-light'
 * | 'gray-secondary'
 * | 'lavender'
 * | 'light'
 * | 'mint'
 * | 'mustard'
 * | 'navy-blue'
 * | 'peach'
 * } Color
 *
 * @typedef {{
 *  tag?: string,
 *  type?: Type,
 *  size?: Size,
 *  color?: Color,
 *  className?: string,
 * } & Object<string, *>} Properties
 *
 * @typedef {function(): IconElement} TogglePulse
 *
 * @typedef {{
 *  size: Size,
 *  color: Color,
 *  ChangeSize: ChangeSize,
 *  ChangeColor: ChangeColor,
 *  TogglePulse: TogglePulse,
 * }} CustomProperties
 *
 * @typedef {CustomProperties & HTMLElement} IconElement
 */
const sg = "sg-icon";
const SGD = `${sg}--`;

/**
 * @param {Properties} param0
 * @returns {IconElement}
 */
export default function Icon({
  tag = "div",
  type,
  size = 24,
  color,
  className,
  ...props
}) {
  if (!type)
    throw "Icon type cannot be empty";

  const iconClass = classnames(sg, {
    [SGD + color]: color,
    [`${SGD}x${size}`]: size
  }, className);

  /**
   * @type {IconElement}
   */
  // @ts-ignore
  let div = document.createElement(tag);
  div.className = iconClass;
  div.size = size;
  div.color = color;
  // @ts-ignore
  div.ChangeSize = ChangeSize;
  // @ts-ignore
  div.ChangeColor = ChangeColor;
  div.TogglePulse = _TogglePulse;

  let svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
  let use = document.createElementNS('http://www.w3.org/2000/svg', "use");

  svg.appendChild(use);
  div.appendChild(svg);

  svg.classList.add(`${sg}__svg`);
  use.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    "xlink:href",
    `#icon-${type}`
  );

  if (props)
    for (let [propName, propVal] of Object.entries(props))
        div[propName] = propVal;

  return div
};

/**
 * @this {IconElement}
 * @typedef {ChangeSize} ChangeSize
 * @param {Size} size
 */
function ChangeSize(size) {
  this.classList.add(`${SGD}x${size}`);
  this.classList.remove(`${SGD}x${this.size}`);

  this.size = size;

  return this;
}

/**
 * @this {IconElement}
 * @typedef {ChangeColor} ChangeColor
 * @param {Color} color
 */
function ChangeColor(color) {
  this.classList.remove(SGD + this.color);
  this.classList.add(SGD + color);

  this.color = color;

  return this;
}

/**
 * @this {IconElement}
 */
function _TogglePulse() {
  this.classList.toggle(`${SGD}pulse`)

  return this;
}
