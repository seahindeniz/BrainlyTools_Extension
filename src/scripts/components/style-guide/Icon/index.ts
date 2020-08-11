import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import classnames from "classnames";
import CreateElement from "../../CreateElement";

type ExtensionIconTypeType =
  | "ext-info"
  | "ext-icon"
  | "ext-csv"
  | "ext-ods"
  | "ext-xlsx";

export type IconTypeType =
  | "academic_cap"
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
  | "calendar"
  | "camera"
  | "check"
  | "close"
  | "comment"
  | "comment_outlined"
  | "counter"
  | "credit_card"
  | "crown_outlined"
  | "equation"
  | "excellent"
  | "exclamation_mark"
  | "facebook"
  | "friend_add"
  | "friend_remove"
  | "friend_pending"
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
  | "add_more"
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
  | "trash"
  | "twitter"
  | "underlined"
  | "unseen"
  | "verified"
  | "youtube"
  | "arrow_top_right"
  | "circle"
  | "crop"
  | "cyrillic"
  | "draw"
  | "drawing_mode"
  | "european"
  | "greek"
  | "highlight"
  | "line"
  | "more"
  | "pause"
  | "rectangle"
  | "sup_sub"
  | "triangle"
  | "pi"
  | "quote"
  | "spark"
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
  | 38
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

// TODO Move common props to common object
export type IconPropsType = {
  [x: string]: any;
} & (
  | {
      className?: string;
      color?: IconColorType;
      size?: IconSizeType;
      tag?: IconTagType;
      children?: null;
      type: IconTypeType;
      // Additional
      reverse?: boolean;
    }
  | {
      className?: string;
      color?: IconColorType;
      size?: IconSizeType;
      tag?: IconTagType;
      children: ChildrenParamType;
      type?: null;
      // Additional
      reverse?: boolean;
    }
);

const sg = "sg-icon";
const SGD = `${sg}--`;

class Icon {
  type: IconTypeType;
  size: IconSizeType;
  color: IconColorType;
  element: HTMLElement;
  svg: SVGSVGElement;
  use: SVGUseElement;

  constructor({
    type,
    size = 24,
    color,
    className,
    tag = "div",
    reverse,
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

    if (type) {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");

      this.svg.appendChild(this.use);

      this.svg.classList.add(`${sg}__svg`);
      this.use.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        `#icon-${type}`,
      );
    }

    this.element = CreateElement({
      tag,
      className: iconClass,
      children: [children, this.svg],
      ...props,
    });
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
