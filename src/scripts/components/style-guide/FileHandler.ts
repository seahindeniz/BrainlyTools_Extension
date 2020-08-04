import Build from "@/scripts/helpers/Build";
import { Spinner, Icon, Text } from "@style-guide";
import type { ChildrenParamType } from "@style-guide/helpers/AddChildren";
import type { IconTypeType } from "@style-guide/Icon";
import classNames from "classnames";
import CreateElement from "../CreateElement";

type FileHandlerColorType = "gray" | "mono";

type PropsType = {
  color?: FileHandlerColorType;
  iconType?: IconTypeType;
  thumbnailSrc?: string;
  src?: string;
  loading?: boolean;
  onClose?: (event: MouseEvent) => any;
  onClick?: () => any;
  textRef?: { current: HTMLSpanElement | null };
  className?: string;
  children: ChildrenParamType;
};

const COLORS_MAP = {
  gray: "gray-secondary-light",
  mono: "white",
};

export default function FileHandler({
  children,
  color = "gray",
  iconType = "attachment",
  thumbnailSrc,
  src,
  loading = false,
  onClose,
  onClick,
  className,
  ...props
}: PropsType) {
  const fileHandlerClass = classNames(
    "sg-file-handler",
    {
      "sg-file-handler--closable": onClose,
      [`sg-file-handler--${COLORS_MAP[color]}`]: color,
    },
    className,
  );

  const clickProps =
    thumbnailSrc !== undefined && onClick
      ? { onClick }
      : {
          href: src,
          target: "_blank",
          rel: "noopener noreferrer",
        };

  let thumbnail;

  if (thumbnailSrc !== undefined)
    thumbnail = CreateElement({
      ...clickProps,
      tag: "img",
      src: thumbnailSrc,
      alt: "",
      className: "cursor-pointer",
    });
  else
    thumbnail = CreateElement({
      ...clickProps,
      tag: "a",
      children: new Icon({
        type: iconType,
        size: 24,
        color: "dark",
      }),
    });

  return Build(
    CreateElement({
      ...props,
      tag: "div",
      className: fileHandlerClass,
    }),
    [
      [
        CreateElement({
          tag: "div",
          className: "sg-file-handler__icon",
        }),
        loading ? Spinner({ size: "small" }) : thumbnail,
      ],
      [
        CreateElement({
          tag: "span",
          className: "sg-file-handler__text",
        }),
        src !== undefined
          ? Text({
              ...clickProps,
              size: "small",
              children,
            })
          : Text({
              size: "small",
              weight: "bold",
              children,
            }),
      ],
      onClose && [
        CreateElement({
          tag: "button",
          className: "sg-file-handler__close-button",
          onClick: onClose,
          children: new Icon({
            size: 16,
            color: "dark",
            type: "close",
          }),
        }),
      ],
    ],
  );
}
