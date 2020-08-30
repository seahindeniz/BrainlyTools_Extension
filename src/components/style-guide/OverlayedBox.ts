import classnames from "classnames";
import CreateElement from "@components/CreateElement";
import { ChildrenParamType } from "./helpers/AddChildren";

type OverlayedBoxPropsType = {
  children?: ChildrenParamType;
  overlay?: HTMLElement;
  className?: string;
};

const SG = "sg-overlayed-box";
const SGL = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default ({
  children,
  overlay,
  className,
  ...props
}: OverlayedBoxPropsType = {}) => {
  const boxClass = classnames(SG, className);

  const overlayElement = CreateElement({
    tag: "div",
    className: `${SGL}overlay`,
    children: overlay,
  });

  return CreateElement({
    tag: "div",
    className: boxClass,
    children: [children, overlayElement],
    ...props,
  });
};
