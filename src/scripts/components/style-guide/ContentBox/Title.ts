import classnames from "classnames";
import CreateElement from "../../CreateElement";
import { ChildrenParamType } from "../helpers/AddChildren";
import Text from "../Text";
import type { TextPropsType } from "../Text";

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

export type TitlePropsType = {
  children?: ChildrenParamType | TextPropsType<"td">;
  full?: boolean;
  spaced?: boolean;
  spacedSmall?: boolean;
  spacedTop?: TitleSizeType;
  spacedBottom?: TitleSizeType;
  align?: TitleAlignmentType;
  className?: string;
};

const SG = "sg-content-box__title";
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

  const div = document.createElement("div");
  div.className = contentBoxClass;

  if (typeof children === "string") {
    const textProps: TextPropsType<"div"> = {
      tag: "div",
      color: "gray",
      weight: "extra-bold",
      size: "large",
      children,
    };

    /* if (typeof children === "string") textProps.html = children;
    else if (typeof children === "object")
      textProps = {
        ...textProps,
        ...children,
      }; */

    // eslint-disable-next-line no-param-reassign
    children = Text(textProps);
  }

  return CreateElement({
    tag: "div",
    className: contentBoxClass,
    children,
    ...props,
  });
}
