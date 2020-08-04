import classnames from "classnames";
import generateRandomString from "../../helpers/generateRandomString";
import Label from "./Label";
import type { LabelPropsType } from "./Label";
import SetProps from "./helpers/SetProps";

type RadioSizeType = "xxs" | "s";

type RadioPropsType = {
  checked?: boolean;
  name?: string;
  size?: RadioSizeType;
  className?: string;
  id?: string;
  label?: LabelPropsType;
};

const SG = "sg-radio";
const SGD = `${SG}--`;

export default ({
  checked,
  name,
  size = "xxs",
  className,
  id = generateRandomString(),
  label,
  ...props
}: RadioPropsType = {}) => {
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
