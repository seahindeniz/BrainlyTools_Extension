import { Icon, Text } from "@style-guide";
import type QuickActionButtonsClassType from "../QuickActionButtons";
import ActionButton from "./ActionButton";

export default class ModerateButton extends ActionButton {
  constructor(main: QuickActionButtonsClassType) {
    super(
      main,
      "left",
      {
        type: "solid-blue",
        iconOnly: true,
        title: System.data.locale.common.moderating.moderate,
        icon: new Icon({
          type: "ext-shield",
        }),
      },
      Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.common.moderating.moderate,
      }),
    );

    this.button.element.addEventListener("click", this.Clicked.bind(this));
  }

  private async Clicked() {
    await this.Selected();
    this.main.props.onModerate();
  }
}
