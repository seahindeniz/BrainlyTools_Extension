import classNames from "classnames";
import CreateElement from "@components/CreateElement";

type OverlayPropsType = {
  partial?: boolean;
  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType;
  className?: string;
};

const SG = "sg-overlay";
const SGD = `${SG}--`;

export default ({
  partial,
  children,
  className,
  ...props
}: OverlayPropsType = {}) => {
  const overlayClass = classNames(
    SG,
    {
      [`${SGD}partial`]: partial,
    },
    className,
  );

  return CreateElement({
    tag: "div",
    className: overlayClass,
    children,
    ...props,
  });
};
