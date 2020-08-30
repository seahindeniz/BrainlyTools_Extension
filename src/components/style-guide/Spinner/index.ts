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

  let spinner = document.createElement("div");
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

    let overlay = document.createElement("div");
    overlay.className = spinnerOverlayClassNames;

    overlay.appendChild(spinner);

    return overlay;
  }

  return spinner;
}
