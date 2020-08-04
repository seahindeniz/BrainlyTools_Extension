// @flow

import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import classnames from "classnames";
import CreateElement from "../CreateElement";

type FlexAlignmentValuesType =
  | "center"
  | "flex-start"
  | "flex-end"
  | "baseline"
  | "stretch";

type FlexJustifyValuesType =
  | "center"
  | "flex-start"
  | "flex-end"
  | "baseline"
  | "space-between"
  | "space-around"
  | "space-evenly"
  | "stretch";

type FlexDirectionType =
  | ""
  | "column"
  | "column-reverse"
  | "row"
  | "row-reverse";

type FlexMarginsType =
  | ""
  | "xxs"
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  | "xxl"
  | "xxxl"
  | "xxxxl";

type MarginType = {
  margin?: FlexMarginsType;
  marginTop?: FlexMarginsType;
  marginBottom?: FlexMarginsType;
  marginLeft?: FlexMarginsType;
  marginRight?: FlexMarginsType;
};

export type FlexPropsType = {
  // ...MarginType,
  fullWidth?: boolean;
  fullHeight?: boolean;
  noShrink?: boolean;
  inlineFlex?: boolean;
  alignItems?: FlexAlignmentValuesType;
  alignContent?: FlexAlignmentValuesType;
  justifyContent?: FlexJustifyValuesType;
  wrap?: boolean;
  wrapReverse?: boolean;
  alignSelf?: FlexAlignmentValuesType;
  direction?: FlexDirectionType;
  children?: ChildrenParamType;
  className?: string;
  grow?: boolean;
  fitContent?: boolean;
  minContent?: boolean;
  [x: string]: any;
} & MarginType;

type FlexGenericPropsType<T> = FlexPropsType & {
  tag?: T;
};

/* export type FlexPropsType<T> =
  | ({
      tag?: null;
    } & FlexAllPropsType<"div">)
  | ({
      tag: string;
    } & FlexAllPropsType<T>); */

type CustomFlexPropsType = {
  // eslint-disable-next-line no-use-before-define
  ChangeMargin: typeof ChangeMargin;
};
export type FlexElementType = CustomFlexPropsType & HTMLElement;

function ChangeMargin(
  this: FlexElementType,
  props: MarginType,
): FlexElementType {
  Object.entries(props).forEach(([name, value]) => {
    let cornerName = name.replace(/margin/, "").toLowerCase();

    if (cornerName) cornerName += "-";

    const regexp = new RegExp(
      `sg-flex--margin-${cornerName}[a-z]{1,}(?: |$)`,
      "g",
    );
    this.className = this.className.replace(regexp, "");

    if (value)
      this.classList.add(`sg-flex--margin-${cornerName}${String(value)}`);
  });

  return this;
}

// TODO Change this to class
const Flex = <T extends keyof HTMLElementTagNameMap>({
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
  tag,
  grow,
  fitContent,
  minContent,
  ...props
}: FlexGenericPropsType<T> = {}): FlexElementType => {
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

  /* // eslint-disable-next-line no-param-reassign
  if (!tag) throw Error("Tag name isn't specified"); */

  props.ChangeMargin = ChangeMargin;

  // @ts-expect-error
  return CreateElement({
    ...props,
    tag: tag || "div",
    className: flexClass,
    children,
  });
};

export default Flex;
