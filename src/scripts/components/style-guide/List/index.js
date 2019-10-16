import classnames from 'classnames';

/**
 * @typedef {{
 *  spaced?: boolean,
 *  children?: HTMLElement | HTMLElement[],
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

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      if (propVal)
        list[propName] = propVal;

  if (children instanceof Array)
    list.append(...children);
  else if (children)
    list.append(children);

  return list;
}
