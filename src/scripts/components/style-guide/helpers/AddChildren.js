/**
 * @typedef {string | Text | Element | HTMLElement | ChildNode} ChildrenType
 *
 * @typedef {ChildrenType | ChildrenType[]} ChildrenParamType
 *
 * @param {HTMLElement} target
 * @param {ChildrenParamType} children
 */
export default function AddChildren(target, children) {
  if (!target || !children)
    return;

  if (children instanceof Array && children.length > 0)
    children.forEach(child => AddChildren(target, child));
  else if (typeof children == "string")
    target.insertAdjacentHTML("beforeend", children);
  else if (
    children instanceof Text ||
    children instanceof Element ||
    children instanceof HTMLElement
  )
    target.append(children);
}
