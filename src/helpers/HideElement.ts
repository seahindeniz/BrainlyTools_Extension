export default (...elements: (HTMLElement | JQuery)[]) => {
  if (!elements?.length) return;

  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      element?.parentElement?.removeChild(element);
    } else {
      element?.detach();
    }
  });
};
