import classnames from "classnames";
import CreateElement from "../../CreateElement";
import { ChildrenParamType } from "../helpers/AddChildren";

type TitleAlignmentType = "left" | "center" | "right";

type TitleSizeType =
  | boolean
  | "xxsmall"
  | "xsmall"
  | "small"
  | "normal"
  | "large"
  | "xlarge"
  | "xxlarge";

type TitlePropsType = {
  children?: ChildrenParamType;
  full?: boolean;
  spaced?: boolean;
  spacedSmall?: boolean;
  spacedTop?: TitleSizeType;
  spacedBottom?: TitleSizeType;
  align?: TitleAlignmentType;
  className?: string;
};

const SG = "sg-content-box__header";
const SGD = `${SG}--`;

export default function ({
  children,
  spaced,
  spacedSmall,
  spacedTop,
  spacedBottom,
  className,
  align = "left",
  ...props
}: TitlePropsType = {}) {
  const contentBoxClass = classnames(
    SG,
    {
      [`${SGD}with-centered-elements`]: align === "center",
      [`${SGD}spaced`]: spaced,
      [`${SGD}spaced-small`]: spacedSmall,
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

  return CreateElement({
    tag: "div",
    className: contentBoxClass,
    children,
    ...props,
  });
}
