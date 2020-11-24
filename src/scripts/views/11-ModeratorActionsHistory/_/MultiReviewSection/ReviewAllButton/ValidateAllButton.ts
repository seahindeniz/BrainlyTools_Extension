import notification from "@components/notification2";
import type MultiReviewSectionClassType from "../MultiReviewSection";
import ReviewAllButton from "./ReviewAllButton";

export default class ValidateAllButton extends ReviewAllButton {
  constructor(main: MultiReviewSectionClassType) {
    super(
      main,
      { type: "outline", toggle: "mint" },
      "ext-thumbs-up",
      System.data.locale.moderatorActionHistory.validateAll,
      System.data.locale.moderatorActionHistory.validateAllDescription,
    );
  }

  async ReviewAllActions() {
    super.ReviewAllActions(true);
  }

  Reviewed() {
    notification({
      type: "success",
      text: System.data.locale.moderatorActionHistory.allValidated,
    });

    super.Reviewed();
  }
}
