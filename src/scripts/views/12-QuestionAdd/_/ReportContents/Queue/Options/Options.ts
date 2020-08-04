// @flow

import Build from "@/scripts/helpers/Build";
import { Bubble, Button, Flex, Icon } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type QueueClassType from "../Queue";
import ButtonVisibility from "./ButtonVisibility";
import Filters from "./Filters/Filters";

export default class Options {
  main: QueueClassType;

  optionsButtonContainer: FlexElementType;
  optionsButton: Button;

  container: FlexElementType;
  optionContainer: FlexElementType;

  option: {
    buttonVisibility: ButtonVisibility,
    contentFilters: Filters,
  };

  constructor(main: QueueClassType) {
    this.main = main;

    this.RenderOptionsButton();

    this.option = {
      buttonVisibility: new ButtonVisibility(this), // TODO Restrict this for QDB users
      contentFilters: new Filters(this),
    };
  }

  RenderOptionsButton() {
    this.optionsButtonContainer = Build(
      Flex({
        direction: "row-reverse",
        className: "ext-rc-options",
      }),
      [
        (this.optionsButton = new Button({
          iconOnly: true,
          type: "solid-blue",
          icon: new Icon({
            type: "settings",
            color: "adaptive",
          }),
        })),
        [
          (this.container = Flex({
            className: "options-container",
          })),
          [
            [
              Bubble({
                direction: "top",
                alignment: "end",
              }),
              (this.optionContainer = Flex({
                marginTop: "xs",
                marginBottom: "s",
                direction: "column",
              })),
            ],
          ],
        ],
      ],
    );

    this.main.main.actionContainerOnRight.append(this.optionsButtonContainer);
  }
}
