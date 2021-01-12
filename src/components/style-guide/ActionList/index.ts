import clsx from "clsx";
import CreateElement from "@components/CreateElement";

export const ALIGNMENT = {
  BASELINE: "align-baseline",
  STRETCH: "stretch",
};

type ActionListDirectionType =
  | "to-right"
  | "centered"
  | "space-between"
  | "space-around"
  | "space-evenly";

type ActionListPropsType = {
  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType;
  toTop?: boolean;
  direction?: ActionListDirectionType;
  align?: keyof typeof ALIGNMENT;
  noWrap?: boolean;
  className?: string;
};

const sg = "sg-actions-list";
const SGD = `${sg}--`;

/**
 * @param {Properties} param0
 */
export default ({
  children,
  toTop,
  direction,
  align,
  noWrap,
  className,
  ...props
}: ActionListPropsType = {}) => {
  const actionListClass = clsx(
    sg,
    {
      [SGD + direction]: direction,
      [SGD + ALIGNMENT[align]]: ALIGNMENT[align],
      [`${SGD}to-top`]: toTop,
      [`${SGD}no-wrap`]: noWrap,
    },
    className,
  );

  return CreateElement({
    tag: "div",
    className: actionListClass,
    children,
    ...props,
  });
};
