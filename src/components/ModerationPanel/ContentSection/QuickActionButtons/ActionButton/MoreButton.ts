import { Icon, Text } from "@style-guide";
import type QuickActionButtonsClassType from "../QuickActionButtons";
import ActionButton from "./ActionButton";

export default class MoreButton extends ActionButton {
  constructor(main: QuickActionButtonsClassType) {
    super(
      main,
      "left",
      {
        type: "outline",
        toggle: "peach",
        whiteBg: true,
        iconOnly: true,
        title: System.data.locale.moderationPanel.seeMoreDeleteOptions,
        icon: new Icon({
          type: "trash",
          color: "adaptive",
        }),
      },
      Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.moderationPanel.seeMoreDeleteOptions,
      }),
    );

    this.container.ChangeMargin({
      marginRight: "xs",
    });
    this.button.element.addEventListener("click", this.Clicked.bind(this));
  }

  Clicked() {
    this.main.main.ToggleDeleteSection();
  }
}
