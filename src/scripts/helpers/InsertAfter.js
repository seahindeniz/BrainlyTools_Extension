/**
 * @param {Element | HTMLElement} newNode
 * @param {Element | HTMLElement} referenceNode
 */
export default function InsertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

  return newNode;
}
