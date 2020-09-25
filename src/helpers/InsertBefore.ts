export default function InsertBefore(
  newNode: Element | HTMLElement,
  referenceNode: Element | HTMLElement,
) {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode);

  return newNode;
}
