import Build from "@/scripts/helpers/Build";
import { Flex, Icon, Text } from "@style-guide";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import type { IconTypeType } from "@style-guide/Icon";
import classNames from "classnames";
import CreateElement from "../CreateElement";

type CounterSizeType = "xs" | "xxs";

type CounterPropsType = {
  children?: ChildrenParamType;
  icon?: IconTypeType;
  size?: CounterSizeType;
  withAnimation?: boolean;
  className?: string;
};

export default ({
  icon,
  children,
  className,
  size,
  withAnimation,
  ...props
}: CounterPropsType) => {
  const counterClass = classNames(
    "sg-counter",
    {
      [`sg-counter--${String(size)}`]: size,
      "sg-counter--with-animation": withAnimation,
      "sg-counter--with-icon": icon,
    },
    className,
  );

  const container = CreateElement({
    ...props,
    tag: "div",
    className: counterClass,
  });

  if (!icon) {
    container.append(
      Text({
        children,
        weight: "bold",
        color: "white",
        className:
          size === "xxs" ? "sg-counter__text" : "sg-counter__text-spaced",
        size:
          size !== undefined && size !== null && size === "xxs"
            ? "xsmall"
            : "small",
      }),
    );
  } else {
    const child = Build(document.createDocumentFragment(), [
      [
        Flex({
          className: classNames("sg-counter__icon-container", {
            "sg-counter__icon-container--xxs": size === "xxs",
          }),
        }),
        new Icon({
          type: icon,
          size: size === "xxs" ? 16 : 24,
          color: "dark",
          className: "sg-counter__icon",
        }),
      ],
      [
        Flex({ alignItems: "center" }),
        Text({
          children,
          tag: "span",
          weight: "bold",
          className: "sg-counter__text",
          size:
            size !== undefined && size !== null && size === "xxs"
              ? "xsmall"
              : "small",
        }),
      ],
    ]);

    container.append(child);
  }

  return container;
};
