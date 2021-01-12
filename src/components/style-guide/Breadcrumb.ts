import { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import clsx from "clsx";
import CreateElement from "@components/CreateElement";

type PropsType = {
  className?: string;
  adaptive?: boolean;
  short?: boolean;
  inlineItems?: boolean;
  elements?: ChildrenParamType[];
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
  }: PropsType = {}) {
    const breadcrumbClass = clsx(
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

    const childrens = elements
      .map(
        element =>
          element &&
          CreateElement({
            tag: "li",
            className: "sg-breadcrumb-list__element",
            children: element,
          }),
      )
      .filter(Boolean);

    this.element.append(...childrens);
  }
}
