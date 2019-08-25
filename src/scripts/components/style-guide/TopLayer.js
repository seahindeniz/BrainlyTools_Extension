import classnames from 'classnames';
import Icon from './Icon';

/**
 * @typedef {"small" | "medium" | "large"} Size
 * @typedef {{
 * children?: HTMLElement,
 * onClose?: EventListenerOrEventListenerObject,
 * size?: Size,
 * lead?: boolean,
 * fill?: boolean,
 * modal?: boolean,
 * withBugbox?: boolean,
 * smallSpaced?: boolean,
 * splashScreen?: boolean,
 * limitedWidth?: boolean,
 * row?: boolean,
 * noPadding?: boolean,
 * transparent?: boolean,
 * className?: string,
 * }} Properties
 */
const SG = "sg-toplayer";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({
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
  const topLayerClassName = classnames(SG, {
    [`${SGD}lead`]: lead,
    [`${SGD}fill`]: fill,
    [`${SGD}modal`]: modal,
    [`${SGD}with-bugbox`]: withBugbox,
    [`${SGD}small-spaced`]: smallSpaced,
    [`${SGD}splash-screen`]: splashScreen,
    [`${SGD}limited-width`]: limitedWidth,
    [`${SGD}row`]: row,
    [`${SGD}transparent`]: transparent,
    [SGD + size]: size
  }, className);

  const toplayerWrapperClassName = classnames(`${SG_}wrapper`, {
    [`${SG_}wrapper--no-padding`]: noPadding
  });

  let toplayer = document.createElement("div");
  toplayer.className = topLayerClassName;

  let wrapper = document.createElement("div");
  wrapper.className = toplayerWrapperClassName;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      toplayer[propName] = propVal;

  if (children)
    wrapper.appendChild(children);

  if (onClose) {
    let close = document.createElement("div");
    close.className = `${SG_}close`;
    let icon = Icon({
      type: "std-close",
      color: "gray-secondary",
      size: 24
    });

    close.appendChild(icon);
    toplayer.appendChild(close);
    close.addEventListener("click", onClose);
  }

  toplayer.appendChild(wrapper);

  return toplayer;
}
