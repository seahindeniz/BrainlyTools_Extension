import classnames from "classnames";
import CreateElement from "@components/CreateElement";
import { ChildrenParamType } from "../helpers/AddChildren";

type HoleSpaceType = "xsmall" | "small";

type HolePropsType = {
  children?: ChildrenParamType;
  asContainer?: boolean;
  spacing?: HoleSpaceType;
  noSpacing?: boolean;
  spaceBellow?: boolean;
  spacedLarge?: boolean;
  noShrink?: boolean;
  grow?: boolean;
  toEnd?: boolean;
  toRight?: boolean;
  stretch?: boolean;
  equalWidth?: boolean;
  hideOverflow?: boolean;
  className?: string;
};

const sg = "sg-actions-list__hole";
const SGD = `${sg}--`;

export default ({
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
}: HolePropsType = {}) => {
  const actionListHoleClass = classnames(
    "sg-actions-list__hole",
    {
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
      [`${SGD}hide-overflow`]: hideOverflow,
    },
    className,
  );

  return CreateElement({
    tag: "div",
    className: actionListHoleClass,
    children,
    ...props,
  });
};
