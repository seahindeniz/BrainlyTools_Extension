import CreateElement from "@components/CreateElement";
import clsx from "clsx";
import isValidPath from "is-valid-path";
import { isUri } from "valid-url";
import type { CommonComponentPropsType } from "./helpers/SetProps";
import Icon, { IconSizeType } from "./Icon";

type Size = "xs" | "s" | "m" | "l" | "xl" | "xxl";

type anchorTargetType = "_blank" | "_self" | "_parent" | "_top";

type AvatarPropsType = {
  size?: Size;
  border?: boolean;
  spaced?: boolean;
  imgSrc?: string;
  link?: string;
  target?: anchorTargetType;
  title?: string;
  className?: string;
} & CommonComponentPropsType;

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

export default class Avatar {
  element: HTMLDivElement;
  private anchor: HTMLAnchorElement;
  private avatar: HTMLImageElement | HTMLDivElement;
  private size: Size;

  constructor({
    size = "s",
    border = false,
    spaced,
    imgSrc,
    link,
    target,
    className,
    ...props
  }: AvatarPropsType = {}) {
    this.size = size;

    const avatarClass = clsx(
      SG,
      {
        [SGD + size]: size !== "s",
        [`${SGD}with-border`]: border,
        [`${SGD}spaced`]: spaced,
      },
      className,
    );

    this.element = CreateElement({
      tag: "div",
      className: avatarClass,
      ...props,
    });

    this.ChangeAvatar({ imgSrc, alt: props.title });
    this.ChangeLink({ link, target });
  }

  ChangeLink({ link, target }: { link: string; target?: anchorTargetType }) {
    this.anchor = CreateElement({
      tag: "a",
      href: link,
      target,
      children: this.avatar,
    });

    this.element.append(this.anchor);
  }

  ChangeAvatar({ imgSrc, alt }: { imgSrc: string; alt?: string }) {
    if (this.avatar instanceof HTMLImageElement && this.avatar.src === imgSrc)
      return;

    if (isUri(imgSrc) || isValidPath(imgSrc)) {
      this.avatar?.remove();

      this.avatar = CreateElement({
        tag: "img",
        className: `${SGL}image`,
        src: imgSrc,
        alt,
        onError: this.FallbackToIcon.bind(this),
      });

      return;
    }

    if (this.avatar instanceof HTMLDivElement) {
      return;
    }

    this.avatar?.remove();

    this.GenerateAvatarElement();
  }

  private FallbackToIcon() {
    this.avatar?.remove();
    this.GenerateAvatarElement();

    if (this.anchor) {
      this.anchor.append(this.avatar);

      return;
    }

    this.element.append(this.avatar);
  }

  private GenerateAvatarElement() {
    this.avatar = CreateElement({
      tag: "div",
      className: `${SGL}image ${SGL}image--icon`,
      children: new Icon({
        className: `${SGL}__icon`,
        type: "profile",
        color: "gray-light",
        size: ICON_SIZE[this.size],
      }),
    });
  }
}
