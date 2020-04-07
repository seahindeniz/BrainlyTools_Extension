/**
 * @param {HTMLElement} element
 * @param {{[x: string]: *}} props
 */
export default function SetProps(element, props) {
  if (!element || !props)
    return;

  for (let [propName, propVal] of Object.entries(props)) {
    if (propVal !== undefined) {
      if (typeof propVal == "object")
        SetProps(element[propName], propVal);
      else
        element[propName] = propVal;
    }
  }
}
