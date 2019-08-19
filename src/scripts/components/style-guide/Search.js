import Input from "../Input";
import Icon from "./Icon";

const sg = "sg-search";
const SG_ = `${sg}__`;

/**
 * @param {{adaptiveIco?: boolean} & import("../Input").Properties} param0
 */
export default function({ adaptiveIco, ...props } = {}) {
  let input = Input({
    type: "search",
    className: `${SG_}input`,
    withIcon: true,
    ...props
  });
  let icon = Icon({
    type: "std-search",
    size: 18,
    color: adaptiveIco ? "adaptive" : "gray-secondary"
  });
  let container = document.createElement("div");
  let iconContainer = document.createElement("div");

  container.className = sg;
  iconContainer.className = `${SG_}icon`;

  container.appendChild(input);
  iconContainer.appendChild(icon);
  container.appendChild(iconContainer);

  return container;
}
