import UserContent from "./_/UserContent";
import UserContentRow from "./_/UserContentRow";
import Action from "../../controllers/Req/Brainly/Action";

class Answers extends UserContent {
  constructor() {
    super("Answers");
  }
  InitAnswers() {
    if (System.checkUserP([6, 15, 19])) {

      if (System.checkUserP(6) && System.checkBrainlyP([146, 147])) {
        this.RenderCheckboxes();
        this.RenderButtonContainer();

        if (System.checkBrainlyP(146)) {
          this.RenderApproveButton();
          this.BindApprovementEvents();
        }

        if (System.checkBrainlyP(147)) {
          this.RenderUnapproveButton();
          this.BindUnapprovementEvents();
        }
      }

      if (System.checkUserP(19) && System.checkBrainlyP(48)) {
        this.RenderCheckboxes();
        this.RenderButtonContainer();
        this.RenderCorrectionButton();
        this.RenderReportForCorrectionSection();
        this.BindCorrectionEvents();
      }

      if (System.checkUserP(15)) {
        this.RenderCheckboxes();
        this.RenderButtonContainer();
        this.RenderModerateButton();
        this.RenderDeleteSection("response");
        this.BindModerateEvents();
      }
    }
  }
  RenderButtonContainer() {
    if (!this.$buttonContainer) {
      this.$buttonContainer = $(`
      <div class="sg-content-box__content sg-content-box__content--spaced-bottom">
        <div class="sg-actions-list"></div>
      </div>`);

      this.$buttonList = $(".sg-actions-list", this.$buttonContainer);

      this.$buttonContainer.appendTo(this.$moderateHeader);
    }
  }
  RenderButtonHole() {
    return $(`<div class="sg-actions-list__hole"></div>`).appendTo(this.$buttonList);;
  }
  RenderApproveButton() {
    this.$approveButtonContainer = this.RenderButtonHole();
    this.$approveButton = $(`<button class="sg-button-secondary">${System.data.locale.common.moderating.approve}</button>`);

    this.$approveButton.appendTo(this.$approveButtonContainer);
  }
  RenderUnapproveButton() {
    this.$unApproveButtonContainer = this.RenderButtonHole();
    this.$unApproveButton = $(`<button class="sg-button-secondary sg-button-secondary--dark">${System.data.locale.common.moderating.unapprove}</button>`);

    this.$unApproveButton.appendTo(this.$unApproveButtonContainer);
  }
  RenderCorrectionButton() {
    this.$correctionButtonContainer = this.RenderButtonHole();
    this.$correctionButton = $(`<button class="sg-button-secondary sg-button-secondary--alt">${System.data.locale.userContent.askForCorrection.text}</button>`);

    this.$correctionButton.appendTo(this.$correctionButtonContainer);
  }
  RenderModerateButton() {
    this.$moderateButtonContainer = this.RenderButtonHole();
    this.$moderateButton = $(`<button class="sg-button-secondary sg-button-secondary--peach">${System.data.locale.common.moderating.moderate}</button>`);

    this.$moderateButton.appendTo(this.$moderateButtonContainer);
  }

  BindApprovementEvents() {
    this.$approveButton.click(this.ApproveSelectedAnswers.bind(this));
  }
  async ApproveSelectedAnswers() {
    let rows = this.ApprovableRows();

    if (rows.length == 0) {
      this.ShowSelectContentWarning();
    } else {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.userContent.notificationMessages.confirmApproving)) {
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

  BindUnapprovementEvents() {
    this.$unApproveButton.click(this.UnapproveSelectedAnswers.bind(this));
  }
  async UnapproveSelectedAnswers() {
    let rows = this.UnapprovableRows();

    if (rows.length == 0) {
      this.ShowSelectContentWarning();
    } else {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.userContent.notificationMessages.confirmUnapproving)) {
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

  BindCorrectionEvents() {
    this.$correctionButton.click(this.ToggleReportForCorrectionSection.bind(this));
    this.$reportButton.click(this.ReportSelectedAnswersForCorrection.bind(this));
  }
  async ReportSelectedAnswersForCorrection() {
    let rows = this.DeletableRows();

    if (rows.length == 0) {
      this.ShowSelectContentWarning();
    } else {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.userContent.notificationMessages.confirmReporting)) {
        let postData = {
          reason: this.$correctionReason.val(),
        };
        console.log(postData);

        rows.forEach(row => this.Row_ReportAnswerForCorrection(row, { ...postData }));
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

  BindModerateEvents() {
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
