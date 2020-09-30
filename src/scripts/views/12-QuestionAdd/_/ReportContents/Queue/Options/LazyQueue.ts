import Switch from "@components/Switch";
import Build from "@root/helpers/Build";
import storage from "@root/helpers/extStorage";
import { Flex, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type OptionsClassType from "./Options";

export const REPORTED_CONTENTS_LAZY_QUEUE_KEY = "reported_contents_lazy_queue";

export default class LazyQueue {
  main: OptionsClassType;

  container: FlexElementType;
  switch: Switch;

  constructor(main: OptionsClassType) {
    this.main = main;

    this.Render();
    this.SetValue();
  }

  Render() {
    this.container = Build(
      Flex({
        tag: "label",
        marginTop: "m",
      }),
      [
        [
          Flex({ marginRight: "s", alignItems: "center" }),
          Text({
            size: "small",
            weight: "bold",
            text: `${System.data.locale.reportedContents.options.lazyQueue.optionName}: `,
          }),
        ],
        [
          Flex({
            grow: true,
          }),
          (this.switch = new Switch({
            onChange: this.StoreState.bind(this),
          })),
        ],
      ],
    );

    this.main.optionContainer.append(this.container);

    tippy(this.container, {
      theme: "light",
      placement: "bottom",
      content: Text({
        size: "small",
        weight: "bold",
        whiteSpace: "pre-wrap",
        children:
          System.data.locale.reportedContents.options.lazyQueue.description,
      }),
    });

    this.SetValue();
  }

  async SetValue() {
    const value =
      Boolean(await storage("get", REPORTED_CONTENTS_LAZY_QUEUE_KEY)) || false;

    this.switch.input.checked = value;
  }

  StoreState() {
    storage("set", {
      [REPORTED_CONTENTS_LAZY_QUEUE_KEY]: this.switch.input.checked,
    });
  }
}
