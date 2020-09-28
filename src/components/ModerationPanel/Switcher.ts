import Build from "@root/helpers/Build";
import { Button, Flex, Icon } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type ModerationPanelClassType from "./ModerationPanel";

export default class Switcher {
  main: ModerationPanelClassType;
  container: FlexElementType;

  constructor(main: ModerationPanelClassType) {
    this.main = main;

    this.Render();
  }

  Render() {
    this.container = Build(
      Flex({
        justifyContent: "space-between",
      }),
      [
        this.main.listeners.switchPrevious && [
          Flex(),
          new Button({
            size: "xl",
            type: "solid",
            iconOnly: true,
            onClick: this.main.listeners.switchPrevious,
            className: "ext-switch-button ext-switch-button--left",
            icon: new Icon({
              size: 40,
              color: "adaptive",
              type: "arrow_left",
            }),
          }),
        ],
        this.main.listeners.switchNext && [
          Flex(),
          new Button({
            size: "xl",
            type: "solid",
            iconOnly: true,
            onClick: this.main.listeners.switchNext,
            className: "ext-switch-button ext-switch-button--right",
            icon: new Icon({
              size: 40,
              color: "adaptive",
              type: "arrow_right",
            }),
          }),
        ],
      ],
    );

    this.main.contentContainer.prepend(this.container);
  }
}
