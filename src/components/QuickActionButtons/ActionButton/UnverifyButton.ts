import { Icon, Text } from "@style-guide";
import ActionButton from "./ActionButton";
import type QuickActionButtonsClassType from "../QuickActionButtons";

export default class UnverifyButton extends ActionButton {
  constructor(main: QuickActionButtonsClassType) {
    super(
      main,
      "left",
      {
        type: "outline",
        iconOnly: true,
        title: System.data.locale.common.moderating.unapprove,
        icon: new Icon({
          size: 32,
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

    // this.button.element.addEventListener("click", this.Clicked.bind(this));
  }

  /* async Clicked() {
    if (!("ConfirmUnApproving" in this.main.main)) return;

    await this.Selected();
    this.main.main.ConfirmUnApproving();
  } */
}
