import classnames from 'classnames';
import AddChildren from '../helpers/AddChildren';
import Text from '../Text';
import mergeDeep from "merge-deep";

/**
 * @typedef {import("../Text").TextProperties} TextPropsType
 * @typedef {boolean
 * | "xxsmall"
 * | "xsmall"
 * | "small"
 * | "normal"
 * | "large"
 * | "xlarge"
 * | "xxlarge"
 * } Size
 *
 * @typedef {"left" | "center" | "right"} Alignment
 *
 * @typedef {{
 *  children?: TextPropsType | import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  spaced?: boolean,
 *  spacedSmall?: boolean,
 *  spacedTop?: Size,
 *  spacedBottom?: Size,
 *  full?: boolean,
 *  className?: string,
 *  align?: Alignment,
 * }} Properties
 *
 * @typedef {HTMLDivElement} Element
 */
const SG = "sg-content-box__title";
const SGD = `${SG}--`

/**
 * @param {Properties} param0
 * @returns {Element}
 */
export default function({
  children,
  spaced,
  spacedSmall,
  spacedTop,
  spacedBottom,
  className,
  align = "left",
  ...props
} = {}) {
  const contentBoxClass = classnames(SG, {
    [`${SGD}with-centered-elements`]: align === "center",
    [`${SGD}spaced`]: spaced,
    [`${SGD}spaced-small`]: spacedSmall,
    [`${SGD}spaced-top`]: spacedTop === "normal" || spacedTop === true,
    [`${SGD}spaced-top-${spacedTop || ''}`]: spacedTop &&
      !(spacedTop === "normal" || spacedTop === true),
    [`${SGD}spaced-bottom`]: spacedBottom === "normal" ||
      spacedBottom === true,
    [`${SGD}spaced-bottom-${spacedBottom || ''}`]: spacedBottom &&
      !(spacedBottom === "normal" || spacedBottom === true)
  }, className);

  let div = document.createElement("div");
  div.className = contentBoxClass;

  if (children) {
    let childrenElement;

    if (
      children instanceof HTMLElement ||
      children instanceof Array ||
      children instanceof Node
    )
      childrenElement = children;
    else {
      /**
       * @type {TextPropsType}
       */
      let textProps = {
        tag: "td",
        color: "gray",
        weight: "extra-bold",
        size: "large",
      };

      if (typeof children == "string")
        textProps.html = children;
      else
        textProps = mergeDeep(textProps, children);

      childrenElement = Text(textProps);
    }

    AddChildren(div, childrenElement);
  }

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      div[propName] = propVal;

  return div;
}
