import clsx from "clsx";
import CreateElement from "@components/CreateElement";

type HorizontalSeparatorTypeType = "normal" | "spaced" | "short-spaced";

type HorizontalSeparatorPropsType = {
  type?: HorizontalSeparatorTypeType;
  white?: boolean;
  grayDark?: boolean;
  className?: string;
};

const SG = "sg-horizontal-separator";
const SGD = `${SG}--`;

export default ({
  type = "normal",
  white,
  grayDark,
  className,
  ...props
}: HorizontalSeparatorPropsType = {}) => {
  const separatorClass = clsx(
    SG,
    {
      [SGD + type]: type !== "normal",
      [`${SGD}white`]: white,
      [`${SGD}gray-dark`]: grayDark,
    },
    className,
  );

  return CreateElement({
    tag: "div",
    className: separatorClass,
    ...props,
  });
};
