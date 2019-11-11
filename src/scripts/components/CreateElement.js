import classnames from 'classnames';

/**
 * @typedef {{
 *  tag: string,
 *  className?: string,
 *  fullWidth?: boolean,
 *  [x: string]: *
 * }} Properties
 */
/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {{tag?: T} & Properties} param0
 */
export default function CreateElement({
  tag,
  children,
  className,
  fullWidth,
  ...props
}) {
  if (!tag)
    // @ts-ignore
    tag = "div";

  let element = document.createElement(tag);

  let classNames = classnames(className, {
    "sg--full": fullWidth,
  });

  if (classNames)
    element.className = classNames;

  if (children instanceof Array && children.length > 0)
    element.append(...children);
  else if (children instanceof HTMLElement)
    element.append(children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      element[propName] = propVal;

  return element;
}
