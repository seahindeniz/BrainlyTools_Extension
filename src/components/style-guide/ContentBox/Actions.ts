import clsx from "clsx";
import CreateElement from "@components/CreateElement";

type ActionsSizeType =
  | boolean
  | "xxsmall"
  | "xsmall"
  | "small"
  | "normal"
  | "large"
  | "xlarge"
  | "xxlarge";
type ActionsAlignmentType = "left" | "center" | "right";

export type ActionsPropsType = {
  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType;
  spacedTop?: ActionsSizeType;
  spacedBottom?: ActionsSizeType;
  align?: ActionsAlignmentType;
  className?: string;
  [x: string]: any;
};

const SG = "sg-content-box__actions";
const SGD = `${SG}--`;

export default ({
  children,
  spacedTop,
  spacedBottom,
  className,
  align = "left",
  ...props
}: ActionsPropsType = {}) => {
  const contentBoxClass = clsx(
    SG,
    {
      [`${SGD}with-centered-elements`]: align === "center",
      [`${SGD}with-elements-to-right`]: align === "right",
      [`${SGD}spaced-top`]: spacedTop === "normal" || spacedTop === true,
      [`${SGD}spaced-top-${spacedTop || ""}`]:
        spacedTop && !(spacedTop === "normal" || spacedTop === true),
      [`${SGD}spaced-bottom`]:
        spacedBottom === "normal" || spacedBottom === true,
      [`${SGD}spaced-bottom-${spacedBottom || ""}`]:
        spacedBottom && !(spacedBottom === "normal" || spacedBottom === true),
    },
    className,
  );

  const element = CreateElement({
    tag: "div",
    className: contentBoxClass,
    children,
    ...props,
  });

  return element;
};
