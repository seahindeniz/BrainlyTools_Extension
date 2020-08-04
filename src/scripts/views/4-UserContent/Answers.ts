import { Button } from "@style-guide";
import UserContent from "./_/UserContent";
import Action from "../../controllers/Req/Brainly/Action";

class Answers extends UserContent {
  /**
   * @typedef {import("./_/UserContentRow").default} UserContentRow
   */
  constructor() {
    super("Answers");
  }

  InitAnswers() {
    if (
      System.checkUserP([6, 15, 19]) &&
      Number(System.data.Brainly.userData.user.id) !==
        Number(sitePassedParams[0])
    ) {
      if (System.checkUserP(6) && System.checkBrainlyP([146, 147])) {
        this.RenderCheckboxes();
        this.RenderButtonContainer();

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
        this.RenderCheckboxes();
        this.RenderButtonContainer();
        this.RenderCorrectionButton();
        this.RenderReportForCorrectionSection();
        this.BindCorrectionHandlers();
      }

      if (System.checkUserP(15)) {
        this.RenderDeleteSection("answer");
        this.RenderCheckboxes();
        this.RenderButtonContainer();
        this.RenderModerateButton();
        this.BindModerateHandlers();
      }
    }
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
      text: System.data.locale.common.moderating.moderate,
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
    this.$approveButton.click(this.ApproveSelectedAnswers.bind(this));
  }

  async ApproveSelectedAnswers() {
    const rows = this.ApprovableRows();

    if (rows.length == 0) {
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
        rows.forEach(this.Row_ApproveAnswer.bind(this));
      }
    }
  }

  /**
   * @param {UserContentRow} row
   */
  async Row_ApproveAnswer(row) {
    if (row.IsApproved()) {
      row.Approved(true);
    } else {
      const resApprove = await new Action().ApproveAnswer(row.answerID);

      row.CheckApproveResponse(resApprove);
    }
  }

  BindUnapprovementHandlers() {
    this.$unApproveButton.click(this.UnapproveSelectedAnswers.bind(this));
  }

  async UnapproveSelectedAnswers() {
    const rows = this.UnapprovableRows();

    if (rows.length == 0) {
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
        rows.forEach(this.Row_UnapproveAnswer.bind(this));
      }
    }
  }

  /**
   * @param {UserContentRow} row
   */
  async Row_UnapproveAnswer(row) {
    if (row.IsApproved()) {
      const resUnapprove = await new Action().UnapproveAnswer(row.answerID);

      row.CheckUnapproveResponse(resUnapprove);
    } else {
      row.Unapproved();
    }
  }

  BindCorrectionHandlers() {
    this.$correctionButton.click(
      this.ToggleReportForCorrectionSection.bind(this),
    );
    this.$reportButton.click(
      this.ReportSelectedAnswersForCorrection.bind(this),
    );
  }

  async ReportSelectedAnswersForCorrection() {
    const rows = this.DeletableRows();

    if (rows.length == 0) {
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
          reason: this.$correctionReason.val(),
        };
        console.log(postData);

        rows.forEach(row =>
          this.Row_ReportAnswerForCorrection(row, {
            ...postData,
          }),
        );
      }
    }
  }

  /**
   * @param {UserContentRow} row
   * @param {{reason:string}} postData
   */
  async Row_ReportAnswerForCorrection(row, postData) {
    if (row.deleted) {
      row.Deleted(true);
    } else if (row.reported) {
      row.Reported(true);
    } else {
      row.checkbox.ShowSpinner();

      postData.model_id = row.answerID;
      const resReport = await new Action().ReportForCorrection(postData);

      row.CorrectReportResponse(resReport);
    }
  }

  BindModerateHandlers() {
    this.$moderateButton.click(this.ToggleDeleteSection.bind(this));
    this.$deleteButton.click(this.DeleteSelectedAnswers.bind(this));
  }

  async DeleteSelectedAnswers() {
    const rows = this.DeletableRows();

    if (rows.length == 0) {
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
        };

        rows.forEach(row => this.Row_DeleteAnswer(row, { ...postData }));
      }
    }
  }

  /**
   * @param {UserContentRow} row
   * @param {{reason_id: number, reason: string, give_warning: boolean, take_points: boolean}} postData
   */
  async Row_DeleteAnswer(row, postData) {
    if (row.deleted) {
      row.Deleted(true);
    } else {
      row.checkbox.ShowSpinner();

      postData.model_id = row.answerID;
      const resRemove = await new Action().RemoveAnswer(postData);

      row.CheckDeleteResponse(resRemove);
    }
  }
}

new Answers();
