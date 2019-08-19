/**
 * @param {HTMLElement} element
 */
export default function IsVisible(element){
  return !!( element.offsetWidth || element.offsetHeight || element.getClientRects().length );
}
