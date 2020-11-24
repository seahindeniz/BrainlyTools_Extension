import notification from "@components/notification2";
import type MultiReviewSectionClassType from "../MultiReviewSection";
import ReviewAllButton from "./ReviewAllButton";

export default class InvalidateAllButton extends ReviewAllButton {
  constructor(main: MultiReviewSectionClassType) {
    super(
      main,
      { type: "outline", toggle: "peach" },
      "ext-thumbs-down",
      System.data.locale.moderatorActionHistory.invalidateAll,
      System.data.locale.moderatorActionHistory.invalidateAllDescription,
    );
  }

  async ReviewAllActions() {
    console.log("Invalidating");

    super.ReviewAllActions(false);
  }

  Reviewed() {
    notification({
      type: "success",
      text: System.data.locale.moderatorActionHistory.allInvalidated,
    });

    super.Reviewed();
    this.main.ToggleSendMessageButton();
  }
}
