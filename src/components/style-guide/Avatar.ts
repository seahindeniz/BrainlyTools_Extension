import classnames from "classnames";
import isValidPath from "is-valid-path";
import { isUri } from "valid-url";
import CreateElement from "@components/CreateElement";
import Icon, { IconSizeType } from "./Icon";

type Size = "xs" | "s" | "m" | "l" | "xl" | "xxl";

type AvatarPropsType = {
  size?: Size;
  border?: boolean;
  spaced?: boolean;
  imgSrc?: string;
  link?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  title?: string;
  className?: string;
  [x: string]: any;
};

type CustomPropertiesType = {
  size: Size;
  border: boolean;
};

type AvatarElement = CustomPropertiesType & (HTMLDivElement | HTMLImageElement);

const SG = "sg-avatar";
const SGD = `${SG}--`;
const SGL = `${SG}__`;

const ICON_SIZE: {
  [x in Size]: IconSizeType;
} = {
  xs: 24,
  s: 32,
  m: 40,
  l: 56,
  xl: 80,
  xxl: 104,
};

function GenerateAvatarElement(size: Size) {
  const avatar = document.createElement("div");
  avatar.className = `${SGL}image ${SGL}image--icon`;
  const icon = new Icon({
    type: "profile",
    color: "gray-light",
    size: ICON_SIZE[size],
  });

  avatar.append(icon.element);

  return avatar;
}

/**
 * @this {AvatarElement}
 */
function ReplaceIcon() {
  const oldAvatarImage = this.querySelector(`.${SGL}image`);

  if (oldAvatarImage) oldAvatarImage.remove();

  const avatar = GenerateAvatarElement(this.size);

  if (!this.firstElementChild) this.append(avatar);
  else this.firstElementChild.append(avatar);
}

export default ({
  size = "s",
  border = false,
  spaced,
  imgSrc,
  link,
  target,
  title,
  className,
  ...props
}: AvatarPropsType = {}) => {
  const avatarClass = classnames(
    SG,
    {
      [SGD + size]: size !== "s",
      [`${SGD}with-border`]: border,
      [`${SGD}spaced`]: spaced,
    },
    className,
  );

  // @ts-expect-error
  const container: AvatarElement = CreateElement({
    tag: "div",
    className: avatarClass,
    size,
    border,
    ...props,
  });

  let avatar: HTMLImageElement | HTMLDivElement;
  let linkElement;

  if (link !== undefined && link !== "") {
    linkElement = document.createElement("a");
    linkElement.href = link;

    if (target) linkElement.target = target;

    if (title) linkElement.title = title;

    container.append(linkElement);
  }

  if (
    imgSrc !== undefined &&
    imgSrc !== null &&
    imgSrc !== "" &&
    (isUri(imgSrc) || isValidPath(imgSrc))
  ) {
    avatar = CreateElement({
      tag: "img",
      className: `${SGL}image`,
      src: imgSrc,
      title,
      alt: title,
      onError: ReplaceIcon.bind(container),
    });
  } else {
    avatar = GenerateAvatarElement(size);
  }

  if (linkElement) linkElement.append(avatar);
  else container.append(avatar);

  return container;
};
