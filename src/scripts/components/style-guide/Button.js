// @flow strict
/* eslint-disable no-underscore-dangle */

import AddChildren from "@style-guide/helpers/AddChildren";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import SetProps from "@style-guide/helpers/SetProps";
import type Icon from "@style-guide/Icon";
import classnames from "classnames";

const sg = "sg-button";
const SGD = `${sg}--`;

type ButtonSizeType = "large" | "medium" | "small" | "xsmall";

type ButtonColorType =
  | {
      type:
        | "solid"
        | "solid-inverted"
        | "solid-blue"
        | "solid-mint"
        | "solid-peach"
        | "solid-mustard"
        | "transparent-inverted"
        | "facebook",
      toggle?: null,
    }
  | {
      type: "solid-light" | "outline" | "transparent" | "transparent-light",
      toggle?: "peach" | "mustard" | "blue" | "mint" | null,
    }
  | {
      type: "transparent-peach",
      toggle?: "peach" | null,
    }
  | {
      type: "transparent-mustard",
      toggle?: "mustard" | null,
    }
  | {
      type: "transparent-blue",
      toggle?: "blue" | null,
    };

type ButtonIconType =
  | {
      icon?: Node,
      iconOnly?: null,
    }
  | {
      icon: Node,
      iconOnly?: boolean,
    };

type ButtonCornerSpaceSize =
  | boolean
  | "small"
  | "xsmall"
  | "xxsmall"
  | "large"
  | "xlarge"
  | "xxlarge";

type ButtonCornerSpaces =
  | boolean
  | {
      top?: ButtonCornerSpaceSize,
      left?: ButtonCornerSpaceSize,
      bottom?: ButtonCornerSpaceSize,
      right?: ButtonCornerSpaceSize,
    };

export type ButtonPropsType = {
  children?: ChildrenParamType,
  icon?: HTMLElement,
  size?: ButtonSizeType,
  href?: string,
  disabled?: boolean,
  fullWidth?: boolean,
  className?: string,
  tag: "button" | "a" | "label" | "input",
  text?: string,
  html?: string,
  title?: string,
  spaced?: ButtonCornerSpaces,
  noClick?: Boolean,
  ...
} & ButtonColorType &
  ButtonIconType;

// : $Keys<typeof HTMLElementTagNameMap2>
class Button {
  element: HTMLElement;
  textElement: ?HTMLSpanElement;
  iconContainer: HTMLSpanElement;
  size: ?ButtonSizeType;
  type: string;
  mainType: string;
  icon: ?Icon;
  iconElement: ?HTMLElement;
  toggle: ?string;
  mainToggle: ?string;

  constructor({
    size,
    type,
    icon,
    iconOnly,
    href,
    fullWidth,
    disabled,
    children,
    className,
    toggle,
    tag = "button",
    text,
    html,
    title,
    spaced,
    noClick,
    ...props
  }: ButtonPropsType) {
    this.size = size;
    this.type = type;
    this.mainType = type;
    this.toggle = toggle;
    this.mainToggle = toggle;

    const btnClass = classnames(
      sg,
      {
        [SGD + String(size)]: size,
        [SGD + type]: type,
        [`${SGD}disabled`]: disabled,
        [`${SGD}full-width`]: fullWidth,
        "sg-button--icon-only": Boolean(icon) && iconOnly,
        [`sg-button--${String(type)}-toggle-${String(toggle)}`]: toggle,
      },
      {
        [`${SGD}no-click`]: noClick,
      },
      className,
    );

    let tagName = tag;

    if (href !== undefined && href !== null && href !== "") tagName = "a";

    this.element = document.createElement(tagName);
    this.element.className = btnClass;

    if (spaced !== undefined && spaced !== null) {
      const styles = [];

      if (typeof spaced === "boolean") styles.push(`${SGD}spaced`);

      if (typeof spaced === "object")
        Object.entries(spaced).forEach(([corner, cornerSize]) => {
          if (typeof cornerSize === "boolean")
            styles.push(`${SGD}spaced-${corner}`);
          else {
            styles.push(`${SGD}spaced-${corner}-${String(cornerSize)}`);
          }
        });

      this.element.classList.add(...styles);
    }

    if (disabled === true && this.element instanceof HTMLButtonElement)
      this.element.disabled = true;

    if (
      href !== undefined &&
      href !== null &&
      href !== "" &&
      this.element instanceof HTMLAnchorElement
    )
      this.element.href = href;

    if (title !== undefined && title !== null && title !== "")
      this.element.title = title;

    SetProps(this.element, props);

    if (
      (text !== undefined && text !== null && text !== "") ||
      (html !== undefined && html !== null && html !== "") ||
      (children !== undefined && children !== null)
    ) {
      this.textElement = document.createElement("span");
      this.textElement.className = `${sg}__text`;

      if (html !== undefined && html !== null && html !== "")
        AddChildren(this.textElement, html);
      else if (text !== undefined && text !== null && text !== "")
        this.textElement.innerText = text;

      if (children !== undefined && children !== null)
        AddChildren(this.textElement, children);

      if (this.textElement) this.element.appendChild(this.textElement);
    }

    if (icon) {
      this.AddIcon(icon);
    }
  }

