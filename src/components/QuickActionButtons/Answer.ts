import { RemoveAnswer } from "@BrainlyReq";
import type { RemoveAnswerReqDataType } from "@BrainlyReq/RemoveAnswer";
import AskForCorrectionButton from "./ActionButton/AskForCorrectionButton";
import DeleteButton from "./ActionButton/DeleteButton";
import UnverifyButton from "./ActionButton/UnverifyButton";
import VerifyButton from "./ActionButton/VerifyButton";
import QuickActionButtons, {
  ContentType,
  QuickActionButtonsPropsType,
} from "./QuickActionButtons";

type AnswerContentType = {
  verification?: boolean;
  reportedForCorrection?: boolean;
  corrected?: boolean;
} & ContentType;

type PropsType = {
  content: AnswerContentType;
} & QuickActionButtonsPropsType;

export default class QuickActionButtonsForAnswer extends QuickActionButtons {
  contentType: "Answer";
  content: AnswerContentType;

  askForCorrectionButton: AskForCorrectionButton;

  constructor(props: PropsType) {
    super("Answer", props);

    this.RenderAskForCorrectionButton();
    this.RenderDeleteButtons();
    this.RenderConfirmButton();
  }

  RenderAskForCorrectionButton() {
    if (this.content.reported && !this.content.corrected) return;

    if (this.askForCorrectionButton) {
      this.askForCorrectionButton.Show();

      return;
    }

    this.askForCorrectionButton = new AskForCorrectionButton(this);

    this.askForCorrectionButton.Show();
    this.askForCorrectionButton.container.ChangeMargin({
      marginRight: "xs",
    });

    this.actionButtons.push(this.askForCorrectionButton);
  }

  RenderApproveButton() {
    if (!System.checkBrainlyP(146)) return;

    if (this.content.verification) {
      this.RenderUnApproveButton();

      return;
    }

    const approveButton = new VerifyButton(this);

    approveButton.container.ChangeMargin({
      marginRight: "xs",
    });

    this.actionButtons.push(approveButton);
  }

  RenderUnApproveButton() {
    if (!System.checkBrainlyP(147)) return;

    const unApproveButton = new UnverifyButton(this);

    unApproveButton.container.ChangeMargin({
      marginRight: "xs",
    });

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

  RenderConfirmButton() {
    if (
      (System.checkBrainlyP(146) && !System.checkUserP(38)) ||
      (!this.content.reported && !this.content.reportedForCorrection)
    )
      return;

    super.RenderConfirmButton();
  }

  async DeleteContent(data: RemoveAnswerReqDataType) {
    try {
      const resDelete = await RemoveAnswer(data, this.content.reported);

      if (resDelete?.success === false) {
        throw resDelete.message
          ? { msg: resDelete.message }
          : resDelete || Error("No response");
      }

      this.NotModerating();
      this.Deleted();
    } catch (error) {
      console.error(error);
      this.props.notificationHandler?.({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });

      this.NotModerating();
    }
  }
}
