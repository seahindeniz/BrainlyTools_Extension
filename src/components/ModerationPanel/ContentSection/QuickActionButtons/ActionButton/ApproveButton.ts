import { Icon, Text } from "@style-guide";
import ActionButton from "./ActionButton";
import type QuickActionButtonsClassType from "../QuickActionButtons";

export default class ApproveButton extends ActionButton {
  constructor(main: QuickActionButtonsClassType) {
    super(
      main,
      {
        type: "transparent",
        iconOnly: true,
        title: System.data.locale.common.moderating.approve,
        icon: new Icon({
          size: 48,
          color: "mint",
          type: "verified",
        }),
      },
      Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.common.moderating.approve,
      }),
    );

    this.button.element.addEventListener("click", this.Clicked.bind(this));
  }

  async Clicked() {
    if (!("ConfirmApproving" in this.main.main)) return;

    await this.Selected();
    this.main.main.ConfirmApproving();
  }
}
