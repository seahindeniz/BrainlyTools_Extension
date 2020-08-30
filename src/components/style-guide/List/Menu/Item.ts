import CreateElement from "@components/CreateElement";
import { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import classNames from "classnames";

export type MenuItemPropsType = {
  text?: string;
  html?: string;
  children?: ChildrenParamType;
  href?: string;
  type?: "a" | "span" | "label";
  className?: string;
};

const SG = "sg-menu-list";
const SGL = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default ({
  text,
  html,
  children,
  href,
  type = "a",
  className,
  ...props
}: MenuItemPropsType = {}) => {
  const linkClass = classNames(`${SGL}link sg-text--link`, className);

  const element = document.createElement("li");
  element.className = `${SGL}element`;

  if (typeof text !== "undefined" || typeof html !== "undefined" || children) {
    // eslint-disable-next-line no-param-reassign
    children = CreateElement({
      tag: type,
      className: linkClass,
      children: [text, html, children],
      href,
      ...props,
    });
  }

  return CreateElement({
    tag: "li",
    className: `${SGL}element`,
    children,
  });
};
