import DeleteButton from "./ActionButton/DeleteButton";
import QuickActionButtons from "./QuickActionButtons";
import type QuestionClassType from "../Question";

export default class QuickActionButtonsForQuestion extends QuickActionButtons {
  constructor(main: QuestionClassType) {
    super(main);

    this.RenderDeleteButtons();
    this.RenderConfirmButton();
  }

  RenderDeleteButtons() {
    if (!System.checkUserP(1) || !System.checkBrainlyP(102)) return;

    System.data.config.quickDeleteButtonsReasons.question.forEach(
      (id, index) => {
        const deleteButton = new DeleteButton(this, id, index, {
          type: "solid-mustard",
        });

        this.actionButtons.push(deleteButton);
      },
    );
  }
}
