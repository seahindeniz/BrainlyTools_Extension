import ButtonDeprecated, { JQueryButtonElementType } from "@components/Button";
import DeleteSection, {
  DeleteSectionDeprecatedContentTypeType,
} from "@components/DeleteSection";
import notification from "@components/notification2";
import WaitForElement from "@root/helpers/WaitForElement";
import {
  ActionListHole,
  Button,
  Checkbox,
  Flex,
  Icon,
  Label,
} from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import UserContentRow from "./UserContentRow";

class UserContent {
  caller: string;
  questions: {
    [x: string]: any;
  };

  selectedInputs: any[];
  selectors: {
    table: string;
    tableHeaderRow: string;
    tableContentBody: string;
    contentRows: string;
    contentLinks: string;
  };

  table: HTMLElement;
  rows: UserContentRow[];
  $moderateSection: JQuery<HTMLElement>;
  $moderateHeader: JQuery<HTMLElement>;
  $moderateContent: JQuery<HTMLElement>;
  $moderateActions: JQuery<HTMLElement>;
  $selectContentWarning: JQuery<HTMLElement>;
  deleteSection: DeleteSection;
  $deleteButton: JQueryButtonElementType;
  $correctionReasonContainer: JQuery<HTMLElement>;
  $reportButton: JQueryButtonElementType;
  $correctionReason: JQuery<HTMLElement>;
  $reportButtonContainer: JQuery<HTMLElement>;
  $buttonContainer: any;
  $buttonList: JQuery<HTMLElement>;

  selectAllCheckBox: Checkbox;
  selectAllContainer: FlexElementType;

  constructor(caller: string) {
    this.caller = caller;
    this.questions = {};
    this.selectedInputs = [];

    this.selectors = {
      table: "#content-old > div > div > table",
      tableHeaderRow: "> thead > tr",
      tableContentBody: "> tbody:first",
      contentRows: "> tbody > tr:not(.moderate)",
      contentLinks: "> tbody > tr:not(.moderate) > td > a",
    };

    this.Init();
  }

  async Init() {
    this.table = await WaitForElement(this.selectors.table);
    /**
     * @type {UserContentRow[]}
     */
    this.rows = [];

    $(this.table).prop("that", this);
    this.ResizeTableColumns();
    this.LookupContents();
    this.RenderModerationSection();
    this.RenderSelectContentWarning();
    this.BindPageCloseHandler();

    this[`Init${this.caller}`]();

    window.addEventListener("resize", this.ResizeTableColumns.bind(this));
  }

  ResizeTableColumns() {
    const columns = this.table.querySelectorAll("th");

    columns.forEach((column, i) => {
      if (!column.dataset.initialWidth)
        column.dataset.initialWidth = column.style.width;

      if (window.innerWidth > 1366)
        column.style.width = column.dataset.initialWidth || column.style.width;
      else if (i !== (columns.length === 5 ? 2 : 1)) column.style.width = "";
      else column.style.width = "100%";
    });
  }

  LookupContents() {
    const $contentRows = $(this.selectors.contentRows, this.table);
    // this.$contentSelectCheckboxes = $('input[type="checkbox"]', $contentRows);

    $contentRows.each(this.LookupContent.bind(this));
  }

  async LookupContent(i, rowElement) {
    // $(rowElement).prop("that", new UserContentRow(this, i, rowElement));
    this.rows.push(new UserContentRow(this, i, rowElement));
  }

  async RenderSelectLabel() {
    const $tableHeaderRow = $(this.selectors.tableHeaderRow, this.table);

    $tableHeaderRow.prepend(
      `<th style="width: 5%;"><b>${System.data.locale.common.select}</b></th>`,
    );
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

    this.$moderateHeader = $(
      " > .sg-content-box__content:eq(0) > .sg-content-box",
      this.$moderateSection,
    );
    this.$moderateContent = $(
      "> .sg-content-box__content:eq(1)",
      this.$moderateSection,
    );
    this.$moderateActions = $(
      "> .sg-content-box__actions",
      this.$moderateSection,
    );

    this.$moderateSection.insertAfter(this.table);
  }

  RenderSelectAllCheckbox() {
    this.selectAllCheckBox = new Checkbox({ id: null });
    this.selectAllContainer = Flex({
      marginTop: "m",
      marginBottom: "xxs",
      children: new Label({
        tag: "label",
        children: System.data.locale.common.selectAll,
        icon: this.selectAllCheckBox.element,
        onChange: this.ChangeCheckboxSelection.bind(this),
      }),
    });

    this.$moderateHeader.append(this.selectAllContainer);
  }

  ChangeCheckboxSelection() {
    this.rows.forEach(row => {
      if (row.isBusy) return;

      row.checkbox.input.checked = this.selectAllCheckBox.input.checked;
    });
  }

  RenderSelectContentWarning() {
    this.$selectContentWarning = $(
      `<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--white">${System.data.locale.userContent.notificationMessages.selectAtLeastOneContent}</div>`,
    );
  }

  BindPageCloseHandler() {
    window.addEventListener("beforeunload", event => {
      const rows = this.rows.filter(row => row.isBusy);

      if (rows.length > 0) {
        event.returnValue = "";

        event.preventDefault();
      }
    });
  }

