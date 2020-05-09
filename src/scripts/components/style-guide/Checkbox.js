import classnames from "classnames";
import generateRandomString from "../../helpers/generateRandomString";
import Icon from "./Icon";
import SetProps from "./helpers/SetProps";

/**
 * @typedef {"small" | "normal" | "large"} Size
 *
 * @typedef {{
 *  checked?: boolean,
 *  id?: string,
 *  className?: string,
 * }} Properties
 *
 * @typedef {function(string):CheckboxElement} ChangeId
 *
 * @typedef {{
 *  inputId: string,
 *  ChangeId: ChangeId
 * }} CustomProperties
 * @typedef {HTMLDivElement & CustomProperties} CheckboxElement
 */

const SG = "sg-checkbox";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function ({
  checked,
  id = generateRandomString(),
  className,
  ...props
} = {}) {
  const checkboxClass = classnames(SG, className);

  /**
   * @type {CheckboxElement}
   */
  // @ts-ignore
  const container = document.createElement("div");
  container.className = checkboxClass;

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  input.className = `${SG_}element`;

  if (id) input.id = id;

  SetProps(input, props);

  container.append(input);

  const label = document.createElement("label");
  label.className = `${SG_}ghost`;

  if (id) label.htmlFor = id;

  container.append(label);

  const icon = new Icon({
    type: "check",
    color: "adaptive",
    size: 16,
  });

  label.append(icon.element);

  container.inputId = id;
  // @ts-ignore
  container.ChangeId = _ChangeId;

  return container;
}
/**
 *
 * @this {CheckboxElement}
 * @param {string} id
 */
function _ChangeId(id) {
  const input = this.querySelector("input");
  const label = this.querySelector("label");
  this.inputId = label.htmlFor = input.id = id;

  return this;
}
