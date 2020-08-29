import InsertBefore from "@root/scripts/helpers/InsertBefore";
import type AnswerClassType from "../Answer";
import ApproveButton from "./ActionButton/ApproveButton";
import AskForCorrectionButton from "./ActionButton/AskForCorrectionButton";
import DeleteButton from "./ActionButton/DeleteButton";
import QuickActionButtons from "./QuickActionButtons";

export default class QuickActionButtonsForAnswer extends QuickActionButtons {
  askForCorrectionButton: AskForCorrectionButton;
  constructor(main: AnswerClassType) {
    super(main);

    this.RenderAskForCorrectionButton();
    this.RenderApproveButton();
    this.RenderDeleteButtons();
    this.RenderConfirmButton();
  }

  RenderAskForCorrectionButton() {
    if (!("answerData" in this.main) || this.main.answerData.wrong_report)
      return;

    if (this.askForCorrectionButton) {
      this.askForCorrectionButton.Show(true);

      return;
    }

    this.askForCorrectionButton = new AskForCorrectionButton(this);

    this.askForCorrectionButton.Show(true);
    this.askForCorrectionButton.container.ChangeMargin({
      marginRight: "xs",
    });

    this.actionButtons.push(this.askForCorrectionButton);
  }

  RenderApproveButton() {
    if (!System.checkBrainlyP(146)) return;

    const approveButton = new ApproveButton(this);

    approveButton.container.ChangeMargin({
      marginRight: "xs",
    });

    InsertBefore(approveButton.container, this.moreButton.container);

    this.actionButtons.push(approveButton);
  }

  RenderDeleteButtons() {
    if (!System.checkUserP(2) || !System.checkBrainlyP(102)) return;

    System.data.config.quickDeleteButtonsReasons.answer.forEach((id, index) => {
      const deleteButton = new DeleteButton(this, id, index, {
        type: "solid-peach",
      });

      this.actionButtons.push(deleteButton);
    });
  }
}
