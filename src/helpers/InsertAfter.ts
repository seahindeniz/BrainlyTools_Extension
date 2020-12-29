export default function InsertAfter(
  newNode: Element | DocumentFragment,
  referenceNode: Element,
) {
  referenceNode?.parentNode?.insertBefore(newNode, referenceNode?.nextSibling);

  return newNode;
}
