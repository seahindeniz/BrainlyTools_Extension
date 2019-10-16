/**
 * @template T,Z
 * @param {T} parent
 * @param {Z} elements
 */
export default function Build(parent, elements) {
  transformArray(parent, elements);

  return parent
}

/**
 * @template T,Z
 * @param {T} parent
 * @param {Z} elements
 */
function transformArray(parent, elements) {
  if (!(parent instanceof HTMLElement))
    throw "Parent element must be an HTMLElement";

  if (elements) {
    if (
      elements instanceof HTMLElement ||
      elements instanceof Text ||
      typeof elements == "string" ||
      typeof elements == "number"
    )
      Append(parent, elements);
    else if (elements instanceof Array) {
      elements.forEach(element => {
        if (element instanceof Array)
          element = transformArray(element[0], element[1]);

        Append(parent, element);
      })
    }
  }

  return parent;
}

/**
 * @template T,Z
 * @param {T} parent
 * @param {Z | string | HTMLElement} child
 */
function Append(parent, child) {
  if (typeof child == "number")
    child = String(child);

  if (parent instanceof HTMLElement && (child instanceof HTMLElement || typeof child === "string"))
    parent.append(child);
}
