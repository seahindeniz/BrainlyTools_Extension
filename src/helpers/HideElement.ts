export default (element: HTMLElement | JQuery) => {
  if (!element) return;

  if (element instanceof HTMLElement) {
    element?.parentElement?.removeChild(element);
  } else {
    element?.detach();
  }
};
