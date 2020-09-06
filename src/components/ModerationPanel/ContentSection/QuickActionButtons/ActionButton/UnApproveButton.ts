import { Icon, Text } from "@style-guide";
import ActionButton from "./ActionButton";
import type QuickActionButtonsClassType from "../QuickActionButtons";

export default class UnApproveButton extends ActionButton {
  constructor(main: QuickActionButtonsClassType) {
    super(
      main,
      {
        type: "transparent",
        iconOnly: true,
        title: System.data.locale.common.moderating.unapprove,
        icon: new Icon({
          size: 48,
          color: "dark",
          type: "verified",
        }),
      },
      Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.common.moderating.unapprove,
      }),
    );

    this.button.element.addEventListener("click", this.Clicked.bind(this));
  }

  async Clicked() {
    if (!("ConfirmUnApproving" in this.main.main)) return;

    await this.Selected();
    this.main.main.ConfirmUnApproving();
  }
}
