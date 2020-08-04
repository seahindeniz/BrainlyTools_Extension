import { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import classNames from "classnames";
import CreateElement from "../CreateElement";

type PropsType = {
  className?: string;
  adaptive?: boolean;
  short?: boolean;
  inlineItems?: boolean;
  elements: ChildrenParamType[];
};

export default class Breadcrumb {
  element: HTMLUListElement;

  constructor({
    className,
    short,
    adaptive,
    inlineItems,
    elements = [],
    ...props
  }: PropsType) {
    const breadcrumbClass = classNames(
      "sg-breadcrumb-list",
      {
        "sg-breadcrumb-list--short": short,
        "sg-breadcrumb-list--adaptive": adaptive,
        "sg-breadcrumb-list--inline-items": inlineItems,
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
        className: "sg-breadcrumb-list__element",
        children: element,
      }),
    );

    this.element.append(...childrens);
  }
}
