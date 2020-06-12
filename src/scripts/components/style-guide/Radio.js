import classnames from "classnames";
import generateRandomString from "../../helpers/generateRandomString";
import Label from "./Label";
import SetProps from "./helpers/SetProps";

/**
 * @typedef {'xxs' | 's'} Size
 * @typedef {{
 * checked?: boolean,
 * name?: string,
 * size?: Size,
 * className?: string,
 * id?: string,
 * label?: import("./Label").Properties,
 * }} Properties
 */

const SG = "sg-radio";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default ({
  checked,
  name,
  size = "xxs",
  className,
  id = generateRandomString(),
  label,
  ...props
} = {}) => {
  const radioClass = classnames(
    SG,
    {
      [SGD + size]: size,
    },
    className,
  );

  const radioContainer = document.createElement("div");
  let container = radioContainer;
  radioContainer.className = radioClass;

  const input = document.createElement("input");
  input.className = `${SG}__element`;
  input.id = id;
  input.type = "radio";
  input.checked = checked;

  if (name) input.name = name;

  const labelElement = document.createElement("label");
  labelElement.className = `${SG}__ghost`;
  labelElement.htmlFor = id;

  radioContainer.appendChild(input);
  radioContainer.appendChild(labelElement);

  if (label) {
    const labelContainer = Label({
      ...label,
      icon: radioContainer,
      htmlFor: id,
    });
    container = labelContainer;
  }

  SetProps(radioContainer, props);

  return container;
};
