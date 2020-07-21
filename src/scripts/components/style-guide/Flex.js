import classnames from "classnames";
import AddChildren from "@style-guide/helpers/AddChildren";
import SetProps from "./helpers/SetProps";

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
 * @typedef {''
 * | 'column'
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
 * @typedef {"div"} DefaultTagNamesType
 *
 * @typedef {{
 *  margin?: FlexMarginsType,
 *  marginTop?: FlexMarginsType,
 *  marginBottom?: FlexMarginsType,
 *  marginLeft?: FlexMarginsType,
 *  marginRight?: FlexMarginsType,
 * }} MarginType
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
 *  children?: import('./helpers/AddChildren').ChildrenParamType,
 *  className?: string,
 *  tag?: DefaultTagNamesType | keyof HTMLElementTagNameMap,
 *  grow?: boolean,
 *  fitContent?: boolean,
 *  minContent?: boolean,
 *  [x: string]: *
 * } & MarginType} FlexPropsType
 *
 * @typedef {function(MarginType): FlexElementType} ChangeMarginType
 *
 * @typedef {{
 *  ChangeMargin?: ChangeMarginType,
 * }} CustomFlexPropsType
 *
 * @typedef {CustomFlexPropsType & HTMLElement} FlexElementType
 */

/**
 * @this {FlexElementType}
 * @param {MarginType} props
 */
// eslint-disable-next-line no-underscore-dangle
function _ChangeMargin(props) {
  Object.entries(props).forEach(([name, value]) => {
    let cornerName = name.replace(/margin/, "").toLowerCase();

    if (cornerName) cornerName += "-";

    const regexp = new RegExp(
      `sg-flex--margin-${cornerName}[a-z]{1,}(?: |$)`,
      "g",
    );
    this.className = this.className.replace(regexp, "");

    if (value) this.classList.add(`sg-flex--margin-${cornerName}${value}`);
  });

  return this;
}

/**
 * @template {keyof HTMLElementTagNameMap} T
 * @param {{tag?: DefaultTagNamesType | T} & FlexPropsType} param0
 */
export default function ({
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
  grow,
  fitContent,
  minContent,
  ...props
} = {}) {
  const flexClass = classnames(
    "sg-flex",
    {
      "sg-flex--full-width": fullWidth,
      "sg-flex--full-height": fullHeight,
      "sg-flex--no-shrink": noShrink,
      "sg-flex--inline": inlineFlex,
      [`sg-flex--align-items-${alignItems || ""}`]: alignItems,
      [`sg-flex--align-content-${alignContent || ""}`]: alignContent,
      [`sg-flex--align-self-${alignSelf || ""}`]: alignSelf,
      [`sg-flex--justify-content-${justifyContent || ""}`]: justifyContent,
      "sg-flex--wrap": wrap,
      "sg-flex--wrap-reverse": wrapReverse,
      "sg-flex--column": direction === "column",
      "sg-flex--column-reverse": direction === "column-reverse",
      "sg-flex--row": direction === "row",
      "sg-flex--row-reverse": direction === "row-reverse",
      [`sg-flex--margin-${margin || ""}`]: margin,
      [`sg-flex--margin-top-${marginTop || ""}`]: marginTop,
      [`sg-flex--margin-right-${marginRight || ""}`]: marginRight,
      [`sg-flex--margin-bottom-${marginBottom || ""}`]: marginBottom,
      [`sg-flex--margin-left-${marginLeft || ""}`]: marginLeft,
      "sg-flex--grow": grow,
      "sg-flex--fit-content": fitContent,
      "sg-flex--min-content": minContent,
    },
    className,
  );

  /**
   * @type {CustomFlexPropsType & HTMLElementTagNameMap[T]}
   */
  const element = document.createElement(tag);
  element.className = flexClass;
  props.ChangeMargin = _ChangeMargin;

  AddChildren(element, children);
  SetProps(element, props);

  return element;
}
