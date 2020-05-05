import classnames from "classnames";
import AddChildren from "./helpers/AddChildren";
import Icon from "./Icon";
import SetProps from "./helpers/SetProps";

/**
 * @typedef {"small" | "medium" | "large" | "90prc" | "fit-content"} Size
 *
 * @typedef {{
 *  wrapper: HTMLDivElement,
 * }} CustomProperties
 *
 * @typedef {HTMLDivElement & CustomProperties} ToplayerElement
 *
 * @typedef {{
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  onClose?: EventListenerOrEventListenerObject,
 *  size?: Size,
 *  lead?: boolean,
 *  fill?: boolean,
 *  modal?: boolean,
 *  withBugbox?: boolean,
 *  smallSpaced?: boolean,
 *  splashScreen?: boolean,
 *  limitedWidth?: boolean,
 *  row?: boolean,
 *  noPadding?: boolean,
 *  transparent?: boolean,
 *  className?: string,
 * }} Properties
 */
const SG = "sg-toplayer";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function ({
  children,
  onClose,
  size,
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
}) {
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
    },
    className,
  );

  const toplayerWrapperClassName = classnames(`${SG_}wrapper`, {
    [`${SG_}wrapper--no-padding`]: noPadding,
  });

  /**
   * @type {ToplayerElement}
   */
  // @ts-ignore
  const toplayer = document.createElement("div");
  toplayer.className = topLayerClassName;

  const wrapper = document.createElement("div");
  wrapper.className = toplayerWrapperClassName;
  toplayer.wrapper = wrapper;

  SetProps(toplayer, props);

  AddChildren(wrapper, children);

  if (onClose) {
    const close = document.createElement("div");
    close.className = `${SG_}close`;
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
