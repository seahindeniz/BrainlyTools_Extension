/* eslint-disable no-param-reassign */
// @flow strict
type ChildrenType = string | Text | Element | HTMLElement | Node;

type ChildrenTypeWithObj =
  | string
  | Text
  | Element
  | HTMLElement
  | Node
  | { element: ChildrenType };

export type ChildrenParamType = ChildrenTypeWithObj | ChildrenTypeWithObj[];

export default function AddChildren(
  target: HTMLElement | Element,
  _children?: ChildrenParamType,
) {
  let children = _children;

  if (!target || children === undefined || children === null) return;

  if (children instanceof Array) {
    if (children.length > 0)
      children.forEach((child: ChildrenTypeWithObj) =>
        AddChildren(target, child),
      );

    return;
  }

  if (
    typeof children !== "string" &&
    !(children instanceof Text) &&
    !(children instanceof Element) &&
    !(children instanceof HTMLElement) &&
    !(children instanceof Node) &&
    children.element
  )
    children = children.element;

  if (typeof children === "string")
    target.insertAdjacentHTML("beforeend", children);
  else if (
    children instanceof Text ||
    children instanceof Element ||
    children instanceof HTMLElement ||
    children instanceof Node
  )
    target.append(children);
  // eslint-disable-next-line no-console
  else console.error("Unsupported children", children);
}
