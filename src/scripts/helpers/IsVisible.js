/**
 * @param {HTMLElement | Element} element
 */
export default function IsVisible(element) {
  if (!("offsetWidth" in element))
    return;

  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}
