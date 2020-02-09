/**
 * @template T,Z
 * @param {T} parent
 * @param {Z} elements
 */
export default function Build(parent, elements) {
  if (parent instanceof Function)
    parent = parent();

  if (!(parent instanceof HTMLElement))
    throw "Parent element must be an HTMLElement";

  if (elements) {
    if (elements instanceof Array)
      elements.forEach(element => {
        if (element instanceof Array)
          element = Build(element[0], element[1]);

        Append(parent, element);
      });
    else
      Append(parent, elements);
  }

  return parent;
}

/**
 * @template T,Z
 * @param {T} parent
 * @param {Z | string | HTMLElement | function} child
 */
function Append(parent, child) {
  if (typeof parent == "function")
    parent = parent();

  if (child instanceof Function)
    child = child();

  if (typeof child == "number")
    child = String(child);

  if (
    parent instanceof HTMLElement &&
    (
      child instanceof HTMLElement ||
      typeof child === "string"
    )
  )
    parent.append(child);
}
