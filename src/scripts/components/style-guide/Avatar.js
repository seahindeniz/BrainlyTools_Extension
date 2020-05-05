import classnames from "classnames";
import isValidPath from "is-valid-path";
import { isUri } from "valid-url";
import Icon from "./Icon";
import SetProps from "./helpers/SetProps";

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
 * } & Object<string, *>} Properties
 *
 * @typedef {{
 *  size: Size,
 *  border: boolean,
 * }} CustomProperties
 *
 * @typedef {CustomProperties &
 * (HTMLDivElement | HTMLImageElement)
 * } AvatarElement
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
  small: 22,
  normal: 30,
  large: 54,
  xlarge: 78,
  xxlarge: 102,
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
  small: 24,
  normal: 32,
  large: 56,
  xlarge: 80,
  xxlarge: 104,
};

/**
 * @param {Properties} param0
 */
export default function ({
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
    SG,
    {
      [SGD + size]: size !== "normal",
      [`${SGD}with-border`]: border,
      [`${SGD}spaced`]: spaced,
    },
    className,
  );

  /**
   * @type {AvatarElement}
   */
  // @ts-ignore
  const container = document.createElement("div");
  container.className = avatarClass;
  container.size = size;
  container.border = border;

  SetProps(container, props);

  let avatar;
  let linkElement;

  if (link !== undefined && link !== "") {
    linkElement = document.createElement("a");
    linkElement.href = link;

    if (title) linkElement.title = title;

    container.append(linkElement);
  }

  if (
    imgSrc !== undefined &&
    imgSrc !== null &&
    imgSrc !== "" &&
    (isUri(imgSrc) || isValidPath(imgSrc))
  ) {
    avatar = document.createElement("img");
    avatar.className = `${SG_}image`;
    avatar.src = imgSrc;

    avatar.addEventListener("error", ReplaceIcon.bind(container));

    if (title) {
      avatar.title = title;
      avatar.alt = title;
    }
  } else {
    avatar = GenerateAvatarElement(size, border);
  }

  if (linkElement) linkElement.append(avatar);
  else container.append(avatar);

  return container;
}

/**
 * @param {Size} size
 * @param {boolean} border
 */
function GenerateAvatarElement(size, border) {
  const avatar = document.createElement("div");
  avatar.className = `${SG_}image ${SG_}image--icon`;
  const icon = new Icon({
    type: "profile",
    color: "gray-light",
    size: border ? ICON_SIZE_FOR_AVATARS_WITH_BORDER[size] : ICON_SIZE[size],
  });

  avatar.append(icon.element);

  return avatar;
}

/**
 * @this {AvatarElement}
 */
function ReplaceIcon() {
  const oldAvatarImage = this.querySelector(`.${SG_}image`);

  if (oldAvatarImage) oldAvatarImage.remove();

  const avatar = GenerateAvatarElement(this.size, this.border);

  if (!this.firstElementChild) this.append(avatar);
  else this.firstElementChild.append(avatar);
}
