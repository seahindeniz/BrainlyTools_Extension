export default function IsVisible(
  element: HTMLElement | Element,
  deepParentalCheck?: boolean,
) {
  if (!element?.parentElement) return false;

  if (deepParentalCheck)
    return !!(
      (element as HTMLElement).offsetWidth ||
      (element as HTMLElement).offsetHeight ||
      (element instanceof HTMLElement && element.offsetParent)
    );

  return document.body.contains(element);
  /* return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  ); */
}
