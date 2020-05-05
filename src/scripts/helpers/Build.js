// @flow
/* eslint-disable no-param-reassign */

function Append<T, Z>(parent: T, child: Z | string | HTMLElement | Function) {
  // $FlowFixMe
  if (parent.element) parent = parent.element;

  // $FlowFixMe
  if (typeof parent === "function") parent = parent();

  // $FlowFixMe
  if (child.element) child = child.element;

  // $FlowFixMe
  if (child instanceof Function) child = child();

  if (typeof child === "number") child = String(child);

  if (
    parent instanceof HTMLElement &&
    (child instanceof HTMLElement || typeof child === "string")
  )
    parent.append(child);
}

export default function Build<T, Z>(parent: T, elements: Z) {
  if (!parent) throw Error("Undefined parent");

  // $FlowFixMe
  if (parent.element) parent = parent.element;

  // $FlowFixMe
  if (parent instanceof Function) parent = parent();

  if (!(parent instanceof HTMLElement))
    throw Error("Parent element must be an HTMLElement");

  if (elements) {
    if (elements instanceof Array)
      elements.forEach(element => {
        if (element instanceof Array) element = Build(element[0], element[1]);

        Append(parent, element);
      });
    else Append(parent, elements);
  }

  return parent;
}
