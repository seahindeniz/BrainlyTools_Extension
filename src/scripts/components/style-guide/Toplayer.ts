import classnames from "classnames";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import CreateElement from "../CreateElement";
import Icon from "./Icon";
import { CommonComponentPropsType } from "./helpers/SetProps";

const SG = "sg-toplayer";
const SGD = `${SG}--`;
const SGL = `${SG}__`;

type ToplayerSizeType = "small" | "medium" | "large" | "90prc" | "fit-content";

export type ToplayerPropsType = {
  children?: ChildrenParamType;
  onClose?: (event: MouseEvent) => void;
  size?: ToplayerSizeType;
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
  [x: string]: any;
} & CommonComponentPropsType;

export default class Toplayer {
  closeIconContainer: HTMLDivElement;
  wrapper: HTMLDivElement;
  element: HTMLDivElement;

  constructor({
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
  }: ToplayerPropsType) {
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
        [SGD + String(size)]: size,
      },
      className,
    );

    const toplayerWrapperClassName = classnames(`${SGL}wrapper`, {
      [`${SGL}wrapper--no-padding`]: noPadding,
    });

    this.wrapper = CreateElement({
      tag: "div",
      children,
      className: toplayerWrapperClassName,
    });

    if (onClose)
      this.closeIconContainer = CreateElement({
        tag: "div",
        className: `${SGL}close`,
        onClick: onClose,
        children: new Icon({
          size: 24,
          type: "close",
          color: "gray-secondary",
        }),
      });

    this.element = CreateElement({
      ...props,
      tag: "div",
      children: [this.closeIconContainer, this.wrapper],
      className: topLayerClassName,
    });
  }
}
