// @flow strict

import classnames from "classnames";
import AddChildren from "@style-guide/helpers/AddChildren";
import SetProps from "@style-guide/helpers/SetProps";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";

type CreateElementPropsType<T> = {
  tag: T,
  children?: ChildrenParamType,
  className?: string,
  fullWidth?: boolean,
  onClick?: Event => mixed,
  ...
};

export default function CreateElement<T: string>({
  tag,
  children,
  className,
  fullWidth,
  onClick,
  ...props
}: CreateElementPropsType<T>) /* : $ElementType<HTMLElementTagNameMap3, T> */ {
  if (tag === null || tag === undefined) throw Error("Tag name is required");

  const classNames = classnames(className, {
    "sg--full": fullWidth,
  });

  const element = document.createElement(tag);
  element.className = classNames;

  AddChildren(element, children);
  SetProps(element, props);

  if (onClick && typeof onClick === "function")
    element.addEventListener("click", onClick);

  return element;
}
