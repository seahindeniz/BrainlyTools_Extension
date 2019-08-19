import classnames from 'classnames';

/**
 * @typedef {"normal"  | "small"  | "large"  | "full"} Size
 * @typedef {{ size?: Size, white?: boolean, grayDark?: boolean, className?: string}} Properties
 */
const SG = "sg-vertical-separator";
const SGD = `${SG}--`;

/**
 * @param {Properties} param0
 */
export default function({ size = "normal", white, grayDark, className, ...props } = {}) {
  const separatorClass = classnames(SG, {
    [SGD + size]: size !== "normal",
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
