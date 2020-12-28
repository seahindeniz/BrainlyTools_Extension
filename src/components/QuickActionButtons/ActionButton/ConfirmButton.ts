import { Icon, Text } from "@style-guide";
import type QuickActionButtonsClassType from "../QuickActionButtons";
import ActionButton from "./ActionButton";

export default class ConfirmButton extends ActionButton {
  constructor(main: QuickActionButtonsClassType) {
    super(
      main,
      "right",
      {
        type: "solid-mint",
        iconOnly: true,
        title: System.data.locale.common.confirm,
        icon: new Icon({
          type: "check",
        }),
      },
      Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.common.confirm,
      }),
    );

    /* this.button.element.addEventListener("click", this.Clicked.bind(this));
  }

  async Clicked() {
    await this.Selected();
    this.main.main.ConfirmConfirming(); */
  }
}
