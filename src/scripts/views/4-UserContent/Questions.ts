import Action, { RemoveQuestionReqDataType } from "@BrainlyAction";
import UserContent from "./_/UserContent";

class Questions extends UserContent {
  postData: RemoveQuestionReqDataType;

  constructor() {
    super("Questions");
  }

  InitQuestions() {
    this.RenderCheckboxes();
    this.RenderButtonContainer();
    this.RenderCopyLinksButton();

    if (
      System.checkUserP(14) &&
      System.data.Brainly.userData.user.id !== Number(sitePassedParams[0])
    ) {
      this.RenderDeleteSection("question");
      this.ShowDeleteSection();
      this.BindHandlers();
    }
  }

  BindHandlers() {
    this.$deleteButton.on("click", this.DeleteSelectedQuestions.bind(this));
  }

  async DeleteSelectedQuestions() {
    const rows = this.DeletableRows();

    if (rows.length === 0) {
      this.ShowSelectContentWarning();
    } else if (this.deleteSection.selectedReason) {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        this.postData = {
          model_id: undefined,
          reason_id: this.deleteSection.selectedReason.id,
          // @ts-expect-error
          reason_title: this.deleteSection.selectedReason.title,
          reason: this.deleteSection.reasonText,
          give_warning: this.deleteSection.giveWarning,
          take_points: this.deleteSection.takePoints,
          return_points: this.deleteSection.returnPoints,
        };

        rows.forEach(this.Row_DeleteQuestion.bind(this));
      }
    }
  }

  async Row_DeleteQuestion(row) {
    if (row.deleted) {
      row.Deleted();
    } else {
      const postData = {
        ...this.postData,
        model_id: row.element.questionID,
      };

      row.ShowSpinner();

      const resRemove = await new Action().RemoveQuestion(postData);

      new Action().CloseModerationTicket(row.element.questionID);

      row.CheckDeleteResponse(resRemove);
    }
  }
}

// eslint-disable-next-line no-new
new Questions();
