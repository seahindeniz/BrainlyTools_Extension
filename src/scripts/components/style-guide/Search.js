// @flow
import { Button } from "@style-guide";
import classnames from "classnames";
import Icon from "./Icon";
import Input from "./Input";
import type { InputPropertiesType } from "./Input";

const SG = "sg-search";

type PropsType = {
  inputClassName?: string,
  withRoundButton?: boolean,
  ...
} & InputPropertiesType;

export default ({
  className,
  fullWidth,
  size,
  withRoundButton = false,
  inputClassName,
  ...props
}: PropsType = {}) => {
  const searchClassName = classnames(
    SG,
    {
      [`${SG}--${String(size)}`]: size,
      [`${SG}--full-width`]: fullWidth,
    },
    className,
  );

  const container = document.createElement("div");
  container.className = searchClassName;

  const input = Input({
    type: "search",
    className: className(`${SG}__input`, inputClassName),
    withIcon: true,
    size,
    ...props,
  });

  container.appendChild(input);

  let iconContainer;

  if (withRoundButton) {
    iconContainer = document.createElement("div");
    const button = new Button({
      type: "solid",
      icon: new Icon({
        type: "search",
        size: size === "l" ? 24 : 16,
        color: "adaptive",
      }),
      iconOnly: true,
      size: size === "l" ? "medium" : "small",
    });

    iconContainer.append(button);
  } else {
    iconContainer = document.createElement("button");
    const icon = new Icon({
      type: "search",
      size: size === "l" ? 24 : 18,
      color: "gray-secondary",
    });

    iconContainer.appendChild(icon.element);
  }

  iconContainer.className = `${SG}__icon`;

  container.appendChild(iconContainer);

  return container;
};
