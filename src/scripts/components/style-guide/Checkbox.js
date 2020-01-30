import classnames from 'classnames';
import generateRandomString from '../../helpers/generateRandomString';
import Icon from './Icon';

/**
 * @typedef {"small" | "normal" | "large"} Size
 *
 * @typedef {{
 *  checked?: boolean,
 *  id?: string,
 *  className?: string,
 * }} Properties
 *
 * @typedef {function(string):Element} ChangeId
 *
 * @typedef {{
 *  inputId: string,
 *  ChangeId: ChangeId
 * }} CustomProperties
 * @typedef {HTMLDivElement & CustomProperties} Element
 */

const SG = "sg-checkbox";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @param {Properties} param0
 */
export default function({
  checked,
  id = generateRandomString(),
  className,
  ...props
} = {}) {
  const checkboxClass = classnames(SG, className);

  /**
   * @type {Element}
   */
  // @ts-ignore
  let container = document.createElement("div");
  container.className = checkboxClass;

  let input = document.createElement("input");
  input.type = "checkbox";
  input.checked = checked;
  input.className = `${SG_}element`;

  if (id)
    input.id = id;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      input[propName] = propVal;

  container.append(input);

  let label = document.createElement("label");
  label.className = `${SG_}ghost`;

  if (id)
    label.htmlFor = id;

  container.append(label);

  let icon = Icon({
    type: "check",
    color: "adaptive",
    size: 16
  });

  label.append(icon);

  container.inputId = id;
  // @ts-ignore
  container.ChangeId = _ChangeId;

  return container;
}
/**
 *
 * @this {Element}
 * @param {string} id
 */
function _ChangeId(id) {
  let input = this.querySelector("input");
  let label = this.querySelector("label");
  this.inputId = label.htmlFor = input.id = id;

  return this;
}
