import classnames from 'classnames';
import AddChildren from '../helpers/AddChildren';

/**
 * @typedef {"xsmall" | "small"} Spacing
 * @typedef {{
 * children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 * asContainer?: boolean,
 * spacing?: Spacing,
 * noSpacing?: boolean,
 * spaceBellow?: boolean,
 * spacedLarge?: boolean,
 * noShrink?: boolean,
 * grow?: boolean,
 * toEnd?: boolean,
 * toRight?: boolean,
 * stretch?: boolean,
 * equalWidth?: boolean,
 * hideOverflow?: boolean,
 * className?: string,
 * }} Properties
 */

const sg = "sg-actions-list__hole";
const SGD = `${sg}--`;

/**
 * @param {Properties} param0
 */
export default function({
  children,
  asContainer,
  spacing,
  noSpacing,
  spaceBellow,
  spacedLarge,
  noShrink,
  grow,
  toEnd,
  toRight,
  stretch,
  equalWidth,
  hideOverflow,
  className,
  ...props
} = {}) {
  const actionListHoleClass = classnames('sg-actions-list__hole', {
    [`${SGD}container`]: asContainer,
    [`${SGD}no-spacing`]: noSpacing,
    [`${SGD}space-bellow`]: spaceBellow,
    [`${SGD}spaced-${String(spacing)}`]: spacing,
    [`${SGD}spaced-large`]: spacedLarge,
    [`${SGD}no-shrink`]: noShrink,
    [`${SGD}grow`]: grow,
    [`${SGD}to-end`]: toEnd,
    [`${SGD}to-right`]: toRight,
    [`${SGD}stretch`]: stretch,
    [`${SGD}equal-width`]: equalWidth,
    [`${SGD}hide-overflow`]: hideOverflow
  }, className);

  let div = document.createElement("div");
  div.className = actionListHoleClass;

  AddChildren(div, children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      div[propName] = propVal;

  return div;
}
