// @flow strict

import classnames from "classnames";
import AddChildren from "@style-guide/helpers/AddChildren";
import SetProps from "@style-guide/helpers/SetProps";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";

type CreateElementPropsType<T> = {
  tag: T;
  children?: ChildrenParamType;
  className?: string;
  fullWidth?: boolean;
  [x: string]: any;
};

export default function CreateElement<T extends keyof HTMLElementTagNameMap>({
  tag,
  children,
  className,
  fullWidth,
  ...props
}: CreateElementPropsType<T>) {
  if (tag === null || tag === undefined) throw Error("Tag name is required");

  const classNames = classnames(className, {
    "sg--full": fullWidth,
  });

  const element = document.createElement(tag);

  if (classNames) element.className = classNames;

  AddChildren(element, children);
  SetProps(element, props);

  return element;
}
