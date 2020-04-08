/**
 * @param {HTMLElement | keyof HTMLElementTagNameMap} element
 */
export default function GetAbsoluteHeight(element) {
  if (!element)
    return 0;

  if (typeof element === "string")
    element = document.querySelector(element);

  var styles = window.getComputedStyle(element);
  var margin = parseFloat(styles['marginTop']) +
    parseFloat(styles['marginBottom']);

  return Math.ceil(element.offsetHeight + margin);
}
