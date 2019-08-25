import classnames from 'classnames';
import generateRandomString from '../../helpers/generateRandomString';
import Label from './Label';

/**
 * @typedef {"normal" | "large"} Size
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
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({
  checked,
  name,
  size = "normal",
  className,
  id = generateRandomString(),
  label,
  ...props
} = {}) {
  const radioClass = classnames(SG, {
    [SGD + size]: size !== "normal"
  }, className);

  let radioContainer = document.createElement("div");
  let container = radioContainer;
  radioContainer.className = radioClass;

  let input = document.createElement("input");
  input.className = `${SG_}element`;
  input.id = id;
  input.type = "radio";
  input.checked = checked;

  if (name)
    input.name = name;

  let labelElement = document.createElement("label");
  labelElement.className = `${SG_}ghost`;
  labelElement.htmlFor = id;

  radioContainer.appendChild(input);
  radioContainer.appendChild(labelElement);

  if (label) {
    let labelContainer = Label({
      ...label,
      icon: radioContainer,
      htmlFor: id
    });
    container = labelContainer;
  }

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      radioContainer[propName] = propVal;

  return container;
}
