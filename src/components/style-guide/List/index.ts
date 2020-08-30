import classnames from "classnames";
import SetProps from "@style-guide/helpers/SetProps";
import AddChildren from "../helpers/AddChildren";
import CreateElement from "@components/CreateElement";

type ListPropsType = {
  spaced?: boolean;
  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType;
  className?: string;
  [x: string]: any;
};

const SG = "sg-list";
const SGD = `${SG}--`;

export default ({
  spaced,
  className,
  children,
  ...props
}: ListPropsType = {}) => {
  const listClass = classnames(
    SG,
    {
      [`${SGD}spaced-elements`]: spaced,
    },
    className,
  );

  return CreateElement({
    tag: "ul",
    className: listClass,
    children,
    ...props,
  });
};
