/**
 * @typedef {string | Text | Element | HTMLElement | ChildNode} ChildrenType
 *
 * @typedef {ChildrenType | ChildrenType[]} ChildrenParamType
 *
 * @param {HTMLElement | Element} target
 * @param {ChildrenParamType} children
 */
export default function AddChildren(target, children) {
  if (!target || !children)
    return;

  if (children instanceof Array) {
    if (children.length > 0)
      children.forEach(child => AddChildren(target, child));
  } else if (typeof children == "string")
    target.insertAdjacentHTML("beforeend", children);
  else
    target.append(children);
}
