import { ButtonRound } from "@style-guide";
import classnames from "classnames";
import Icon from "./Icon";
import Input from "./Input";

const SG = "sg-search";

/**
 * @param {{
 *  className?: string,
 *  fullWidth?: boolean,
 *  withRoundButton?: boolean,
 *  inputClassName?: string,
 * } & import("./Input").Properties} param0
 */
export default ({
  className,
  fullWidth,
  size,
  withRoundButton = false,
  inputClassName,
  ...props
} = {}) => {
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
    const button = ButtonRound({
      icon: "search",
      color: "black",
      filled: true,
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
