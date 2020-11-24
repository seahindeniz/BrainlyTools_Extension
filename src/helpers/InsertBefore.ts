export default function InsertBefore(newNode: Element, referenceNode: Element) {
  referenceNode?.parentNode?.insertBefore(newNode, referenceNode);

  return newNode;
}
