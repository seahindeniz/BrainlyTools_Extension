import classnames from "classnames";
import CreateElement from "@components/CreateElement";

type SizeType = "short" | "normal" | "tall" | "xtall";

type DirectionType = boolean | "vertical" | "horizontal" | "both";

type TextareaColorType = "default" | "white";

type TextareaPropsType<T> = {
  tag?: T;
  placeholder?: string;
  value?: string | number;
  color?: TextareaColorType;
  size?: SizeType;
  valid?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  simple?: boolean;
  noPadding?: boolean;
  autoHeight?: boolean;
  resizable?: DirectionType;
  className?: string;
  contentEditable?: boolean;
  [x: string]: any;
};

const SG = "sg-textarea";
const SGD = `${SG}--`;

// TODO add generic type for default tag name
export default function Textarea<T extends keyof HTMLElementTagNameMap>({
  valid,
  invalid,
  size = "normal",
  color = "default",
  fullWidth,
  simple,
  noPadding,
  autoHeight,
  value = "",
  className,
  tag,
  resizable,
  placeholder,
  contentEditable,
  ...props
}: TextareaPropsType<T> = {}): HTMLElementTagNameMap[T] {
  if (valid === true && invalid === true)
    throw Error("Textarea can be either valid or invalid!");

  const textareaClass = classnames(
    SG,
    {
      [SGD + size]: size !== "normal",
      [SGD + color]: color !== "default",
      [`${SGD}valid`]: valid,
      [`${SGD}invalid`]: invalid,
      [`${SGD}full-width`]: fullWidth,
      [`${SGD}simple`]: simple,
      [`${SGD}no-padding`]: noPadding,
      [`${SGD}auto-height`]: autoHeight,

      [`${SGD}resizable`]: resizable === true,
      [`${SGD}resizable-${resizable}`]: resizable && resizable !== true,
    },
    className,
  );

  const textarea = CreateElement({
    tag: tag || "textarea",
    className: textareaClass,
    placeholder,
    contentEditable,
    value,
    ...props,
  });

  // @ts-expect-error
  return textarea;
}
