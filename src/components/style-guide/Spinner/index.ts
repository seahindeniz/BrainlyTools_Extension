import CreateElement from "@components/CreateElement";
import type { CommonComponentPropsType } from "@style-guide/helpers/SetProps";
import clsx from "clsx";

export type SpinnerSizeType =
  | "small"
  | "xsmall"
  | "xxsmall"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "xxxlarge";

export type SpinnerPropsType = {
  light?: boolean;
  size?: SpinnerSizeType;
  className?: string;
  overlay?: boolean;
  opaque?: boolean;
  blur?: boolean;
} & CommonComponentPropsType;

const SG = "sg-spinner";
const SGD = `${SG}--`;

export default function Spinner({
  light,
  size,
  className,
  overlay,
  opaque,
  blur,
  ...props
}: SpinnerPropsType = {}) {
  const spinnerClassNames = clsx(
    "sg-spinner",
    {
      [`${SGD}light`]: light,
      [SGD + size]: size,
      "sg-spinner--blur": blur,
    },
    className,
  );

  const spinner = CreateElement({
    tag: "div",
    className: spinnerClassNames,
    ...props,
  });

  if (overlay) {
    const spinnerOverlayClassNames = clsx(
      `${SG}-container__overlay`,
      {
        [`${SGD}opaque`]: opaque,
      },
      className,
    );

    return CreateElement({
      tag: "div",
      className: spinnerOverlayClassNames,
      children: spinner,
    });
  }

  return spinner;
}
