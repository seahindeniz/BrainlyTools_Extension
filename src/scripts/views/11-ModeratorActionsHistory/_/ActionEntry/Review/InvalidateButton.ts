import notification from "@components/notification2";
import type ActionEntryClassType from "../ActionEntry";
import ReviewButton from "./ReviewButton";

export default class InvalidateButton extends ReviewButton {
  constructor(main: ActionEntryClassType) {
    super(
      main,
      { type: "outline", toggle: "peach" },
      "ext-thumbs-down-outline",
      System.data.locale.moderatorActionHistory.invalid,
    );
  }

  async ReviewAction() {
    console.log("Invalidating");

    super.ReviewAction(false);
  }

  Reviewed() {
    this.Invalidated();
    super.Reviewed();
    this.main.ShowSendMessageButton();
  }

  private Invalidated() {
    this.main.is = "invalid";

    notification({
      type: "success",
      text: System.data.locale.moderatorActionHistory.invalidated,
    });
  }
}
