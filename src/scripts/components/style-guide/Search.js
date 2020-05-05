import Input from "./Input";
import Icon from "./Icon";

const SG = "sg-search";

/**
 * @param {{adaptiveIco?: boolean} & import("./Input").Properties} param0
 */
export default function ({ adaptiveIco, ...props } = {}) {
  const input = Input({
    type: "search",
    className: `${SG}__input`,
    withIcon: true,
    ...props,
  });
  const icon = new Icon({
    type: "search",
    size: 18,
    color: adaptiveIco ? "adaptive" : "gray-secondary",
  });
  const container = document.createElement("div");
  const iconContainer = document.createElement("div");

  container.className = SG;
  iconContainer.className = `${SG}__icon`;

  container.appendChild(input);
  iconContainer.appendChild(icon.element);
  container.appendChild(iconContainer);

  return container;
}
