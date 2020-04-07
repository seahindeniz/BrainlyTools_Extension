import classnames from 'classnames';
import AddChildren from '@style-guide/helpers/AddChildren';
import SetProps from '@style-guide/helpers/SetProps';

/**
 * @typedef {{
 *  tag?: keyof HTMLElementTagNameMap,
 *  children?: import('@style-guide/helpers/AddChildren').ChildrenParamType,
 *  className?: string,
 *  fullWidth?: boolean,
 *  [x: string]: *
 * }} CreateElementPropertiesType
 */
/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {{tag?: T | "div"} & CreateElementPropertiesType} param0
 */
export default function CreateElement({
  tag = "div",
  children,
  className,
  fullWidth,
  ...props
}) {
  /**
   * @type {HTMLElementTagNameMap[T]}
   */
  let element = (document.createElement(tag));
  let classNames = classnames(className, {
    "sg--full": fullWidth,
  });

  if (classNames)
    element.className = classNames;

  AddChildren(element, children);
  SetProps(element, props);

  return element;
}
