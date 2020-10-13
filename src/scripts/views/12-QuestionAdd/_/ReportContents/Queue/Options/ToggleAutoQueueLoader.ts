import Switch from "@components/Switch";
import Build from "@root/helpers/Build";
import storage from "@root/helpers/extStorage";
import { Flex, SeparatorHorizontal, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type OptionsClassType from "./Options";

export const REPORTED_CONTENTS_AUTO_QUEUE_LOADER_KEY =
  "reported_contents_infinite_loader";

export default class ToggleAutoQueueLoader {
  main: OptionsClassType;

  container: FlexElementType;
  switch: Switch;

  constructor(main: OptionsClassType) {
    this.main = main;

    this.Render();
  }

  Render() {
    this.container = Build(
      Flex({
        marginTop: "xxs",
        marginBottom: "xxs",
      }),
      [
        [
          Flex({
            tag: "label",
          }),
          [
            [
              Flex({ marginRight: "s", alignItems: "center" }),
              Text({
                size: "small",
                weight: "bold",
                text: `${System.data.locale.reportedContents.options.toggleInfiniteLoader.optionName}: `,
              }),
            ],
            [
              Flex({
                grow: true,
              }),
              (this.switch = new Switch({
                checked: this.main.main.main.defaults.autoQueueLoader,
                onChange: this.StoreState.bind(this),
              })),
            ],
          ],
        ],
      ],
    );

    this.main.optionContainer.append(
      SeparatorHorizontal({
        type: "short-spaced",
      }),
      this.container,
    );
    // this.main.optionContainer.append(this.container);

    tippy(this.container, {
      theme: "light",
      placement: "auto-start",
      content: Text({
        size: "small",
        weight: "bold",
        whiteSpace: "pre-wrap",
        children:
          System.data.locale.reportedContents.options.toggleInfiniteLoader
            .description,
      }),
    });
  }

  StoreState() {
    const { checked } = this.switch.input;
    this.main.main.main.defaults.autoQueueLoader = checked;

    storage("set", {
      [REPORTED_CONTENTS_AUTO_QUEUE_LOADER_KEY]: checked,
    });
  }
}
