import classnames from 'classnames';

/**
 * @typedef {{
 * value?: string | number,
 * text?: string,
 * title?: string,
 * } & Object<string, *>} OptionProperties
 * @typedef {{
 * value?: string | number,
 * valid?: boolean,
 * invalid?: boolean,
 * capitalized?: boolean,
 * fullWidth?: boolean,
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
    [`${SGD}full-width`]: fullWidth
  }, className);

  let container = document.createElement("div");
  container.className = selectClass;

  let icon = document.createElement("div");
  icon.className = `${SG_}icon`;

  container.appendChild(icon);

  let select = document.createElement("select");
  select.className = `${SG_}element`;

  if (value)
    select.value = String(value);

  container.appendChild(select);

  RenderOptions(select, options);

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      select[propName] = propVal;

  return container;
}

/**
 * @param {HTMLSelectElement} select
 * @param {OptionProperties[]} options
 */
function RenderOptions(select, options) {
  options.forEach(({ value, text, title, ...props }) => {
    let optionElement = document.createElement("option");

    if (title)
      optionElement.title = title;

    if (text)
      optionElement.innerHTML = text;

    if (value)
      optionElement.value = String(value);

    if (props)
      for (let [propName, propVal] of Object.entries(props))
        optionElement[propName] = propVal;

    select.appendChild(optionElement);
  });
}
