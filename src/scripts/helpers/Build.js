// @flow strict
/* eslint-disable no-param-reassign */

function Append<T, Z>(
  parent: T | HTMLElement | DocumentFragment,
  _child: Z | string | HTMLElement | DocumentFragment | Function,
) {
  let child = _child;
  // $FlowFixMe
  if (parent.element) parent = parent.element;

  // $FlowFixMe
  if (typeof parent === "function") parent = parent();

  // $FlowFixMe
  if (child && child.element) child = child.element;

  // $FlowFixMe
  if (child instanceof Function) child = child();

  if (typeof child === "number") child = String(child);

  if (
    (parent instanceof HTMLElement || parent instanceof DocumentFragment) &&
    (child instanceof HTMLElement ||
      child instanceof DocumentFragment ||
      typeof child === "string")
  ) {
    parent.append(child);
  }
}

export default function Build<T, Z>(parent: T, elements: Z) {
  if (parent === null || parent === undefined) throw Error("Undefined parent");

  // $FlowFixMe
  if (parent.element) parent = parent.element;

  // $FlowFixMe
  if (parent instanceof Function) parent = parent();

  if (!(parent instanceof HTMLElement) && !(parent instanceof DocumentFragment))
    throw Error("Parent element must be an append-able element");

  if (elements !== null && elements !== undefined) {
    if (elements instanceof Array)
      elements.forEach(_element => {
        let element = _element;

        if (element instanceof Array) element = Build(element[0], element[1]);

        Append(parent, element);
      });
    else Append(parent, elements);
  }

  return parent;
}
