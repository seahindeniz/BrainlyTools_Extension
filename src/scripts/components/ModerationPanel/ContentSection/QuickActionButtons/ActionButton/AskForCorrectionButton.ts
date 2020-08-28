import { Icon, Text } from "@style-guide";
import type QuickActionButtonsClassType from "../QuickActionButtons";
import ActionButton from "./ActionButton";

export default class AskForCorrectionButton extends ActionButton {
  constructor(main: QuickActionButtonsClassType) {
    super(
      main,
      {
        type: "outline",
        toggle: "blue",
        whiteBg: true,
        iconOnly: true,
        title: System.data.locale.userContent.askForCorrection.text,
        icon: new Icon({
          color: "adaptive",
          type: "report_flag_outlined",
        }),
      },
      Text({
        tag: "div",
        size: "small",
        weight: "bold",
        children: System.data.locale.userContent.askForCorrection.text,
      }),
    );

    this.button.element.addEventListener("click", this.Clicked.bind(this));
  }

  async Clicked() {
    if (!("ToggleAskForCorrectionSection" in this.main.main)) return;

    this.main.main.ToggleAskForCorrectionSection();
  }
}
