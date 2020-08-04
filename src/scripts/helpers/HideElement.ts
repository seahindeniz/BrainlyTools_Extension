// @flow strict

export default (element: HTMLElement | JQuery) => {
  if (!element) return;

  if (element instanceof HTMLElement) {
    if (element && element.parentElement) {
      element.parentElement.removeChild(element);
    }
  } else if (element.detach) {
    element.detach();
  }
};