  RenderDeleteSection(
    type?: DeleteSectionDeprecatedContentTypeType,
    hideReasons?: DeleteSectionDeprecatedContentTypeType[],
  ) {
    this.deleteSection = new DeleteSection({ type, hideReasons });

    this.RenderDeleteButton();
  }

  RenderDeleteButton() {
    this.$deleteButton = ButtonDeprecated({
      type: "solid-peach",
      size: "small",
      text: `${System.data.locale.common.delete} !`,
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
    if (this.deleteSection) {
      this.ClearActionsTab();
      this.deleteSection.$.appendTo(this.$moderateContent);
      this.$deleteButton.appendTo(this.$moderateActions);
    }
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
    this.$reportButton = ButtonDeprecated({
      type: "solid-blue",
      size: "small",
      text: System.data.locale.userContent.askForCorrection.ask,
    });

    this.$correctionReason = $("textarea", this.$correctionReasonContainer);
    this.$reportButtonContainer = $(
      ".sg-content-box__actions:nth-child(2)",
      this.$correctionReasonContainer,
    );

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
   * @param {JQuery<HTMLElement>} $element
   */
  // eslint-disable-next-line class-methods-use-this
  HideElement($element) {
    if (!$element) return;

    if ($element instanceof HTMLElement) {
      if ($element.parentElement) $element.parentElement.removeChild($element);

      return;
    }

    $element.appendTo("<div />");
  }

  ShowSelectContentWarning() {
    this.$selectContentWarning.insertAfter(this.table);
  }

  HideSelectContentWarning() {
    this.HideElement(this.$selectContentWarning);
  }

  RemovableRows() {
    return this.FilterRows();
  }

  ApprovableRows() {
    return this.FilterRows(false);
  }

  UnapprovableRows() {
    return this.FilterRows(true);
  }

  FilterRows(checkIsApproved?: boolean) {
    /* return this.rows.filter(
      row =>
        !row.isBusy &&
        !row.deleted &&
        row.checkbox.input.checked &&
        (checkIsApproved === undefined ||
          (checkIsApproved === false &&
            // @ts-expect-error
            row.contents.answers[row.answerID].source.approved &&
            // @ts-expect-error
            !row.contents.answers[row.answerID].source.approved.date) ||
          (checkIsApproved === true &&
            // @ts-expect-error
            row.contents.answers[row.answerID].source.approved &&
            // @ts-expect-error
            row.contents.answers[row.answerID].source.approved.date)),
    ); */
    return this.rows.filter(row => {
      const source = row.contents.answers[row?.answerID]?.source;

      return (
        !row.isBusy &&
        !row.deleted &&
        row.checkbox.input.checked &&
        (checkIsApproved === undefined ||
          ("approved" in source &&
            ((checkIsApproved === false &&
              source.approved &&
              !source.approved.date) ||
              (checkIsApproved === true &&
                source.approved &&
                source.approved.date))))
      );
    });
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

  RenderCheckboxes() {
    if (!this.selectAllContainer) {
      this.RenderSelectLabel();
      this.RenderSelectAllCheckbox();
      this.RenderToggleAllButton();
      this.RenderRowsSelectCheckbox();
    }
  }

  RenderToggleAllButton() {
    const container = Flex({
      marginBottom: "m",
      children: new Button({
        type: "outline",
        toggle: "blue",
        size: "xs",
        children: System.data.locale.common.toggleSelections,
        onClick: this.ToggleCheckboxSelection.bind(this),
      }),
    });

    this.$moderateHeader.append(container);
  }

  ToggleCheckboxSelection() {
    this.rows.forEach(row => {
      if (row.isBusy) return;

      row.checkbox.input.checked = !row.checkbox.input.checked;
    });
  }

  RenderRowsSelectCheckbox() {
    this.rows.forEach(this.RenderRowSelectCheckbox.bind(this));
  }

  // eslint-disable-next-line class-methods-use-this
  RenderRowSelectCheckbox(row) {
    row.RenderCheckbox();
  }

  ClearActionsTab() {
    this.HideDeleteSection();
    this.HideReportForCorrectionSection();
  }

  RenderCopyLinksButton() {
    const copyLinksButtonContainer = ActionListHole({
      children: new Button({
        type: "solid-light",
        children: System.data.locale.userContent.copyQuestionLinks,
        icon: new Icon({
          type: "clipboard",
        }),
        onClick: this.CopyQuestionLinksOfSelectedRows.bind(this),
      }),
    });

    this.$buttonList.append(copyLinksButtonContainer);
  }

  async CopyQuestionLinksOfSelectedRows() {
    const links = this.rows
      .filter(row => row.checkbox.input.checked)
      .map(row => row.questionLinkAnchor.href);

    if (links.length === 0) {
      notification({
        type: "info",
        text:
          System.data.locale.userContent.notificationMessages
            .selectAtLeastOneContent,
      });

      return;
    }

    await navigator.clipboard.writeText(links.join("\n"));

    notification({
      type: "success",
      text: System.data.locale.common.copied,
    });
  }
}

export default UserContent;
