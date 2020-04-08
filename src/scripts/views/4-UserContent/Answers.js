import UserContent from "./_/UserContent";
import UserContentRow from "./_/UserContentRow";
import Action from "../../controllers/Req/Brainly/Action";
import Button from "../../components/Button";

class Answers extends UserContent {
  constructor() {
    super("Answers");
  }
  InitAnswers() {
    if (
      System.checkUserP([6, 15, 19]) &&
      System.data.Brainly.userData.user.id != sitePassedParams[0]
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
    return $(`<div class="sg-actions-list__hole"></div>`)
      .appendTo(this.$buttonList);
  }
  RenderApproveButton() {
    let button = this.RenderButton({
      type: "solid-mint",
      text: System.data.locale.common.moderating.approve
    });
    this.$approveButtonContainer = button.$container;
    this.$approveButton = button.$button;
  }
  RenderUnapproveButton() {
    let button = this.RenderButton({
      text: System.data.locale.common.moderating.unapprove
    });
    this.$unApproveButtonContainer = button.$container;
    this.$unApproveButton = button.$button;
  }
  RenderCorrectionButton() {
    let button = this.RenderButton({
      type: "transparent-blue",
      text: System.data.locale.userContent.askForCorrection.text
    });
    this.$correctionButtonContainer = button.$container;
    this.$correctionButton = button.$button;
  }
  RenderModerateButton() {
    let button = this.RenderButton({
      type: "transparent-peach",
      text: System.data.locale.common.moderating.moderate
    });
    this.$moderateButtonContainer = button.$container;
    this.$moderateButton = button.$button;
  }
  /**
   * @param {import("../../components/Button").ButtonOptions} options
   */
  RenderButton(options) {
    let $container = $(`<div class="sg-actions-list__hole"></div>`);
    let $button = Button({
      size: "small",
      ...options
    });

    $button.appendTo($container);
    $container.appendTo(this.$buttonList);

    return { $button, $container };
  }

  BindApprovementHandlers() {
    this.$approveButton.click(this.ApproveSelectedAnswers.bind(this));
  }
  async ApproveSelectedAnswers() {
    let rows = this.ApprovableRows();

    if (rows.length == 0) {
      this.ShowSelectContentWarning();
    } else {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.userContent.notificationMessages
          .confirmApproving)) {
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
      let resApprove = await new Action().ApproveAnswer(row.answerID);

      row.CheckApproveResponse(resApprove);
    }
  }

  BindUnapprovementHandlers() {
    this.$unApproveButton.click(this.UnapproveSelectedAnswers.bind(this));
  }
  async UnapproveSelectedAnswers() {
    let rows = this.UnapprovableRows();

    if (rows.length == 0) {
      this.ShowSelectContentWarning();
    } else {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.userContent.notificationMessages
          .confirmUnapproving)) {
        rows.forEach(this.Row_UnapproveAnswer.bind(this));
      }
    }
  }
  /**
   * @param {UserContentRow} row
   */
  async Row_UnapproveAnswer(row) {
    if (row.IsApproved()) {
      let resUnapprove = await new Action().UnapproveAnswer(row.answerID);

      row.CheckUnapproveResponse(resUnapprove);
    } else {
      row.Unapproved();
    }
  }

  BindCorrectionHandlers() {
    this.$correctionButton.click(this.ToggleReportForCorrectionSection.bind(
      this));
    this.$reportButton.click(this.ReportSelectedAnswersForCorrection.bind(
      this));
  }
  async ReportSelectedAnswersForCorrection() {
    let rows = this.DeletableRows();

    if (rows.length == 0) {
      this.ShowSelectContentWarning();
    } else {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.userContent.notificationMessages
          .confirmReporting)) {
        let postData = {
          reason: this.$correctionReason.val(),
        };
        console.log(postData);

        rows.forEach(row => this.Row_ReportAnswerForCorrection(row, {
          ...postData
        }));
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
      let resReport = await new Action().ReportForCorrection(postData);

      row.CorrectReportResponse(resReport);
    }
  }

  BindModerateHandlers() {
    this.$moderateButton.click(this.ToggleDeleteSection.bind(this));
    this.$deleteButton.click(this.DeleteSelectedAnswers.bind(this));
  }
  async DeleteSelectedAnswers() {
    let rows = this.DeletableRows();

    if (rows.length == 0) {
      this.ShowSelectContentWarning();
    } else if (this.deleteSection.selectedReason) {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        let postData = {
          reason_id: this.deleteSection.selectedReason.id,
          reason: this.deleteSection.reasonText,
          give_warning: this.deleteSection.giveWarning,
          take_points: this.deleteSection.takePoints
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
      row.Deleted(true)
    } else {
      row.checkbox.ShowSpinner();

      postData.model_id = row.answerID;
      let resRemove = await new Action().RemoveAnswer(postData);

      row.CheckDeleteResponse(resRemove);
    }
  }
}

new Answers();
