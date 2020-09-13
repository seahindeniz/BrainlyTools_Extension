import classnames from "classnames";
import SetProps from "@style-guide/helpers/SetProps";

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
  [x: string]: any;
};
const SG = "sg-spinner";
const SGD = `${SG}--`;

export default function ({
  light,
  size,
  className,
  overlay,
  opaque,
  ...props
}: SpinnerPropsType = {}) {
  const spinnerClassNames = classnames(
    "sg-spinner",
    {
      [`${SGD}light`]: light,
      [SGD + size]: size,
    },
    className,
  );

  const spinner = document.createElement("div");
  spinner.className = spinnerClassNames;

  SetProps(spinner, props);

  if (overlay) {
    const spinnerOverlayClassNames = classnames(
      `${SG}-container__overlay`,
      {
        [`${SGD}opaque`]: opaque,
      },
      className,
    );

    const overlayElement = document.createElement("div");
    overlayElement.className = spinnerOverlayClassNames;

    overlayElement.appendChild(spinner);

    return overlayElement;
  }

  return spinner;
}
