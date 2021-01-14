export interface SpaceBetweenPropsType {
  /**
   * ```
   * "md" → Medium screen
   * "lg" → Large screen
   * ```
   */
  responsiveBreakpoint?: "md" | "lg";
  /**
   * `::empty` pseudo selector
   */
  empty?: boolean;
  /**
   * ```
   * "x" → Horizontal
   * "y" → Vertical
   * ```
   */
  axis: "x" | "y";
  size: "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl" | "xxxxl";
}

export default ({
  responsiveBreakpoint,
  empty,
  axis,
  size,
}: SpaceBetweenPropsType) =>
  `${responsiveBreakpoint ? `${responsiveBreakpoint}:` : ""}${
    empty ? "empty:" : ""
  }sg-space-${axis}-${size}`;
