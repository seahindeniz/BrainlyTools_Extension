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
  return CreateElement({
    tag: "div",
    className: `${SGL}image ${SGL}image--icon`,
    children: new Icon({
      className: `${SGL}__icon`,
      type: "profile",
      color: "gray-light",
      size: ICON_SIZE[size],
    }),
  });
}

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

  const container = CreateElement({
    tag: "div",
    className: avatarClass,
    size,
    border,
    ...props,
  });

  let avatar: HTMLImageElement | HTMLDivElement;

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

  let linkElement: HTMLAnchorElement;

  if (link !== undefined && link !== "") {
    linkElement = CreateElement({
      tag: "a",
      href: link,
      target,
      title,
      children: avatar,
    });

    container.append(linkElement);
  } //
  else container.append(avatar);

  return container;
};
