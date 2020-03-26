/**
 * @param {Element | HTMLElement} newNode
 * @param {Element | HTMLElement} referenceNode
 */
export default function InsertBefore(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode);

  return newNode;
}
