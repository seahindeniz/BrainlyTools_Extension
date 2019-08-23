/**
 * @param {HTMLElement} newNode
 * @param {HTMLElement} referenceNode
 */
export default function InsertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

  return newNode;
}
