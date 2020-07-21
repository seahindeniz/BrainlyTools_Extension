// @flow strict

export default (element: HTMLElement) => {
  if (!element || !element.parentNode) return;

  element.parentNode.removeChild(element);
};
