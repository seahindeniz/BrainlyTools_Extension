import classnames from 'classnames';
import Spinner from ".";
import AddChildren from '../helpers/AddChildren';
import SetProps from '@style-guide/helpers/SetProps';

/**
 * @typedef {{
 *  loading?: boolean,
 *  light?: boolean,
 *  fullWidth?: boolean,
 *  size?: import("./index").SpinnerSizeType,
 *  children?: import("@style-guide/helpers/AddChildren").ChildrenParamType,
 *  className?: string,
 *  [x: string]: *,
 * }} SpinnerContainerProperties
 */
const SG = "sg-spinner-container";
const SG_ = `${SG}__`

/**
 * @param {SpinnerContainerProperties} param0
 */
export default ({
  loading,
  light,
  fullWidth,
  size,
  children,
  className,
  ...props
} = {}) => {

  let spinnerContainerClass = classnames(SG, {
    [`${SG}--full-width`]: fullWidth,
  }, className);

  let container = document.createElement("div");
  container.className = spinnerContainerClass;

  AddChildren(container, children);
  SetProps(container, props);

  if (loading) {
    let overlay = document.createElement("div");
    overlay.className = `${SG_}overlay`;

    container.appendChild(overlay);

    let spinner = Spinner({
      light,
      size
    });

    overlay.appendChild(spinner);
  }

  return container;
}
