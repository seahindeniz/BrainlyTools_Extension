import classnames from 'classnames';
import SetProps from '@style-guide/helpers/SetProps';

/**
 * @typedef {'small'
 * | 'xsmall'
 * | 'xxsmall'
 * | "large"
 * | "xlarge"
 * | "xxlarge"
 * | "xxxlarge"
 * } SpinnerSizeType
 *
 * @typedef {{
 *  light?: boolean,
 *  size?: SpinnerSizeType,
 *  className?: string,
 *  overlay?: boolean,
 *  opaque?: boolean,
 *  [x: string]: *,
 * }} SpinnerProperties
 */
const SG = "sg-spinner";
const SGD = `${SG}--`

/**
 * @param {SpinnerProperties} param0
 */
export default function({
  light,
  size,
  className,
  overlay,
  opaque,
  ...props
} = {}) {
  const spinnerClassNames = classnames('sg-spinner', {
    [`${SGD}light`]: light,
    [SGD + size]: size
  }, className);

  let spinner = document.createElement("div");
  spinner.className = spinnerClassNames;

  SetProps(spinner, props);

  if (overlay) {
    const spinnerOverlayClassNames = classnames(`${SG}-container__overlay`, {
      [`${SGD}opaque`]: opaque,
    }, className);

    let overlay = document.createElement("div");
    overlay.className = spinnerOverlayClassNames;

    overlay.appendChild(spinner);

    return overlay;
  }

  return spinner;
}
