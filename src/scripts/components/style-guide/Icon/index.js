// @flow strict

import AddChildren from "@style-guide/helpers/AddChildren";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import SetProps from "@style-guide/helpers/SetProps";
import classnames from "classnames";

type ExtensionIconTypeType =
  | "ext-trash"
  | "ext-info"
  | "ext-icon"
  | "ext-csv"
  | "ext-ods"
  | "ext-xlsx";

export type IconTypeType =
  | "all_questions"
  | "answer"
  | "arrow_double_down"
  | "arrow_down"
  | "arrow_left"
  | "arrow_right"
  | "arrow_up"
  | "ask_parent_to_pay"
  | "attachment"
  | "bell_checked"
  | "bell_outlined"
  | "bold"
  | "bulleted_list"
  | "camera"
  | "check"
  | "close"
  | "counter"
  | "credit_card"
  | "crown_outlined"
  | "equation"
  | "excellent"
  | "exclamation_mark"
  | "facebook"
  | "friend_add"
  | "friend_checked"
  | "friends"
  | "heading"
  | "heart"
  | "heart_outlined"
  | "image"
  | "influence"
  | "instagram"
  | "italic"
  | "less"
  | "linkedin"
  | "lock_with_play"
  | "logout"
  | "medium"
  | "menu"
  | "messages"
  | "mic"
  | "money_transfer"
  | "more"
  | "notifications"
  | "numbered_list"
  | "open_in_new_tab"
  | "padlock"
  | "pencil"
  | "play"
  | "plus"
  | "points"
  | "profile"
  | "profile_view"
  | "question"
  | "recent_questions"
  | "reload"
  | "report_flag"
  | "report_flag_outlined"
  | "rotate"
  | "search"
  | "seen"
  | "settings"
  | "share"
  | "sms"
  | "star"
  | "star_half"
  | "star_half_outlined"
  | "star_outlined"
  | "subtitle"
  | "symbols"
  | "title"
  | "toughest_questions"
  | "twitter"
  | "underlined"
  | "unseen"
  | "verified"
  | "youtube"
  | ExtensionIconTypeType;

export type IconColorType =
  | "adaptive"
  | "blue"
  | "dark"
  | "gray"
  | "gray-light"
  | "gray-secondary"
  | "lavender"
  | "light"
  | "mint"
  | "mustard"
  | "navy-blue"
  // Additional
  | "peach";

export type IconTagType = "div" | "span";

export type IconSizeType =
  | 120
  | 118
  | 104
  | 102
  | 80
  | 78
  | 64
  | 62
  | 56
  | 54
  | 48
  | 46
  | 40
  | 32
  | 30
  | 26
  | 24
  | 22
  | 20
  | 18
  | 16
  | 14
  | 10;

export type IconPropsType = {
  color?: ?IconColorType,
  size?: ?IconSizeType,
  tag?: IconTagType,
  className?: ?string,
  // Additional
  reverse?: boolean,
  ...
} & (
  | {
      type?: IconTypeType,
      children?: ?null,
    }
  | {
      type?: null,
      children?: ?ChildrenParamType,
    }
);

const sg = "sg-icon";
const SGD = `${sg}--`;

class Icon {
  type: ?IconTypeType;

  size: ?IconSizeType;

  color: ?IconColorType;

  element: HTMLElement;

  use: Element;

  constructor({
    type,
    size = 24,
    color,
    className,
    tag = "div",
    reverse,
    // $FlowFixMe
    children,
    ...props
  }: IconPropsType) {
    this.type = type;
    this.size = size;
    this.color = color;

    const iconClass = classnames(
      sg,
      {
        [SGD + String(color)]: color,
        [`${SGD}x${String(size)}`]: size,
        [`${SGD}reverse`]: reverse,
      },
      className,
    );

    this.element = document.createElement(tag);
    this.element.className = iconClass;

    if (type) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");

      svg.appendChild(this.use);
      this.element.appendChild(svg);

      svg.classList.add(`${sg}__svg`);
      this.use.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        `#icon-${type}`,
      );
    }

    AddChildren(this.element, children);
    SetProps(this.element, props);
  }

  ChangeSize(size: IconSizeType) {
    this.element.classList.add(`${SGD}x${size}`);
    this.element.classList.remove(`${SGD}x${String(this.size)}`);

    this.size = size;

    return this;
  }

  ChangeColor(color: IconColorType) {
    this.element.classList.remove(SGD + String(this.color));
    this.element.classList.add(SGD + color);

    this.color = color;

    return this;
  }

  ChangeType(type: IconTypeType) {
    this.use.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      `#icon-${type}`,
    );

    this.type = type;

    return this;
  }

  TogglePulse() {
    this.element.classList.toggle(`${SGD}pulse`);

    return this;
  }
}

export default Icon;
