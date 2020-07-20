// @flow

import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import classNames from "classnames";
import CreateElement from "../CreateElement";

type PropsType = {
  className?: ?string,
  adaptive?: ?boolean,
  short?: ?boolean,
  inlineItems?: ?boolean,
  elements: $ReadOnlyArray<ChildrenParamType>,
  ...
};

export default ({
  className,
  short,
  adaptive,
  inlineItems,
  elements = [],
  ...props
}: PropsType) => {
  const breadcrumbClass = classNames(
    "sg-breadcrumb-list",
    {
      "sg-breadcrumb-list--short": short,
      "sg-breadcrumb-list--adaptive": adaptive,
      "sg-breadcrumb-list--inline-items": inlineItems,
    },
    className,
  );

  return CreateElement({
    ...props,
    tag: "ul",
    className: breadcrumbClass,
    children: elements.map(element =>
      CreateElement({
        tag: "li",
        className: "sg-breadcrumb-list__element",
        children: element,
      }),
    ),
  });
};
