import classnames from 'classnames';

/**
 * @typedef {"normal" | "spaced" | "short-spaced"} Type
 * @typedef {{ type?: Type, white?: boolean, grayDark?: boolean, className?: string}} Properties
 */
const SG = "sg-horizontal-separator";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default function({ type = "normal", white, grayDark, className, ...props } = {}) {
  const separatorClass = classnames(SG, {
    [SGD + type]: type !== "normal",
    [`${SGD}white`]: white,
    [`${SGD}gray-dark`]: grayDark
  }, className);

  let separator = document.createElement("div");
  separator.className = separatorClass;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      separator[propName] = propVal;

  return separator;
}
