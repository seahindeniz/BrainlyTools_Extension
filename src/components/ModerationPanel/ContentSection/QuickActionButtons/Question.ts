import DeleteButton from "./ActionButton/DeleteButton";
import QuickActionButtons from "./QuickActionButtons";
import type QuestionClassType from "../Question";

export default class QuickActionButtonsForQuestion extends QuickActionButtons {
  main: QuestionClassType;

  constructor(main: QuestionClassType) {
    super(main);

    this.RenderConfirmButton();
  }

  RenderDeleteButtons() {
    if (
      this.main.extraData.answers.hasVerified ||
      !System.checkUserP(1) ||
      !System.checkBrainlyP(102)
    )
      return;

    System.data.config.quickDeleteButtonsReasons.question.forEach(
      (id, index) => {
        const deleteButton = new DeleteButton(
          this,
          { id, type: "question" },
          index,
          {
            type: "solid-mustard",
          },
        );

        this.actionButtons.push(deleteButton);
      },
    );
  }
}
