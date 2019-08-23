import WaitForElement from "../../../helpers/WaitForElement";
import DeleteSection from "../../../components/DeleteSection";
import UserContentRow from "./UserContentRow";
import Button from "../../../components/Button";

class UserContent {
  /**
   * @param {string} caller
   */
  constructor(caller) {
    this.caller = caller;
    this.questions = {};
    this.selectedInputs = [];

    this.selectors = {
      table: "#content-old > div > div > table",
      tableHeaderRow: "> thead > tr",
      tableContentBody: "> tbody:first",
      contentRows: "> tbody > tr:not(.moderate)",
      contentLinks: "> tbody > tr:not(.moderate) > td > a"
    }

    this.Init();
  }
  async Init() {
    this.table = await WaitForElement(this.selectors.table);
    //this.checkboxes = new Checkboxes();
    /**
     * @type {UserContentRow[]}
     */
    this.rows = [];

    $(this.table).prop("that", this);
    this.LookupContents();
    this.RenderModerationSection();
    this.RenderSelectContentWarning();
    this.BindPageCloseEvent();

    this[`Init${this.caller}`]();
  }
  LookupContents() {
    let $contentRows = $(this.selectors.contentRows, this.table);
    //this.$contentSelectCheckboxes = $('input[type="checkbox"]', $contentRows);

    $contentRows.each(this.LookupContent.bind(this));
  }
  async LookupContent(i, rowElement) {
    //$(rowElement).prop("that", new UserContentRow(this, i, rowElement));
    this.rows.push(new UserContentRow(this, i, rowElement));
  }
  async RenderSelectLabel() {
    let $tableHeaderRow = $(this.selectors.tableHeaderRow, this.table);

    $tableHeaderRow.prepend(`<th style="width: 5%;"><b>${System.data.locale.common.select}</b></th>`);
  }
  RenderModerationSection() {
    this.$moderateSection = $(`
		<div class="sg-content-box">
			<div class="sg-content-box__content">
				<div class="sg-content-box">
				</div>
			</div>
			<div class="sg-content-box__content sg-content-box__actions--spaced-top-large"> </div>
			<div class="sg-content-box__actions sg-content-box__actions--spaced-top sg-content-box__actions--spaced-bottom"> </div>
		</div>`);

    this.$moderateHeader = $(" > .sg-content-box__content:eq(0) > .sg-content-box", this.$moderateSection);
    this.$moderateContent = $("> .sg-content-box__content:eq(1)", this.$moderateSection);
    this.$moderateActions = $("> .sg-content-box__actions", this.$moderateSection);

    this.$moderateSection.insertAfter(this.table);
  }
  RenderSelectAllCheckbox() {
    this.$selectAllContainer = $(`
    <div class="sg-content-box__content sg-content-box__content--spaced-top-large sg-content-box__content--spaced-bottom-large">
      <div class="sg-label sg-label--secondary">
        <div class="sg-label__icon">
          <div class="sg-checkbox">
            <input type="checkbox" class="sg-checkbox__element" id="selectAll">
            <label class="sg-checkbox__ghost" for="selectAll">
              <svg class="sg-icon sg-icon--adaptive sg-icon--x10">
                <use xlink:href="#icon-check"></use>
              </svg>
            </label>
          </div>
        </div>
        <label class="sg-label__text" for="selectAll">${System.data.locale.common.selectAll}</label>
      </div>
    </div>`);

    this.$selectAll = $("input", this.$selectAllContainer);

    this.$selectAll.change(this.ToggleCheckboxSelectedState.bind(this));
    this.$selectAllContainer.appendTo(this.$moderateHeader);
  }
  ToggleCheckboxSelectedState() {
    this.rows.forEach(row => {
      if (!row.checkbox.disabled) {
        if (!row.checkbox.isBusy) {
          row.checkbox.checked = this.$selectAll.prop("checked");
        }
      }
    })
  }
  RenderSelectContentWarning() {
    this.$selectContentWarning = $(`<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--white">${System.data.locale.userContent.notificationMessages.selectAtLeastOneContent}</div>`);
  }
  BindPageCloseEvent() {
    window.addEventListener("beforeunload", () => {
      let rows = this.rows.filter(row => row.isBusy);

      if (rows.length > 0) {
        event.returnValue = "";

        event.preventDefault();
      }
    });
  }
  RenderDeleteSection(type) {
    this.deleteSection = new DeleteSection({ type });

    this.RenderDeleteButton();
  }
  RenderDeleteButton() {
    this.$deleteButton = Button({
      type: "destructive",
      size: "small",
      text: `${System.data.locale.common.delete} !`
    });
  }
  ToggleDeleteSection() {
    if (this.$deleteButton.is(":visible")) {
      this.HideDeleteSection();
    } else {
      this.ShowDeleteSection();
    }
  }
  ShowDeleteSection() {
    this.ClearActionsTab();
    this.deleteSection.$.appendTo(this.$moderateContent);
    this.$deleteButton.appendTo(this.$moderateActions);
  }
  HideDeleteSection() {
    this.HideElement(this.deleteSection.$);
    this.HideElement(this.$deleteButton);
  }
  RenderReportForCorrectionSection() {
    this.$correctionReasonContainer = $(`
		<div class="sg-content-box sg-content-box--spaced-top-xxlarge sg-content-box--spaced-bottom sg-content-box--full">
			<div class="sg-content-box__actions">
				<textarea class="sg-textarea sg-textarea--invalid sg-textarea--full-width" placeholder="${System.data.locale.userContent.askForCorrection.placeholder}"></textarea>
			</div>
			<div class="sg-content-box__actions"></div>
    </div>`);
    this.$reportButton = Button({
      type: "primary-blue",
      size: "small",
      text: System.data.locale.userContent.askForCorrection.ask
    });

    this.$correctionReason = $("textarea", this.$correctionReasonContainer);
    this.$reportButtonContainer = $(".sg-content-box__actions:nth-child(2)", this.$correctionReasonContainer);

    this.$reportButton.appendTo(this.$reportButtonContainer);
  }
  ToggleReportForCorrectionSection() {
    if (this.$correctionReasonContainer.is(":visible")) {
      this.HideReportForCorrectionSection();
    } else {
      this.ShowReportForCorrectionSection();
    }
  }
  HideReportForCorrectionSection() {
    this.HideElement(this.$correctionReasonContainer);
  }
  ShowReportForCorrectionSection() {
    this.ClearActionsTab();
    this.$correctionReasonContainer.appendTo(this.$moderateActions);
  }
  /**
   * @param {jQuery} $element
   */
  HideElement($element) {
    $element.appendTo("<div />");
  }
  ShowSelectContentWarning() {
    this.$selectContentWarning.insertAfter(this.table);
  }
  HideSelectContentWarning() {
    this.HideElement(this.$selectContentWarning);
  }
  DeletableRows() {
    return this.FilterRows();
  }
  ApprovableRows() {
    return this.FilterRows(false);
  }
  UnapprovableRows() {
    return this.FilterRows(true);
  }
  FilterRows(checkIsApproved) {
    return this.rows.filter(row => (
      !row.deleted &&
      row.checkbox.checked &&
      !row.checkbox.disabled &&
      (
        checkIsApproved === undefined ||
        (
          checkIsApproved === false &&
          (
            row.contents.answers[row.answerID].source.approved &&
            !row.contents.answers[row.answerID].source.approved.date
          ) ||
          checkIsApproved === true &&
          (
            row.contents.answers[row.answerID].source.approved &&
            row.contents.answers[row.answerID].source.approved.date
          )
        )
      )
    ));
  }
  RenderCheckboxes() {
    if (!this.$selectAllContainer) {
      this.RenderSelectLabel();
      this.RenderSelectAllCheckbox();
      this.RenderRowsSelectCheckbox();
    }
  }
  RenderRowsSelectCheckbox() {
    this.rows.forEach(this.RenderRowSelectCheckbox.bind(this));
  }
  RenderRowSelectCheckbox(row) {
    row.RenderCheckbox();
  }
  ClearActionsTab() {
    this.$moderateContent.html("");
    this.$moderateActions.html("");
  }
}

export default UserContent
