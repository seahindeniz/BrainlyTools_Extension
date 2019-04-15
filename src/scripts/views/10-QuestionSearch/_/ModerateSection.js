import DeleteSection from "../../../components/DeleteSection";
import notification from "../../../components/notification";
import { RemoveQuestion } from "../../../controllers/ActionsOfBrainly";

class ModerateSection {
  constructor(main) {
    this.main = main;
    this.$paginationContainer = $("> .sg-content-box__content:eq(2)", this.main.element);
    this.$pagination = $(`[data-test="pagination"]`, this.$paginationContainer);

    if (this.$pagination.length == 0)
      return console.error("Pagination cannot be found");

    this.Render();
    this.RenderDeleteSection();
    this.BindEvents();
  }
  Render() {
    this.$ = $(`
    <div class="sg-content-box__content sg-content-box__content--spaced-bottom-xlarge">
      <div class="sg-content-box">
        <div class="sg-content-box__content">
          <div class="sg-label sg-label--secondary">
            <div class="sg-label__icon">
              <div class="sg-checkbox">
                <input type="checkbox" class="sg-checkbox__element" id="q-${this.id}">
                <label class="sg-checkbox__ghost" for="q-${this.id}">
                  <div class="sg-icon sg-icon--adaptive sg-icon--x10">
                    <svg class="sg-icon__svg">
                      <use xlink:href="#icon-check"></use>
                    </svg>
                  </div>
                </label>
              </div>
            </div>
            <label class="sg-label__text" for="q-${this.id}">${System.data.locale.common.selectAll}</label>
          </div>
        </div>
        <div class="sg-content-box__content"></div>
        <div class="sg-content-box__actions">
          <button class="sg-button-secondary sg-button-secondary--peach">${System.data.locale.common.delete}</button>
        </div>
      </div>
    </div>`);

    this.$selectAll = $("input", this.$);
    this.$deleteButton = $("button", this.$);
    this.$deleteSectionContainer = $(".sg-content-box__content:eq(1)", this.$);

    this.$.insertAfter(this.$paginationContainer);
  }
  RenderDeleteSection() {
    this.deleteSection = new DeleteSection(System.data.Brainly.deleteReasons.task, "task");

    this.deleteSection.$.appendTo(this.$deleteSectionContainer);
  }
  BindEvents() {
    this.$selectAll.click(this.ToggleCheckboxes.bind(this));
    this.$deleteButton.click(this.DeleteQuestions.bind(this));
  }
  ToggleCheckboxes() {
    $.each(this.main.questionBoxs, (id, questionBox) => {
      if (!questionBox.deleted)
        questionBox.$checkBox.prop("checked", this.$selectAll.prop("checked"));
    });
  }
  DeleteQuestions() {
    let idList = this.SelectedQuestion();

    if (idList.length == 0) {
      notification(System.data.locale.userContent.notificationMessages.selectAtLeasetOneContent, "error")
    } else if (!this.deleteSection.selectedReason) {
      this.deleteSection.ShowReasonWarning();
    } else {
      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        this.postData = {
          reason_id: this.deleteSection.selectedReason.id,
          reason: this.deleteSection.reasonText,
          give_warning: this.deleteSection.giveWarning,
          take_points: this.deleteSection.takePoints,
          return_points: this.deleteSection.returnPoints
        };

        idList.forEach(this.DeleteQuestion.bind(this));
      }
    }
  }
  SelectedQuestion() {
    let idList = [];

    $.each(this.main.questionBoxs, (id, questionBox) => {
      if (questionBox.$checkBox.is(":checked") && !questionBox.deleted)
        idList.push(~~id);
    });

    return idList;
  }
  async DeleteQuestion(model_id) {
    let questionBox = this.main.questionBoxs[model_id];
    let postData = {
      ...this.postData,
      model_id
    };
    questionBox.deleted = true;

    questionBox.ShowSpinner();
    questionBox.$checkBox.prop("disabled", true);

    let resRemove = await RemoveQuestion(postData);

    questionBox.HideSpinner();

    if (!resRemove || !resRemove.success) {
      questionBox.deleted = false;

      questionBox.$.addClass("warning");
      questionBox.$checkBox.prop("disabled", false);
      notification(`#${model_id} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`, "error");
    } else {
      questionBox.$.addClass("deleted");
    }
  }
}

export default ModerateSection
