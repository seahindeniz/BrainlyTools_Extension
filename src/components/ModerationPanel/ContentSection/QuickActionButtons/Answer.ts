import InsertBefore from "@root/helpers/InsertBefore";
import type AnswerClassType from "../Answer";
import ApproveButton from "./ActionButton/ApproveButton";
import AskForCorrectionButton from "./ActionButton/AskForCorrectionButton";
import DeleteButton from "./ActionButton/DeleteButton";
import UnApproveButton from "./ActionButton/UnApproveButton";
import QuickActionButtons from "./QuickActionButtons";

export default class QuickActionButtonsForAnswer extends QuickActionButtons {
  askForCorrectionButton: AskForCorrectionButton;
  constructor(main: AnswerClassType) {
    super(main);

    this.RenderAskForCorrectionButton();
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

    if ("Approved" in this.main && this.main.extraData.verification) {
      this.RenderUnApproveButton();

      return;
    }

    const approveButton = new ApproveButton(this);

    approveButton.container.ChangeMargin({
      marginRight: "xs",
    });

    InsertBefore(approveButton.container, this.moreButton.container);

    this.actionButtons.push(approveButton);
  }

  RenderUnApproveButton() {
    if (!System.checkBrainlyP(147)) return;

    const unApproveButton = new UnApproveButton(this);

    unApproveButton.container.ChangeMargin({
      marginRight: "xs",
    });

    InsertBefore(unApproveButton.container, this.moreButton.container);

    this.actionButtons.push(unApproveButton);
  }

  RenderDeleteButtons() {
    if (!System.checkUserP(2) || !System.checkBrainlyP(102)) return;

    System.data.config.quickDeleteButtonsReasons.answer.forEach((id, index) => {
      const deleteButton = new DeleteButton(
        this,
        { id, type: "answer" },
        index,
        {
          type: "solid-peach",
        },
      );

      this.actionButtons.push(deleteButton);
    });
  }
}
