// @flow strict
/* eslint-disable no-param-reassign */

function Append<T, Z>(
  parent: T | HTMLElement | DocumentFragment,
  _child:
    | Z
    | string
    | HTMLElement
    | DocumentFragment
    | Function
    | (() => HTMLElement),
) {
  let child = _child;
  // $FlowFixMe
  if (child && child.element) child = child.element;

  if (/* child instanceof Function  */ typeof child === "function")
    // $FlowFixMe
    child = child();

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

export default function Build<T, Z>(_parent: T, elements: Z): T {
  if (_parent === null || _parent === undefined)
    throw Error("Undefined parent");

  let parent = _parent;

  // $FlowFixMe
  if (
    parent &&
    /* !(parent instanceof HTMLElement) &&
    !(parent instanceof DocumentFragment) && */
    parent.element !== null &&
    parent.element !== undefined
  )
    parent = parent.element;

  if (parent instanceof Function /* typeof parent === "function" */)
    // $FlowFixMe
    parent = parent();

  if (
    !parent ||
    parent.append === null ||
    parent.append === undefined ||
    (!(parent instanceof HTMLElement) && !(parent instanceof DocumentFragment))
  )
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

  if (typeof _parent === "function") return parent;
  return _parent;
}
