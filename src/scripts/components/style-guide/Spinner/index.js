import classnames from 'classnames';

/**
 * @typedef {"xxsmall" | "xsmall" | "small"} Size
 * @typedef {{light?: boolean, size?: Size, className?: string, overlay?: boolean}} Properties
 */
const SG = "sg-spinner";
const SGD = `${SG}--`

/**
 * @param {Properties} param0
 */
export default function({ light, size, className, overlay, ...props } = {}) {
  const spinnerClassNames = classnames('sg-spinner', {
    [`${SGD}light`]: light,
    [SGD + size]: size
  }, className);

  let spinner = document.createElement("div");
  spinner.className = spinnerClassNames;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      spinner.setAttribute(propName, propVal)

  if (overlay) {
    let overlay = document.createElement("div");
    overlay.className = `${SG}-container__overlay`;

    overlay.appendChild(spinner);

    return overlay;
  }
  return spinner;
}
