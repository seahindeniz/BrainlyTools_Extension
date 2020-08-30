import classnames from "classnames";
import CreateElement from "@components/CreateElement";
import { ChildrenParamType } from "../helpers/AddChildren";

type ContentAlignmentType = "left" | "center" | "right";

type ContentSizeType =
  | boolean
  | "xxsmall"
  | "xsmall"
  | "small"
  | "normal"
  | "large"
  | "xlarge"
  | "xxlarge";

export type ContentPropsType = {
  children?: ChildrenParamType;
  full?: boolean;
  spacedTop?: ContentSizeType;
  spacedBottom?: ContentSizeType;
  align?: ContentAlignmentType;
  className?: string;
};

const SG = "sg-content-box__content";
const SGD = `${SG}--`;

export default ({
  children,
  full,
  spacedTop,
  spacedBottom,
  className,
  align = "left",
  ...props
}: ContentPropsType = {}) => {
  const contentBoxClass = classnames(
    SG,
    {
      [`${SGD}full`]: full,
      [`${SGD}with-centered-text`]: align === "center",
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
};
