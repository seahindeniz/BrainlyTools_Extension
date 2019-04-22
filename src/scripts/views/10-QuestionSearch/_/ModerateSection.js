import DeleteSection from "../../../components/DeleteSection";
import notification from "../../../components/notification";
import { RemoveQuestion } from "../../../controllers/ActionsOfBrainly";

class ModerateSection {
  /**
   * @param {import("../index").QuestionSearch} main
   */
  constructor(main) {
    this.main = main;

    this.Render();
    this.ResetCounter();
    this.RenderStopButton();
    this.RenderCounterLabel();
    this.RenderDeleteSection();
    this.BindEvents();

    if (System.checkUserP(26)) {
      this.RenderDeleteNButton();
      this.BindDeleteNHandler();
    }
  }
  ResetCounter() {
    this.counter = {
      n: 0,
      max: 0
    };
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
          <div class="sg-actions-list sg-actions-list--space-between">
            <div class="sg-actions-list__hole">
              <div class="sg-spinner-container">
                <button class="sg-button-secondary sg-button-secondary--peach">${System.data.locale.common.delete}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`);

    this.$selectAll = $("input", this.$);
    this.$deleteButton = $("button", this.$);
    this.$deleteButtonSpinner = this.RenderSpinner();
    this.$deleteButtonSpinnerContainer = this.$deleteButton.parent();
    this.$deleteButtonContainer = this.$deleteButtonSpinnerContainer.parent();
    this.$deleteSectionContainer = $(".sg-content-box__content:eq(1)", this.$);
  }
  Show() {
    this.$paginationContainer = $("> .sg-content-box__content:eq(2)", this.main.element);
    this.$pagination = $(`[data-test="pagination"]`, this.$paginationContainer);

    if (this.$pagination.length == 0)
      return console.error("Pagination cannot be found");

    this.$.insertAfter(this.$paginationContainer);
    this.$selectAll.prop("checked", false);
  }
  RenderSpinner(isLight) {
    return $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--xsmall${isLight?" sg-spinner--light":""}"></div>
    </div>`);
  }
  RenderStopButton() {
    this.$stopButtonContainer = $(`
    <div class="sg-actions-list__hole">
      <div class="sg-spinner-container">
        <button class="sg-button-secondary sg-button-secondary--active-inverse">
          <div class="sg-label sg-label--secondary sg-label--unstyled">
            <label class="sg-label__text">${System.data.locale.common.stop}</label>
          </div>
        </button>
      </div>
    </div>`);

    this.$stopButtonSpinner = this.RenderSpinner();
    this.$stopButton = $("button", this.$stopButtonContainer);
    this.$stopButtonSpinnerContainer = $(".sg-spinner-container", this.$stopButtonContainer);
  }
  RenderCounterLabel() {
    this.$counterLabelContainer = $(`
    <div class="sg-actions-list__hole">
      <div class="sg-label sg-label--small sg-label--secondary">
        <div class="sg-label__icon">
          <div class="sg-icon sg-icon--gray-secondary sg-icon--x14"><svg class="sg-icon__svg">
              <use xlink:href="#icon-lightning"></use>
            </svg></div>
        </div>
        <div class="sg-text sg-text--small sg-text--gray-secondary sg-text--bold"></div>
      </div>
    </div>`);

    this.$counter = $(".sg-text", this.$counterLabelContainer);

    this.UpdateCounterNumbers(0, 0);
  }
  UpdateCounterNumbers() {
    this.$counter.text(`${this.counter.n}/${this.counter.max}`)
  }
  RenderDeleteSection() {
    this.deleteSection = new DeleteSection("task");

    this.deleteSection.$.appendTo(this.$deleteSectionContainer);
  }
  BindEvents() {
    this.$stopButton.click(this.HideStopButton.bind(this));
    this.$selectAll.click(this.ToggleCheckboxes.bind(this));
    this.$deleteButton.click(this.DeleteSelectedQuestionsFromCurrentPage.bind(this));
  }
  async HideStopButton(event) {
    this.EnableDeleteButtons();

    if (event) {
      this.$stopButtonSpinner.appendTo(this.$stopButtonSpinnerContainer);
      await System.Delay(600);
    }

    this.HideElement(this.$stopButtonSpinner);
    this.HideElement(this.$stopButtonContainer);
    this.HideDeleteButtonSpinner();
    this.HideDeleteNButtonSpinner();
  }
  EnableDeleteButtons() {
    this.EnableButton(this.$deleteButton);
    this.EnableButton(this.$deleteNButton);
  }
  EnableButton($button) {
    if (!$button) return;

    $button.prop("disabled", false)
    $button.removeClass("sg-button-primary--disabled");
  }
  HideElement($element) {
    if (!$element) return;

    $element.appendTo("<div />");
  }
  ShowDeleteButtonSpinner() {
    this.$deleteButtonSpinner.appendTo(this.$deleteButtonSpinnerContainer);
  }
  HideDeleteButtonSpinner() {
    this.HideElement(this.$deleteButtonSpinner);
  }
  ShowDeleteNButtonSpinner() {
    this.$deleteNButtonSpinner.appendTo(this.$deleteNButtonSpinnerContainer);
  }
  HideDeleteNButtonSpinner() {
    this.HideElement(this.$deleteNButtonSpinner);
  }
  ToggleCheckboxes() {
    $.each(this.main.questionBoxs, (id, questionBox) => {
      if (!questionBox.deleted && questionBox.$checkBox.is(":visible"))
        questionBox.$checkBox.prop("checked", this.$selectAll.prop("checked"));
    });
    this.UpdateDeleteNButtonNumber();
  }
  DeleteSelectedQuestionsFromCurrentPage() {
    this.idList = this.SelectedQuestions(true);

    let isConfirmed = this.DeleteQuestions();

    if (isConfirmed)
      this.ShowDeleteButtonSpinner();
  }
  SelectedQuestions(fromCurrentPage = false) {
    let idList = [];
    let query = ":checked";

    if (fromCurrentPage)
      query += ":visible";

    $.each(this.main.questionBoxs, (id, questionBox) => {
      if (questionBox.$checkBox.is(query) && !questionBox.deleted)
        idList.push(~~id);
    });

    return idList;
  }
  DeleteQuestions() {
    if (this.idList.length == 0) {
      notification(System.data.locale.userContent.notificationMessages.selectAtLeasetOneContent, "error")
    } else if (this.deleteSection.selectedReason) {
      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        this.postData = {
          reason_id: this.deleteSection.selectedReason.id,
          reason: this.deleteSection.reasonText,
          give_warning: this.deleteSection.giveWarning,
          take_points: this.deleteSection.takePoints,
          return_points: this.deleteSection.returnPoints
        };

        this.ResetCounter();

        this.counter.max = this.idList.length;

        this.ShowCounter();
        this.UpdateCounterNumbers();
        this.ShowStopButton();
        this.StartDeleting();
        this._loop = setInterval(this.StartDeleting.bind(this), 1000);

        return true;
      }
    }
  }
  ShowCounter() {
    this.$counterLabelContainer.insertAfter(this.$deleteButtonContainer);
  }
  ShowStopButton() {
    this.DisableDeleteButtons();
    this.$stopButtonContainer.insertAfter(this.$deleteButtonContainer);
  }
  DisableDeleteButtons() {
    this.DisableButton(this.$deleteButton);
    this.DisableButton(this.$deleteNButton);
  }
  DisableButton($button) {
    if (!$button) return;

    $button.prop("disabled", true)
    $button.addClass("sg-button-primary--disabled");
  }
  StartDeleting() {
    for (let i = 0; i < 5; i++) {
      let questionId = this.idList.shift();

      if (!questionId)
        this.StopDeleting();
      else
        this.DeleteQuestion(questionId);
    }
  }
  StopDeleting() {
    clearInterval(this._loop);
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
    questionBox.$checkBox.addClass("sg-button-secondary--disabled");

    let resRemove = await RemoveQuestion(postData);

    this.counter.n++;
    this.UpdateCounterNumbers();

    questionBox.HideSpinner();

    if (!resRemove || !resRemove.success) {
      questionBox.deleted = false;

      questionBox.$.addClass("warning");
      questionBox.$checkBox.prop("disabled", false);
      notification(`#${model_id} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`, "error");
    } else {
      questionBox.Deleted();

      if (this.counter.n == this.counter.max) {
        this.HideStopButton();
        this.UpdateDeleteNButtonNumber();
      }
    }
  }
  RenderDeleteNButton() {
    this.$deleteNButtonContainer = $(`
    <div class="sg-actions-list__hole">
      <div class="sg-spinner-container">
        <button class="sg-button-secondary sg-button-secondary--peach"></button>
      </div>
    </div>`);

    this.$deleteNButtonSpinner = this.RenderSpinner();
    this.$deleteNButton = $("button", this.$deleteNButtonContainer);
    this.$deleteNButtonSpinnerContainer = $(".sg-spinner-container", this.$deleteNButtonContainer);

    this.ChangeDeleteNButtonNumber();
    this.$deleteNButtonContainer.insertAfter(this.$deleteButtonContainer)
  }
  ChangeDeleteNButtonNumber(n = 0) {
    if (!this.$deleteNButton) return;

    this.$deleteNButton.text(System.data.locale.common.deleteN.replace("%{number_of_contents}", n));
  }
  BindDeleteNHandler() {
    this.$deleteNButton.click(this.DeleteAllSelectedQuestions.bind(this));
  }
  DeleteAllSelectedQuestions() {
    this.idList = this.SelectedQuestions();

    let isConfirmed = this.DeleteQuestions();

    if (isConfirmed)
      this.ShowDeleteNButtonSpinner();
  }
  UpdateDeleteNButtonNumber() {
    let idList = this.SelectedQuestions();

    this.ChangeDeleteNButtonNumber(idList.length);
  }
}

export default ModerateSection
