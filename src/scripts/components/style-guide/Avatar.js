import classnames from 'classnames';
import Icon from './Icon';

/**
 * @typedef {import("./Icon").Properties} IconProperties
 *
 * @typedef {"small" | "normal" | "large" | "xlarge" | "xxlarge"} Size
 * @typedef {{
 * size?: Size,
 * border?: boolean,
 * spaced?: boolean,
 * imgSrc?: string,
 * link?: string,
 * title?: string,
 * className?: string,
 * }} Properties
 *
 * @typedef {function(HTMLElement | IconProperties): Element} ChangeIcon
 *
 * @typedef {{size: Size, ChangeIcon: ChangeIcon}} CustomProperties
 *
 * @typedef {HTMLDivElement & CustomProperties} Element
 */

const SG = "sg-avatar";
const SGD = `${SG}--`;
const SG_ = `${SG}__`;

/**
 * @type {{
 * "small": 22;
 * "normal": 30;
 * "large": 54;
 * "xlarge": 78;
 * "xxlarge": 102;
 * }}
 */
const ICON_SIZE_FOR_AVATARS_WITH_BORDER = {
  "small": 22,
  "normal": 30,
  "large": 54,
  "xlarge": 78,
  "xxlarge": 102,
};

/**
 * @type {{
 * "small": 24;
 * "normal": 32;
 * "large": 56;
 * "xlarge": 80;
 * "xxlarge": 104;
 * }}
 */
const ICON_SIZE = {
  "small": 24,
  "normal": 32,
  "large": 56,
  "xlarge": 80,
  "xxlarge": 104,
};

/**
 * @param {Properties} param0
 * @returns {HTMLDivElement | HTMLImageElement}
 */
export default function({
  size = "normal",
  border = false,
  spaced,
  imgSrc,
  link,
  title,
  className,
  ...props
} = {}) {
  const avatarClass = classnames(
    SG, {
      [SGD + size]: size !== "normal",
      [`${SGD}with-border`]: border,
      [`${SGD}spaced`]: spaced,
    },
    className
  );

  let container = document.createElement("div");
  container.className = avatarClass;

  if (props)
    for (let [propName, propVal] of Object.entries(props))
      container[propName] = propVal;

  let avatar;

  if (imgSrc !== undefined && imgSrc !== null && imgSrc !== '') {
    avatar = document.createElement("img");
    avatar.className = `${SG_}image`;
    avatar.src = imgSrc;

    if (title) {
      avatar.title = title;
      avatar.alt = title;
    }
  } else {
    avatar = document.createElement("div");
    avatar.className = `${SG_}image ${SG_}image--icon`;
    let icon = Icon({
      type: "std-profile",
      color: "gray-light",
      size: border ? ICON_SIZE_FOR_AVATARS_WITH_BORDER[size] : ICON_SIZE[size]
    });

    avatar.append(icon);
  }

  if (link !== undefined && link !== '') {
    let linkElement = document.createElement("a");
    linkElement.href = link;

    if (title)
      linkElement.title = title;

    linkElement.append(avatar);
    container.append(linkElement);
  } else
    container.append(avatar);

  return container;
}
