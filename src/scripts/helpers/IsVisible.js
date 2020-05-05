// @flow
export default function IsVisible(
  element: HTMLElement | Element,
  deepParentalCheck?: boolean,
) {
  if (!element || !element.parentElement) return false;

  if (deepParentalCheck)
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      (element instanceof HTMLElement && element.offsetParent)
    );

  return true;
  /* return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  ); */
}
