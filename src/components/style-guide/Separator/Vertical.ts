import SetProps from "@style-guide/helpers/SetProps";
import classnames from "classnames";

type VerticalSeparatorSizeType = "normal" | "small" | "large" | "full";
type VerticalSeparatorPropsType = {
  size?: VerticalSeparatorSizeType;
  white?: boolean;
  grayDark?: boolean;
  className?: string;
  [x: string]: any;
};

const SG = "sg-vertical-separator";
const SGD = `${SG}--`;

export default ({
  size = "normal",
  white,
  grayDark,
  className,
  ...props
}: VerticalSeparatorPropsType = {}) => {
  const separatorClass = classnames(
    SG,
    {
      [SGD + size]: size !== "normal",
      [`${SGD}white`]: white,
      [`${SGD}gray-dark`]: grayDark,
    },
    className,
  );

  const separator = document.createElement("div");

  separator.className = separatorClass;

  SetProps(separator, props);

  return separator;
};
