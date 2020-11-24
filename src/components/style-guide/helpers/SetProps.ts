type DragEventHandler = (event: DragEvent) => void;
type EventHandler = (event: Event) => void;
type KeyboardEventHandler = (event: KeyboardEvent) => void;
type MouseEventHandler = (event: MouseEvent) => void;
type PasteEventHandler = (event: ClipboardEvent) => void;

export type CommonComponentPropsType = {
  dataset?: DOMStringMap;
  onChange?: EventHandler | EventHandler[];
  onClick?: MouseEventHandler | MouseEventHandler[];
  onDrop?: DragEventHandler | DragEventHandler[];
  onInput?: EventHandler | EventHandler[];
  onKeyDown?: KeyboardEventHandler | KeyboardEventHandler[];
  onMouseEnter?: MouseEventHandler | MouseEventHandler[];
  onMouseLeave?: MouseEventHandler | MouseEventHandler[];
  onPaste?: PasteEventHandler | PasteEventHandler[];
  onTouchStart?: TouchEvent | TouchEvent[];
  onContextMenu?: MouseEventHandler | MouseEventHandler[];
  style?: Partial<CSSStyleDeclaration>;
} & {
  [x: string]: any;
};

const NAMESPACES = {
  svg: "http://www.w3.org/2000/svg",
  html: "http://www.w3.org/1999/xhtml",
  xml: "http://www.w3.org/XML/1998/namespace",
  xlink: "http://www.w3.org/1999/xlink",
  xmlns: "http://www.w3.org/2000/xmlns/", // sic for the final slash...
};

export default function SetProps(
  element: HTMLElement | SVGElement,
  props?: CommonComponentPropsType,
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
    } else if (element instanceof SVGElement) {
      const [prefix, ...unqualifiedName] = propName.split(":");
      let ns = null;

      if (
        prefix === "xmlns" ||
        (unqualifiedName.length && NAMESPACES[prefix])
      ) {
        ns = NAMESPACES[prefix];
      }

      element.setAttributeNS(ns, propName, propVal);
    } else
      try {
        element[propName] = propVal;
      } catch (error) {
        element.setAttribute(propName, propVal);
      }
  });
}
