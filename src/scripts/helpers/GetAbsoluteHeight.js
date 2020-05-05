/**
 * @param {HTMLElement | keyof HTMLElementTagNameMap} _element
 */
export default function GetAbsoluteHeight(_element) {
  if (!_element) return 0;

  let element = _element;

  if (typeof element === "string") element = document.querySelector(element);

  const styles = window.getComputedStyle(element);
  // const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  const margin =
    Number(styles.marginTop.slice(0, -2)) +
    Number(styles.marginBottom.slice(0, -2));

  return element.offsetHeight + margin;
}
