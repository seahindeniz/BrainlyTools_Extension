import classnames from 'classnames';
import AddChildren from '../helpers/AddChildren';

/**
 * @typedef {{
 *  spaced?: boolean,
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  className?: string,
 * }} Properties
 */

const SG = "sg-list";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({
  spaced,
  className,
  children,
  ...props
} = {}) {
  const listClass = classnames(SG, {
      [`${SGD}spaced-elements`]: spaced,
    },
    className
  );

  let list = document.createElement("ul");
  list.className = listClass;

  AddChildren(list, children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      list[propName] = propVal;

  return list;
}
