import classnames from 'classnames';

/**
 * @typedef {"normal" | "tall" | "xtall"} Size
 *
 * @typedef {{
 * value?: string | number,
 * text?: string,
 * title?: string,
 * } & Object<string, *>} OptionProperties
 *
 * @typedef {{
 * value?: string | number | string[] | number[],
 * valid?: boolean,
 * invalid?: boolean,
 * capitalized?: boolean,
 * fullWidth?: boolean,
 * multiple?: boolean,
 * size?: Size,
 * className?: string,
 * options?: OptionProperties[],
 * }} Properties
 */
const SG = "sg-select";
const SGD = `${SG}--`
const SG_ = `${SG}__`

/**
 * @param {Properties} param0
 */
export default function({
  value,
  valid,
  invalid,
  capitalized,
  fullWidth,
  multiple,
  size = "normal",
  className,
  options = [],
  ...props
} = {}) {
  if (valid === true && invalid === true)
    throw "Select can be either valid or invalid!";

  const selectClass = classnames(SG, {
    [`${SGD}valid`]: valid,
    [`${SGD}invalid`]: invalid,
    [`${SGD}capitalized`]: capitalized,
    [`${SGD}full-width`]: fullWidth,
    [`${SGD}multiple`]: multiple,
    [SGD + size]: multiple === true && size !== "normal",
  }, className);

  let container = document.createElement("div");
  container.className = selectClass;

  if (!multiple) {
    let icon = document.createElement("div");
    icon.className = `${SG_}icon`;

    container.appendChild(icon);
  }

  let select = document.createElement("select");
  select.className = `${SG_}element`;

  RenderOptions(select, options, value);

  container.appendChild(select);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      select[propName] = propVal;

  return container;
}

/**
 * @param {HTMLSelectElement} select
 * @param {OptionProperties[]} options
 * @param {string | number | string[] | number[]} [values]
 */
function RenderOptions(select, options, values) {
  options.forEach(({ value, text, title, ...props }) => {
    let optionElement = document.createElement("option");

    if (title)
      optionElement.title = title;

    if (text)
      optionElement.innerHTML = text;

    if (value)
      optionElement.value = String(value);

    if (values)
      if (values instanceof Array)
        // @ts-ignore
        optionElement.selected = values.includes(value);
      else
        optionElement.selected = values === value;

    if (props)
      for (let [propName, propVal] of Object.entries(props))
        optionElement[propName] = propVal;

    select.appendChild(optionElement);
  });
}
