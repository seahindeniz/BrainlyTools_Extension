import notification from "@components/notification2";
import type ActionEntryClassType from "../ActionEntry";
import ReviewButton from "./ReviewButton";

export default class ValidateButton extends ReviewButton {
  constructor(main: ActionEntryClassType) {
    super(
      main,
      { type: "outline", toggle: "mint" },
      "ext-thumbs-up-outline",
      System.data.locale.moderatorActionHistory.valid,
    );
  }

  async ReviewAction() {
    console.log("Validating");

    super.ReviewAction(true);
  }

  Reviewed() {
    this.Validated();
    super.Reviewed();
  }

  private Validated() {
    this.main.is = "valid";

    notification({
      type: "success",
      text: System.data.locale.moderatorActionHistory.validated,
    });
  }
}
