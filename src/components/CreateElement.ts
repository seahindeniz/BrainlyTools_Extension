import classnames from "classnames";
import AddChildren from "@style-guide/helpers/AddChildren";
import SetProps, {
  CommonComponentPropsType,
} from "@style-guide/helpers/SetProps";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";

type CommonElementPropsType<T> = {
  tag: T;
  children?: ChildrenParamType;
  className?: string;
} & CommonComponentPropsType;

export type CreateElementPropsType<T> = {
  fullWidth?: boolean;
} & CommonElementPropsType<T>;

const svgNS = "http://www.w3.org/2000/svg";

export function CreateSVGElement<T extends keyof SVGElementTagNameMap>({
  tag,
  children,
  className,
  ...props
}: CommonElementPropsType<T>) {
  if (tag === null || tag === undefined) throw Error("Tag name is required");

  const element = document.createElementNS(svgNS, tag);

  if (className) element.classList.value = className;

  AddChildren(element, children);
  SetProps(element, props);

  return element;
}

export default function CreateElement<T extends keyof HTMLElementTagNameMap>({
  tag,
  children,
  className,
  fullWidth,
  ...props
}: CreateElementPropsType<T>) {
  if (tag === null || tag === undefined) throw Error("Tag name is required");

  const classNames = classnames(className, {
    "sg--full": fullWidth,
  });

  const element = document.createElement(tag);

  if (classNames) element.className = classNames;

  AddChildren(element, children);
  SetProps(element, props);

  return element;
}
