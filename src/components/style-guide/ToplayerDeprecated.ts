import classnames from "classnames";
import AddChildren, { ChildrenParamType } from "./helpers/AddChildren";
import Icon from "./Icon";
import SetProps from "./helpers/SetProps";

type CommonToplayerSizeType = "small" | "medium" | "large";
type ToplayerSizeType = CommonToplayerSizeType | "90prc" | "fit-content";

export type ToplayerElementType = HTMLDivElement & {
  wrapper: HTMLDivElement;
};

export type ToplayerDeprecatedPropsType = {
  children?: ChildrenParamType;
  onClose?: EventListenerOrEventListenerObject;
  size?: ToplayerSizeType;
  maxSize?: CommonToplayerSizeType;
  lead?: boolean;
  fill?: boolean;
  modal?: boolean;
  withBugbox?: boolean;
  smallSpaced?: boolean;
  splashScreen?: boolean;
  limitedWidth?: boolean;
  row?: boolean;
  noPadding?: boolean;
  transparent?: boolean;
  className?: string;
};

const SG = "sg-toplayer";
const SGD = `${SG}--`;
const SGL = `${SG}__`;

export default function ({
  children,
  onClose,
  size,
  maxSize,
  lead,
  fill,
  modal,
  withBugbox,
  smallSpaced,
  splashScreen,
  limitedWidth,
  row,
  noPadding,
  transparent,
  className,
  ...props
}: ToplayerDeprecatedPropsType) {
  const topLayerClassName = classnames(
    SG,
    {
      [`${SGD}lead`]: lead,
      [`${SGD}fill`]: fill,
      [`${SGD}modal`]: modal,
      [`${SGD}with-bugbox`]: withBugbox,
      [`${SGD}small-spaced`]: smallSpaced,
      [`${SGD}splash-screen`]: splashScreen,
      [`${SGD}limited-width`]: limitedWidth,
      [`${SGD}row`]: row,
      [`${SGD}transparent`]: transparent,
      [SGD + size]: size,
      [`${SGD}max-width-${maxSize}`]: maxSize,
    },
    className,
  );

  const toplayerWrapperClassName = classnames(`${SGL}wrapper`, {
    [`${SGL}wrapper--no-padding`]: noPadding,
  });

  // @ts-ignore
  const toplayer: ToplayerElementType = document.createElement("div");

  toplayer.className = topLayerClassName;

  const wrapper = document.createElement("div");

  wrapper.className = toplayerWrapperClassName;
  toplayer.wrapper = wrapper;

  SetProps(toplayer, props);

  AddChildren(wrapper, children);

  if (onClose) {
    const close = document.createElement("div");

    close.className = `${SGL}close`;

    const icon = new Icon({
      type: "close",
      color: "gray-secondary",
      size: 24,
    });

    close.appendChild(icon.element);
    toplayer.appendChild(close);
    close.addEventListener("click", onClose);
  }

  toplayer.appendChild(wrapper);

  return toplayer;
}
