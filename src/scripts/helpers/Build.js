/**
 * @typedef {HTMLElement | HTMLElement[] | HTMLElement[][]} Markup
 *
 * @param {HTMLElement} parent
 * @param {Markup} elements
 */
function transformArray(parent, elements) {
  if (elements) {
    if (elements instanceof HTMLElement)
      parent.appendChild(elements);
    else {
      elements.forEach(element => {
        if (element instanceof Array)
          element = transformArray(element[0], element[1]);

        parent.appendChild(element);
      })
    }
  }

  return parent;
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
