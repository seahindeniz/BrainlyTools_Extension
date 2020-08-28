import { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import classNames from "classnames";
import CreateElement from "./CreateElement";

type PaddingSizeType = "s" | "m" | "l";

type PropsType = {
  className?: string;
  adaptive?: boolean;
  short?: boolean;
  inlineItems?: boolean;
  elements?: ChildrenParamType[];
  reverse?: boolean;
  padding?: PaddingSizeType;
};

export default class Breadcrumb {
  element: HTMLUListElement;

  constructor({
    className,
    short,
    adaptive,
    elements = [],
    reverse,
    padding,
    ...props
  }: PropsType = {}) {
    const breadcrumbClass = classNames(
      "ext-breadcrumb-list",
      {
        "ext-breadcrumb-list--short": short,
        "ext-breadcrumb-list--adaptive": adaptive,
        "ext-breadcrumb-list--reverse": reverse,
        [`ext-breadcrumb-list--padding-${padding}`]: padding,
      },
      className,
    );

    this.element = CreateElement({
      ...props,
      tag: "ul",
      className: breadcrumbClass,
    });

    this.RenderChildren(...elements);
  }

  RenderChildren(...elements: readonly ChildrenParamType[]) {
    if (!elements?.length) return;

    const childrens = elements.map(element =>
      CreateElement({
        tag: "li",
        className: "ext-breadcrumb-list__element",
        children: element,
      }),
    );

    this.element.append(...childrens);
  }
}
