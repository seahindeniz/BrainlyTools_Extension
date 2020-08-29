import classnames from "classnames";
import Spinner, { SpinnerSizeType } from ".";
import CreateElement from "../../CreateElement";
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
const SG_ = `${SG}__`;

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
  const spinnerContainerClass = classnames(
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
    let overlay = document.createElement("div");
    overlay.className = `${SG_}overlay`;

    container.appendChild(overlay);

    let spinner = Spinner({
      light,
      size,
    });

    overlay.appendChild(spinner);
  }

  return container;
};
