import { Button } from "@style-guide";
import classNames from "classnames";
import Icon from "./Icon";
import Input, { InputPropsType } from "./Input";

const SG = "sg-search";

type PropsType = {
  inputClassName?: string;
  withRoundButton?: boolean;
} & InputPropsType;

export default ({
  className,
  fullWidth,
  size,
  withRoundButton = false,
  inputClassName,
  ...props
}: PropsType = {}) => {
  const searchClassName = classNames(
    SG,
    {
      [`${SG}--${String(size)}`]: size,
      [`${SG}--full-width`]: fullWidth,
    },
    className,
  );

  const container = document.createElement("div");
  container.className = searchClassName;

  const input = new Input({
    type: "search",
    className: classNames(`${SG}__input`, inputClassName),
    withIcon: true,
    size,
    ...props,
  });

  container.appendChild(input.element);

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
      size: size === "l" ? "m" : "s",
    });

    iconContainer.append(button);
  } else {
    iconContainer = document.createElement("button");
    const icon = new Icon({
      type: "search",
      size: size === "l" ? 24 : 16,
      color: "gray-secondary",
    });

    iconContainer.appendChild(icon.element);
  }

  iconContainer.className = `${SG}__icon`;

  container.appendChild(iconContainer);

  return container;
};
