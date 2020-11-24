export default function InsertAfter(newNode: Element, referenceNode: Element) {
  referenceNode?.parentNode?.insertBefore(newNode, referenceNode?.nextSibling);

  return newNode;
}
