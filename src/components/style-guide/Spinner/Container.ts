import clsx from "clsx";
import CreateElement from "@components/CreateElement";
import Spinner, { SpinnerSizeType } from ".";
import { ChildrenParamType } from "../helpers/AddChildren";

type SpinnerContainerPropsType = {
  loading?: boolean;
  light?: boolean;
  fullWidth?: boolean;
  size?: SpinnerSizeType;
  children?: ChildrenParamType;
  className?: string;
  [x: string]: any;
};

const SG = "sg-spinner-container";
const SGL = `${SG}__`;

/**
 * @param {SpinnerContainerProperties} param0
 */
export default ({
  loading,
  light,
  fullWidth,
  size,
  children,
  className,
  ...props
}: SpinnerContainerPropsType = {}) => {
  const spinnerContainerClass = clsx(
    SG,
    {
      [`${SG}--full-width`]: fullWidth,
    },
    className,
  );

  const container = CreateElement({
    tag: "div",
    className: spinnerContainerClass,
    children,
    ...props,
  });

  if (loading) {
    const overlay = document.createElement("div");

    overlay.className = `${SGL}overlay`;

    container.appendChild(overlay);

    const spinner = Spinner({
      light,
      size,
    });

    overlay.appendChild(spinner);
  }

  return container;
};
