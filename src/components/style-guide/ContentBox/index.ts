import classnames from "classnames";
import CreateElement from "@components/CreateElement";
import { ChildrenParamType } from "../helpers/AddChildren";

type ContentBoxSizeType =
  | boolean
  | "xxsmall"
  | "xsmall"
  | "small"
  | "normal"
  | "large"
  | "xlarge"
  | "xxlarge";

type ContentBoxPropsType = {
  children?: ChildrenParamType;
  spacedTop?: ContentBoxSizeType;
  spacedBottom?: ContentBoxSizeType;
  spaced?: boolean;
  spacedSmall?: boolean;
  full?: boolean;
  className?: string;
};
const sg = "sg-content-box";
const SGD = `${sg}--`;

export default ({
  children,
  spacedTop,
  spacedBottom,
  spaced,
  spacedSmall,
  full,
  className,
  ...props
}: ContentBoxPropsType = {}) => {
  const contentBoxClass = classnames(
    sg,
    {
      [`${SGD}spaced`]: spaced,
      [`${SGD}spaced-small`]: spacedSmall,
      [`${SGD}full`]: full,
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
