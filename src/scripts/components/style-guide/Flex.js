import classnames from 'classnames';
import AddChildren from "@style-guide/helpers/AddChildren"

/**
 * @typedef {'center'
 * | 'flex-start'
 * | 'flex-end'
 * | 'baseline'
 * | 'stretch'
 * } FlexAlignmentValuesType
 *
 * @typedef {'center'
 * | 'flex-start'
 * | 'flex-end'
 * | 'baseline'
 * | 'space-between'
 * | 'space-around'
 * | 'space-evenly'
 * | 'stretch'
 * } FlexJustifyValuesType
 *
 * @typedef {'column'
 * | 'column-reverse'
 * | 'row'
 * | 'row-reverse'
 * } FlexDirectionType
 *
 * @typedef {''
 * | 'xxs'
 * | 'xs'
 * | 's'
 * | 'm'
 * | 'l'
 * | 'xl'
 * | 'xxl'
 * | 'xxxl'
 * | 'xxxxl'
 * } FlexMarginsType
 *
 * @typedef {{
 *  fullWidth?: boolean,
 *  fullHeight?: boolean,
 *  noShrink?: boolean,
 *  inlineFlex?: boolean,
 *  alignItems?: FlexAlignmentValuesType,
 *  alignContent?: FlexAlignmentValuesType,
 *  justifyContent?: FlexJustifyValuesType,
 *  wrap?: boolean,
 *  wrapReverse?: boolean,
 *  alignSelf?: FlexAlignmentValuesType,
 *  direction?: FlexDirectionType,
 *  margin?: FlexMarginsType,
 *  marginTop?: FlexMarginsType,
 *  marginBottom?: FlexMarginsType,
 *  marginLeft?: FlexMarginsType,
 *  marginRight?: FlexMarginsType,
 *  children?: import('./helpers/AddChildren').ChildrenParamType,
 *  tag?: string,
 *  [x: string]: *
 * }} Properties
 */

/**
 * @param {Properties} param0
 */
export default ({
  fullWidth,
  fullHeight,
  noShrink,
  inlineFlex,
  alignItems,
  alignContent,
  justifyContent,
  wrap,
  wrapReverse,
  alignSelf,
  direction,
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  children,
  className,
  tag = "div",
  ...props
} = {}) => {
  const flexClass = classnames(
    'sg-flex', {
      'sg-flex--full-width': fullWidth,
      'sg-flex--full-height': fullHeight,
      'sg-flex--no-shrink': noShrink,
      'sg-flex--inline': inlineFlex,
      [`sg-flex--align-items-${alignItems || ''}`]: alignItems,
      [`sg-flex--align-content-${alignContent || ''}`]: alignContent,
      [`sg-flex--align-self-${alignSelf || ''}`]: alignSelf,
      [`sg-flex--justify-content-${justifyContent || ''}`]: justifyContent,
      'sg-flex--wrap': wrap,
      'sg-flex--wrap-reverse': wrapReverse,
      'sg-flex--column': direction === "column",
      'sg-flex--column-reverse': direction === "column-reverse",
      'sg-flex--row': direction === "row",
      'sg-flex--row-reverse': direction === "row-reverse",
      [`sg-flex--margin-${margin || ''}`]: margin,
      [`sg-flex--margin-top-${marginTop || ''}`]: marginTop,
      [`sg-flex--margin-right-${marginRight || ''}`]: marginRight,
      [`sg-flex--margin-bottom-${marginBottom || ''}`]: marginBottom,
      [`sg-flex--margin-left-${marginLeft || ''}`]: marginLeft,
    },
    className
  );

  let element = document.createElement(tag);
  element.className = flexClass;

  AddChildren(element, children);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      element[propName] = propVal;

  return element;
}
