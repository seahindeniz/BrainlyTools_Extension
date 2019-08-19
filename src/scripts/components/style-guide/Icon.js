import classnames from 'classnames';

/**
 * typedef {"answer" | "answered" | "arrow_down" | "arrow_double_down" | "arrow_left" | "arrow_right" | "arrow_up" | "attachment" | "bold" | "camera" | "change_status" | "check" | "comment" | "counter" | "cup" | "equation" | "exclamation_mark" | "excellent" | "expert" | "friends" | "heart" | "keyboard" | "lightning" | "logout" | "menu" | "messages" | "notifications" | "pencil" | "planet" | "plus" | "podium" | "points" | "profile" | "profile_edit" | "profile_view" | "question" | "reload" | "report_flag" | "search" | "seen" | "star" | "stream" | "student" | "symbols" | "thumbs_up" | "unseen" | "verified" | "x" | "fb"} OldType
 *
 * @typedef {"ext-trash" | "ext-info" | "ext-icon"} ExtensionTypes
 *
 * @typedef {"std-all_questions" | "std-answer" | "std-arrow_double_down" | "std-arrow_down" | "std-arrow_left" | "std-arrow_right" | "std-arrow_up" | "std-ask_parent_to_pay" | "std-attachment" | "std-bold" | "std-bulleted_list" | "std-camera" | "std-check" | "std-close" | "std-counter" | "std-credit_card" | "std-equation" | "std-excellent" | "std-exclamation_mark" | "std-facebook" | "std-friends" | "std-heading" | "std-heart" | "std-image" | "std-instagram" | "std-italic" | "std-less" | "std-linkedin" | "std-lock_with_play" | "std-medium" | "std-logout" | "std-menu" | "std-messages" | "std-mic" | "std-money_transfer" | "std-more" | "std-notifications" | "std-numbered_list" | "std-pencil" | "std-play" | "std-plus" | "std-points" | "std-profile" | "std-profile_view" | "std-question" | "std-recent_questions" | "std-reload" | "std-report_flag" | "std-rotate" | "std-search" | "std-seen" | "std-settings" | "std-share" | "std-sms" | "std-star_half" | "std-star" | "std-subtitle" | "std-symbols" | "std-title" | "std-toughest_questions" | "std-twitter" | "std-underlined" | "std-verified" | "std-youtube" | ExtensionTypes} Type
 *
 * @typedef {(120 | 118 | 64 | 62 | 48 | 46 | 32 | 30 | 26 | 24 | 22 | 20 | 18 | 16 | 14 | 10)} Size
 *
 * @typedef {"adaptive" | "blue" | "dark" | "gray" | "gray-light" | "gray-secondary" | "lavender" | "light" | "mint" | "mustard" | "navy-blue" | "peach"} Color
 *
 * @typedef {{tag?: string, type: Type, size?: Size, color?: Color, className?: string}} Properties
 *
 * @typedef {{size: Size, ChangeSize: ChangeSize}} CustomProperties
 *
 * @typedef {CustomProperties & HTMLElement} IconElement
 */
const sg = "sg-icon";
const SGD = `${sg}--`;

/**
 * @param {Properties} param0
 * @returns {IconElement}
 */
export default function Icon({ tag = "div", type, size = 24, color, className }) {
  if (!type)
    throw "Icon type cannot be empty";

  /**
   * @type {IconElement}
   */
  // @ts-ignore
  let div = document.createElement(tag);
  let svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
  let use = document.createElementNS('http://www.w3.org/2000/svg', "use");

  svg.appendChild(use);
  div.appendChild(svg);

  svg.classList.add(`${sg}__svg`);
  use.setAttributeNS('http://www.w3.org/1999/xlink', "xlink:href", `#icon-${type}`);

  const iconClass = classnames(sg, {
    [SGD + color]: color,
    [`${SGD}x${size}`]: size
  }, className);

  div.className = iconClass;
  div.size = size;
  // @ts-ignore
  div.ChangeSize = ChangeSize;

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
