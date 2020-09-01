import DeleteButton from "./ActionButton/DeleteButton";
import QuickActionButtons from "./QuickActionButtons";
import type CommentClassType from "../CommentSection/Comment";

export default class QuickActionButtonsForComment extends QuickActionButtons {
  constructor(main: CommentClassType) {
    super(main, "s");

    this.RenderDeleteButtons();
    this.RenderConfirmButton();
  }

  RenderDeleteButtons() {
    if (!System.checkUserP(45) || !System.checkBrainlyP(102)) return;

    System.data.config.quickDeleteButtonsReasons.comment.forEach(
      (id, index) => {
        const deleteButton = new DeleteButton(
          this,
          { id, type: "comment" },
          index,
          {
            type: "solid",
          },
        );

        this.actionButtons.push(deleteButton);
      },
    );
  }
}
