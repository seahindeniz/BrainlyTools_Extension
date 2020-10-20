import { CommonComponentPropsType } from "@style-guide/helpers/SetProps";
import clsx from "clsx";
import CreateElement from "./CreateElement";

type BlurredOverlayDensityType = "low" | "high";

type BlurredOverlayPropsType = {
  className?: string;
  children?: BlurredOverlayDensityType;
} & CommonComponentPropsType;

export default function BlurredOverlay({
  className,
  density,
  ...props
}: BlurredOverlayPropsType = {}) {
  const blurredOverlayClassNames = clsx(
    "ext-blurred-overlay",
    {
      [`ext-blurred-overlay--density-${density}`]: density,
    },
    className,
  );

  return CreateElement({
    tag: "div",
    className: blurredOverlayClassNames,
    ...props,
  });
}
