import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import storage from "@root/helpers/extStorage";
import HideElement from "@root/helpers/HideElement";
import { Flex, SeparatorHorizontal, Text } from "@style-guide";
import type { TextElement } from "@style-guide/Text";
import tippy from "tippy.js";
import type OptionsClassType from "./Options";

export const MIN_REPORT_BOXES_PER_SCROLL_LIMIT = 12;
export const REPORTED_CONTENTS_LOAD_LIMITER_KEY =
  "reported_contents_load_limiter4";

export default class LoadLimiter {
  main: OptionsClassType;

  maxLimit: number;

  input: HTMLInputElement;
  rangeList: HTMLDataListElement;
  label: TextElement<"div">;
  container: import("@style-guide/Flex").FlexElementType;
  separator: HTMLDivElement;

  constructor(main: OptionsClassType) {
    this.main = main;

    this.Render();
  }

  get limit() {
    return this.main.main.main.defaults.loadLimit;
  }

  set limit(limit) {
    this.main.main.main.defaults.loadLimit = limit;
  }

  Render() {
    this.container = Build(
      Flex({
        tag: "label",
      }),
      [
        [
          Flex({ alignItems: "center", marginRight: "s" }),
          Text({
            size: "small",
            text: `${System.data.locale.reportedContents.options.loadLimiter.optionName}: `,
            weight: "bold",
          }),
        ],
        [
          Flex({
            grow: true,
            alignItems: "center",
          }),
          [
            (this.input = CreateElement({
              max:
                this.maxLimit ||
                this.limit ||
                MIN_REPORT_BOXES_PER_SCROLL_LIMIT + 1,
              min: MIN_REPORT_BOXES_PER_SCROLL_LIMIT,
              tag: "input",
              type: "range",
              list: "loadLimiterMark",
              value: this.limit,
              onInput: this.Sliding.bind(this),
              onChange: this.Changed.bind(this),
              style: {
                width: "100%",
              },
            })),
            [
              Flex({ marginLeft: "xs" }),
              (this.label = Text({
                tag: "div",
                weight: "bold",
                noWrap: true,
              })),
            ],
          ],
        ],
      ],
    );

    this.main.optionContainer.append(
      (this.separator = SeparatorHorizontal({
        type: "short-spaced",
      })),
      this.container,
    );

    tippy(this.container, {
      theme: "light",
      placement: "bottom",
      content: Text({
        size: "small",
        weight: "bold",
        whiteSpace: "pre-wrap",
        children:
          System.data.locale.reportedContents.options.loadLimiter.description,
      }),
    });

    this.PrintLabelText(String(this.limit));
  }

  Sliding() {
    const { value } = this.input;

    this.PrintLabelText(value);
  }

  Changed() {
    const { value } = this.input;

    this.limit = Number(value);

    if (
      Number.isNaN(this.limit) ||
      this.limit < MIN_REPORT_BOXES_PER_SCROLL_LIMIT ||
      this.limit > this.maxLimit
    )
      this.limit = MIN_REPORT_BOXES_PER_SCROLL_LIMIT;

    storage("set", {
      [REPORTED_CONTENTS_LOAD_LIMITER_KEY]: this.limit,
    });

    this.PrintLabelText(value);
  }

  PrintLabelText(value: string) {
    this.label.innerText =
      value === "12" ? `12 (${System.data.locale.common.default})` : value;
  }

  SetRangeLimit() {
    if (this.maxLimit <= MIN_REPORT_BOXES_PER_SCROLL_LIMIT) {
      HideElement(this.container);
      HideElement(this.separator);

      return;
    }

    this.input.max = String(this.maxLimit);
  }
}
