import Action, { RemoveAnswerReqDataType } from "@BrainlyAction";
import { Button } from "@style-guide";
import UserContent from "./_/UserContent";
import type UserContentRowClassType from "./_/UserContentRow";

async function Row_ApproveAnswer(row: UserContentRowClassType) {
  if (row.IsApproved()) {
    row.Approved(true);

    return;
  }

  const resApprove = await new Action().ApproveAnswer(row.answerID);

  row.CheckApproveResponse(resApprove);
}

async function Row_UnapproveAnswer(row: UserContentRowClassType) {
  if (!row.IsApproved()) {
    row.Unapproved();

    return;
  }

  const resUnapprove = await new Action().UnapproveAnswer(row.answerID);

  row.CheckUnapproveResponse(resUnapprove);
}

async function Row_ReportAnswerForCorrection(
  row: UserContentRowClassType,
  postData: { reason?: string; [x: string]: any },
) {
  if (row.deleted) {
    row.Deleted(true);
  } else if (row.reported) {
    row.Reported(true);
  } else {
    row.ShowSpinner();

    const resReport = await new Action().ReportForCorrection({
      ...postData,
      model_id: row.answerID,
    });

    row.CorrectReportResponse(resReport);
  }
}

async function Row_DeleteAnswer(
  row: UserContentRowClassType,
  postData: RemoveAnswerReqDataType,
) {
  if (row.deleted) {
    row.Deleted(true);
  } else {
    row.ShowSpinner();

    postData.model_id = row.answerID;
    const resRemove = await new Action().RemoveAnswer(postData);

    row.CheckDeleteResponse(resRemove);
  }
}

class Answers extends UserContent {
  $approveButtonContainer: JQuery<HTMLElement>;
  $approveButton: JQuery<HTMLElement>;
  $unApproveButtonContainer: JQuery<HTMLElement>;
  $unApproveButton: JQuery<HTMLElement>;
  $correctionButtonContainer: JQuery<HTMLElement>;
  $correctionButton: JQuery<HTMLElement>;
  $moderateButtonContainer: JQuery<HTMLElement>;
  $moderateButton: JQuery<HTMLElement>;
  /**
   * @typedef {import("./_/UserContentRow").default} UserContentRow
   */
  constructor() {
    super("Answers");
  }

  InitAnswers() {
    this.RenderCheckboxes();
    this.RenderButtonContainer();

    if (
      System.checkUserP([6, 15, 19]) &&
      Number(System.data.Brainly.userData.user.id) !==
        Number(sitePassedParams[0])
    ) {
      if (System.checkUserP(6) && System.checkBrainlyP([146, 147])) {
        if (System.checkBrainlyP(146)) {
          this.RenderApproveButton();
          this.BindApprovementHandlers();
        }

        if (System.checkBrainlyP(147)) {
          this.RenderUnapproveButton();
          this.BindUnapprovementHandlers();
        }
      }

      if (System.checkUserP(19) && System.checkBrainlyP(48)) {
        this.RenderCorrectionButton();
        this.RenderReportForCorrectionSection();
        this.BindCorrectionHandlers();
      }

      if (System.checkUserP(15)) {
        this.RenderDeleteSection("answer");
        this.RenderModerateButton();
        this.BindModerateHandlers();
      }
    }

    this.RenderCopyLinksButton();
  }

  RenderButtonHole() {
    return $(`<div class="sg-actions-list__hole"></div>`).appendTo(
      this.$buttonList,
    );
  }

  RenderApproveButton() {
    const button = this.RenderButton({
      type: "solid-mint",
      text: System.data.locale.common.moderating.approve,
    });
    this.$approveButtonContainer = button.$container;
    this.$approveButton = button.$button;
  }

  RenderUnapproveButton() {
    const button = this.RenderButton({
      text: System.data.locale.common.moderating.unapprove,
    });
    this.$unApproveButtonContainer = button.$container;
    this.$unApproveButton = button.$button;
  }

  RenderCorrectionButton() {
    const button = this.RenderButton({
      type: "solid-light",
      toggle: "blue",
      text: System.data.locale.userContent.askForCorrection.text,
    });
    this.$correctionButtonContainer = button.$container;
    this.$correctionButton = button.$button;
  }

  RenderModerateButton() {
    const button = this.RenderButton({
      type: "solid-light",
      toggle: "peach",
      text: System.data.locale.common.delete,
    });
    this.$moderateButtonContainer = button.$container;
    this.$moderateButton = button.$button;
  }

  /**
   * @param {import("@style-guide/Button").ButtonPropsType} options
   */
  RenderButton(options) {
    const $container = $(`<div class="sg-actions-list__hole"></div>`);
    const button = new Button({
      size: "small",
      ...options,
    });

    const $button = $(button.element);

    $button.appendTo($container);
    $container.appendTo(this.$buttonList);

    return { $button, $container };
  }

  BindApprovementHandlers() {
    this.$approveButton.on("click", this.ApproveSelectedAnswers.bind(this));
  }

  async ApproveSelectedAnswers() {
    const rows = this.ApprovableRows();

    if (rows.length === 0) {
      this.ShowSelectContentWarning();
    } else {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (
        confirm(
          System.data.locale.userContent.notificationMessages
            .confirmApprovingSelected,
        )
      ) {
        rows.forEach(Row_ApproveAnswer);
      }
    }
  }

  BindUnapprovementHandlers() {
    this.$unApproveButton.on("click", this.UnapproveSelectedAnswers.bind(this));
  }

  async UnapproveSelectedAnswers() {
    const rows = this.UnapprovableRows();

    if (rows.length === 0) {
      this.ShowSelectContentWarning();
    } else {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (
        confirm(
          System.data.locale.userContent.notificationMessages
            .confirmUnapproving,
        )
      ) {
        rows.forEach(Row_UnapproveAnswer);
      }
    }
  }

  BindCorrectionHandlers() {
    this.$correctionButton.on(
      "click",
      this.ToggleReportForCorrectionSection.bind(this),
    );
    this.$reportButton.on(
      "click",
      this.ReportSelectedAnswersForCorrection.bind(this),
    );
  }

  async ReportSelectedAnswersForCorrection() {
    const rows = this.DeletableRows();

    if (rows.length === 0) {
      this.ShowSelectContentWarning();
    } else {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (
        confirm(
          System.data.locale.userContent.notificationMessages.confirmReporting,
        )
      ) {
        const postData = {
          reason: String(this.$correctionReason.val()),
        };
        console.log(postData);

        rows.forEach(row =>
          Row_ReportAnswerForCorrection(row, {
            ...postData,
          }),
        );
      }
    }
  }

  BindModerateHandlers() {
    this.$moderateButton.on("click", this.ToggleDeleteSection.bind(this));
    this.$deleteButton.on("click", this.DeleteSelectedAnswers.bind(this));
  }

  async DeleteSelectedAnswers() {
    const rows = this.DeletableRows();

    if (rows.length === 0) {
      this.ShowSelectContentWarning();
    } else if (this.deleteSection.selectedReason) {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        const postData = {
          reason_id: this.deleteSection.selectedReason.id,
          reason: this.deleteSection.reasonText,
          give_warning: this.deleteSection.giveWarning,
          take_points: this.deleteSection.takePoints,
          model_id: undefined,
        };

        rows.forEach(row => Row_DeleteAnswer(row, { ...postData }));
      }
    }
  }
}

// eslint-disable-next-line no-new
new Answers();