  Hide() {
    this.element.classList.add("js-hidden");

    return this;
  }

  Show() {
    this.element.classList.remove("js-hidden");

    return this;
  }

  Disable() {
    if (this.element instanceof HTMLButtonElement) this.element.disabled = true;

    this.element.classList.add(`${SGD}disabled`);

    return this;
  }

  Enable() {
    if (this.element instanceof HTMLButtonElement)
      this.element.disabled = false;

    this.element.classList.remove(`${SGD}disabled`);

    return this;
  }

  Active() {
    this.element.classList.add(`${SGD}active`);

    return this;
  }

  Inactive() {
    this.element.classList.remove(`${SGD}active`);

    return this;
  }

  ChangeType({ type, toggle }: ButtonColorType) {
    this.element.classList.remove(SGD + String(this.type));
    this.element.classList.remove(SGD + String(this.mainType));
    this.element.classList.remove(
      `sg-button--${String(this.type)}-toggle-${String(this.toggle)}`,
    );
    this.element.classList.remove(
      `sg-button--${String(this.mainType)}-toggle-${String(this.mainToggle)}`,
    );
    this.element.classList.add(SGD + type);
    this.element.classList.add(
      `sg-button--${String(type)}-toggle-${String(toggle)}`,
    );

    this.type = type;
    this.mainType = type;
    this.toggle = toggle;
    this.mainToggle = toggle;

    return this;
  }

  ChangeSize(size: ButtonSizeType) {
    if (this.size) {
      this.element.classList.remove(SGD + this.size);

      if (this.icon)
        this.iconContainer.classList.remove(
          `sg-button__icon--${this.size || ""}`,
        );
    }

    if (size) {
      this.element.classList.add(SGD + size);

      if (this.icon)
        this.iconContainer.classList.add(`sg-button__icon--${size || ""}`);
    }

    this.size = size;

    return this;
  }

  ToggleType({ type, toggle }: ButtonColorType) {
    this.element.classList.toggle(SGD + String(this.mainType));
    this.element.classList.toggle(
      `sg-button--${String(this.mainType)}-toggle-${String(this.mainToggle)}`,
    );
    this.element.classList.toggle(
      `sg-button--${String(type)}-toggle-${String(toggle)}`,
    );

    const hasTypeToggled = this.element.classList.toggle(SGD + type);
    this.type = hasTypeToggled ? type : this.mainType;
    this.toggle = hasTypeToggled ? toggle : this.mainToggle;

    return this;
  }

  IsDisabled() {
    return this.element.classList.contains(`${SGD}disabled`);
  }

  AddIcon(icon: HTMLElement | Icon) {
    if (typeof icon === "string" || !icon) throw Error("Invalid icon");

    if (this.icon) this.icon.element.remove();
    else if (this.iconContainer === null || this.iconContainer === undefined) {
      this.iconContainer = document.createElement("span");

      const iconClass = classnames("sg-button__icon", {
        [`sg-button__icon--${this.size || ""}`]: this.size,
      });

      this.iconContainer.className = iconClass;
      this.element.prepend(this.iconContainer);
    }

    if (icon instanceof HTMLElement) {
      this.icon = undefined;
      this.iconElement = icon;

      this.iconContainer.appendChild(icon);
    } else {
      if (icon.size === 24) icon.ChangeSize(this.size === "xsmall" ? 18 : 24);

      this.icon = icon;

      this.iconContainer.appendChild(icon.element);
    }

    return this;
  }

  ChangeIcon(icon?: HTMLElement) {
    if (!icon) return this.DeleteIcon();

    return this.AddIcon(icon);
  }

  DeleteIcon() {
    this.icon = undefined;

    if (this.iconContainer) this.iconContainer.remove();

    return this;
  }
}

export default Button;
