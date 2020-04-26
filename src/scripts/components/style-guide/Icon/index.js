import classnames from 'classnames';
import SetProps from '@style-guide/helpers/SetProps';
import AddChildren from '@style-guide/helpers/AddChildren';

/**
 * @typedef {"ext-trash"
 * | "ext-info"
 * | "ext-icon"
 * | "ext-csv"
 * | "ext-ods"
 * | "ext-xlsx"
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
 * | 'bell_checked'
 * | 'bell_outlined'
 * | 'bold'
 * | 'bulleted_list'
 * | 'camera'
 * | 'check'
 * | 'close'
 * | 'counter'
 * | 'credit_card'
 * | 'crown_outlined'
 * | 'equation'
 * | 'excellent'
 * | 'exclamation_mark'
 * | 'facebook'
 * | 'friend_add'
 * | 'friend_checked'
 * | 'friends'
 * | 'heading'
 * | 'heart'
 * | 'heart_outlined'
 * | 'image'
 * | 'influence'
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
 * | 'open_in_new_tab'
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
 * | 'report_flag_outlined'
 * | 'rotate'
 * | 'search'
 * | 'seen'
 * | 'settings'
 * | 'share'
 * | 'sms'
 * | 'star'
 * | 'star_half'
 * | 'star_half_outlined'
 * | 'star_outlined'
 * | 'subtitle'
 * | 'symbols'
 * | 'title'
 * | 'toughest_questions'
 * | 'twitter'
 * | 'underlined'
 * | 'verified'
 * | 'youtube'
 * } IconTypeType
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
 * | 40
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
 * @typedef {Object} Properties
 * @property {string} [Properties.tag="div"] - Default "div"
 * @property {IconTypeType} [Properties.type]
 * @property {Size} [Properties.size=24] - Default 24
 * @property {Color} [Properties.color]
 * @property {string} [Properties.className]
 * @property {boolean} [Properties.reverse]
 * @property {import('../helpers/AddChildren').ChildrenParamType} [Properties.children]
 *
 * @typedef {function(Size): IconElement} ChangeSize
 * @typedef {function(Color): IconElement} ChangeColor
 * @typedef {function(IconTypeType): IconElement} ChangeType
 * @typedef {function(): IconElement} TogglePulse
 *
 * @typedef {{
 *  size: Size,
 *  type: IconTypeType,
 *  color: Color,
 *  ChangeSize: ChangeSize,
 *  ChangeColor: ChangeColor,
 *  ChangeType: ChangeType,
 *  TogglePulse: TogglePulse,
 * }} CustomProperties
 *
 * @typedef {CustomProperties & HTMLElement} IconElement
 */
const sg = "sg-icon";
const SGD = `${sg}--`;

/**
 * @param {Properties & {[x: string]: *}} param0
 * @returns {IconElement}
 */
export default function Icon({
  tag = "div",
  type,
  size = 24,
  color,
  className,
  reverse,
  children,
  ...props
}) {
  const iconClass = classnames(sg, {
    [SGD + color]: color,
    [`${SGD}x${size}`]: size,
    [`${SGD}reverse`]: reverse,
  }, className);

  /**
   * @type {IconElement}
   */
  let div = (document.createElement(tag));
  div.className = iconClass;
  div.size = size;
  div.type = type;
  div.color = color;
  props.ChangeSize = _ChangeSize;
  props.ChangeColor = _ChangeColor;
  props.ChangeType = _ChangeType;
  props.TogglePulse = _TogglePulse;

  if (type) {
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
  }

  AddChildren(div, children);
  SetProps(div, props);

  return div;
};

/**
 * @this {IconElement}
 * @param {Size} size
 */
function _ChangeSize(size) {
  this.classList.add(`${SGD}x${size}`);
  this.classList.remove(`${SGD}x${this.size}`);

  this.size = size;

  return this;
}

/**
 * @this {IconElement}
 * @param {Color} color
 */
function _ChangeColor(color) {
  this.classList.remove(SGD + this.color);
  this.classList.add(SGD + color);

  this.color = color;

  return this;
}

/**
 * @this {IconElement}
 * @param {IconTypeType} type
 */
function _ChangeType(type) {
  let use = this.querySelector("use");

  use.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    "xlink:href",
    `#icon-${type}`
  );

  this.type = type;

  return this;
}

/**
 * @this {IconElement}
 */
function _TogglePulse() {
  this.classList.toggle(`${SGD}pulse`)

  return this;
}
