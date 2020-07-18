// @flow strict

export default function SetProps(element: HTMLElement, props?: { ... }) {
  if (!element || !props) return;

  const entries: Array<[string, mixed]> = Object.entries(props);

  if (entries.length === 0) return;

  entries.forEach(([propName, propVal]) => {
    if (propVal === undefined) return;

    // $FlowFixMe
    if (typeof propVal === "object") SetProps(element[propName], propVal);
    // $FlowFixMe
    else element[propName] = propVal;
  });
}
