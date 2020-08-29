export type CommonComponentPropsType = {
  dataset?: DOMStringMap;
  onChange?: (event: Event) => void;
  onClick?: (event: MouseEvent) => void;
  onInput?: (event: Event) => void;
  style?: Partial<CSSStyleDeclaration>;
};

export default function SetProps(
  element: HTMLElement,
  props?: { [x: string]: any },
) {
  if (!element || !props) return;

  const entries = Object.entries(props);

  if (entries.length === 0) return;

  entries.forEach(([propName, propVal]) => {
    if (propVal === undefined) return;

    if (
      (typeof propVal === "function" ||
        (propVal instanceof Array && typeof propVal[0] === "function")) &&
      propName.startsWith("on") &&
      propName[2] &&
      propName[2] === String(propName[2]).toUpperCase()
    ) {
      if (propVal instanceof Array) {
        propVal.forEach(listener =>
          SetProps(element, {
            [propName]: listener,
          }),
        );

        return;
      }

      if (propVal)
        element.addEventListener(propName.substring(2).toLowerCase(), propVal);
    } else if (typeof propVal === "object") {
      SetProps(element[propName], propVal);
    } else
      try {
        element[propName] = propVal;
      } catch (error) {
        element.setAttribute(propName, propVal);
      }
  });
}
