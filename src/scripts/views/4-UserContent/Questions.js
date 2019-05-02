import UserContent from "./_/UserContent";
import Action from "../../controllers/Req/Brainly/Action";

class Questions extends UserContent {
  constructor() {
    super("Questions");
  }
  InitQuestions() {
    this.RenderCheckboxes();
    this.RenderDeleteSection("task");
    this.ShowDeleteSection();
    this.BindEvents();
  }
  BindEvents() {
    this.$deleteButton.click(this.DeleteSelectedQuestions.bind(this));
  }
  async DeleteSelectedQuestions() {
    let rows = this.DeletableRows();

    if (rows.length == 0) {
      this.ShowSelectContentWarning();
    } else if (this.deleteSection.selectedReason) {
      this.HideSelectContentWarning();
      await System.Delay(50);

      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        this.postData = {
          reason_id: this.deleteSection.selectedReason.id,
          reason: this.deleteSection.reasonText,
          give_warning: this.deleteSection.giveWarning,
          take_points: this.deleteSection.takePoints,
          return_points: this.deleteSection.returnPoints
        };

        rows.forEach(this.Row_DeleteQuestion.bind(this));
      }
    }
  }
  async Row_DeleteQuestion(row) {
    if (row.deleted) {
      row.Deleted();
    } else {
      let postData = {
        ...this.postData,
        model_id: row.element.questionID
      }

      row.checkbox.ShowSpinner();

      let resRemove = await new Action().RemoveQuestion(postData);

      row.CheckDeleteResponse(resRemove);
    }
  }
}

new Questions();
