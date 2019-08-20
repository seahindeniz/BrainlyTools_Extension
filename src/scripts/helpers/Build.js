/**
 * @typedef {HTMLElement | Text | string | number} AcceptableNodes
 * @typedef {AcceptableNodes | AcceptableNodes[] | AcceptableNodes[][]} Markup
 *
 * @param {HTMLElement} parent
 * @param {Markup} elements
 */
function transformArray(parent, elements) {
  if (elements) {
    if (
      elements instanceof HTMLElement ||
      elements instanceof Text ||
      typeof elements == "string" ||
      typeof elements == "number"
    )
      Append(parent, elements);
    else {
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
 * @param {HTMLElement} parent
 * @param {AcceptableNodes} child
 */
function Append(parent, child) {
  if (typeof child == "number")
    child = String(child);

  parent.append(child);
}

/**
 * @param {HTMLElement} parent
 * @param {*} elements
 */
export default function Build(parent, elements) {
  if (!(parent instanceof HTMLElement))
    throw "Parent element must be an HTMLElement";

  transformArray(parent, elements);

  return parent
}
