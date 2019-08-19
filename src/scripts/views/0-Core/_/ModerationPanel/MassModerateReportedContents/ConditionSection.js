import template from "backtick-template";
import moment from "moment-timezone";
import Button from "../../../../../components/Button";
import DeleteSection from "../../../../../components/DeleteSection";
import RadioSection from "../../../../../components/DeleteSection/RadioSection";
import Action from "../../../../../controllers/Req/Brainly/Action";
import ContentType from "./Filters/ContentType";
import DateRange from "./Filters/DateRange";
import ReportReasonText from "./Filters/ReportReasonText";
import UserId from "./Filters/UserId";
import templateFilterContainer from "./templates/FilterContainer.html";
import templateFilterSelectCard from "./templates/FilterSelectCard.html";
import templateFooter from "./templates/Footer.html";
import templateReportBox from "./templates/ReportBox.html";

let System = require("../../../../../helpers/System");

String.prototype.template = template.asMethod;

const CONTENT_TYPES = {
  QUESTION: 1,
  ANSWER: 2
}

class ConditionSection {
  /**
   * @param {import("./index").default} main
   * @param {string} text
   * @param {string} title
   * @param {{isCommon: boolean}} options
   */
  constructor(main, text, title = "", options = {}) {
    this.main = main;
    this.text = text;
    this.title = title;
    this.options = options;
    this.confirmedCount = 0;
    this.filteredReports = [];
    this.moderatingStarted = false;
    this.activeModerateConnectionCount = 0;
    this.openedModerateConnections = [];
    /**
     * @type {"confirm"|"delete"}
     */
    this.actionType;
    /**
     * @type {"QUESTION"|"ANSWER"}
     */
    this.contentType;

    if (typeof System == "function")
      System = System();

    this.RenderSection();
    this.RenderActionTypes();
    this.RenderFooter();
    this.RenderCounterText();
    this.RenderCounterTextSpinner();
    this.RenderCounterTextCheckIcon();
    this.RenderActionButtonsContainer();
    this.RenderActionButtonSpinner();
    this.RenderStartButton();
    this.RenderStopButton();
    this.RenderReportsContainer();
    this.RenderSectionCard();
    this.RenderConditionsContainer();
    this.BindHandlers();
  }
  RenderSection() {
    this.$section = $(`
		<div class="sg-box sg-box--full sg-box--no-padding sg-box--spaced-bottom-large sg-box--light-border">
			<div class="sg-box__hole">
				<div class="sg-content-box sg-content-box__content--full">
					<div class="sg-content-box__content"></div>
					<div class="sg-content-box__actions sg-content-box__actions--spaced-top sg-content-box__actions--spaced-bottom" style="padding: 0.5em 1em;"></div>
				</div>
			</div>
    </div>`);

    this.$header = $(".sg-content-box__content:nth-child(1)", this.$section);
    this.$actionTypeContainer = $(".sg-content-box__actions:nth-child(2)", this.$section);

    if (this.options.isCommon)
      this.$section.addClass("is-common")
  }
  RenderActionTypes() {
    let sectionData = {
      name: "action",
      warning: System.data.locale.core.notificationMessages.youNeedToChooseActionType,
      changeHandler: this.ChangeActionType.bind(this),
      noHorizontalSeparator: true,
      items: []
    };

    ["confirm", "delete"].forEach(id => {
      sectionData.items.push({
        id,
        label: System.data.locale.common[id]
      });
    })

    this.actionTypeSection = new RadioSection(sectionData);

    this.actionTypeSection.$.appendTo(this.$actionTypeContainer);
  }
  RenderFooter() {
    this.$footer = $(templateFooter.template());

    this.$footerActionList = $("> .sg-content-box > .sg-content-box__content > .sg-actions-list", this.$footer);
    this.$matchedButtonContainer = $("> .sg-actions-list__hole", this.$footerActionList);
    this.$matchedButton = Button({
      type: "primary-blue",
      size: "small",
      icon: {
        type: "lightning"
      },
      text: this.ReplaceMatchedTextString()
    });
    this.$matchedReportsCount = $("b", this.$matchedButton);

    this.$matchedButton.appendTo(this.$matchedButtonContainer);

    if (!this.options.isCommon)
      this.ShowFooter();
  }
  RenderCounterText() {
    this.$counterTextContainer = $(`
    <div class="sg-actions-list__hole">
      <div class="sg-label sg-label--small sg-label--secondary">
        <div class="sg-text sg-text--small sg-text--gray-secondary sg-text--bold">
          <span></span>
          <b></b>
        </div>
      </div>
    </div>`);

    this.$counterTextLabel = $("> .sg-label", this.$counterTextContainer);
    this.$counterTextLabelText = $("> .sg-text > span", this.$counterTextLabel);
    this.$counterTextNumber = $("> .sg-text > b", this.$counterTextLabel);
  }
  RenderCounterTextSpinner() {
    this.$counterTextSpinner = $(`
    <div class="sg-spinner-container">
      <div style="width: 25px;"></div>
      <div class="sg-spinner-container__overlay">
        <div class="sg-spinner sg-spinner--xxsmall"> </div>
      </div>
    </div>`);
  }
  RenderCounterTextCheckIcon() {
    this.$counterTextCheckIcon = $(`
    <div class="sg-label__icon">
      <div class="sg-icon sg-icon--mint sg-icon--x14">
        <svg class="sg-icon__svg">
          <use xlink:href="#icon-check"></use>
        </svg>
      </div>
    </div>`);
  }
  ShowFooter() {
    this.$footer.insertAfter(this.$actionTypeContainer);
  }
  RenderActionButtonsContainer() {
    this.$actionButtonsContainer = $(`
    <div class="sg-actions-list__hole">
      <div class="sg-spinner-container">
      </div>
    </div>`);

    this.$actionButtonsSpinnerContainer = $("> .sg-spinner-container", this.$actionButtonsContainer);
  }
  RenderActionButtonSpinner() {
    this.$actionButtonsSpinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`);
  }
  RenderStartButton() {
    this.$startButton = Button({
      type: "primary-mint",
      size: "small",
      text: System.data.locale.common.start
    });
  }
  RenderStopButton() {
    this.$stopButton = Button({
      type: "destructive",
      size: "small",
      text: System.data.locale.common.stop
    });
  }
  RenderReportsContainer() {
    this.$reportsContainerSection = $(`
    <div class="sg-content-box">
      <div class="sg-content-box__content" style="padding: 1em 1.5em;"> </div>
    </div>`);
    this.$reportsContainer = $("> .sg-content-box__content", this.$reportsContainerSection);
  }
  ReplaceMatchedTextString() {
    let matchedText = System.data.locale.core.massModerateReportedContents.matched.match(/(.*)(\%{.*})+$|(\%{.*})(.*)+$/);
    let text = System.data.locale.core.massModerateReportedContents.matched.replace("%{number_of_matched_reports}", "<b>0</b>");

    if (matchedText.length > 3) {
      matchedText = matchedText.filter(Boolean);

      if (matchedText[1].indexOf("%") >= 0) {
        text = matchedText[1].replace("%{number_of_matched_reports}", `<b>0</b>`) + matchedText[2];
      } else {
        text = matchedText[1] + matchedText[2].replace("%{number_of_matched_reports}", `<b>0</b>`);
      }
    }

    return text;
  }
  RenderSectionCard() {
    this.$sectionCard = $(`
		<div class="sg-card sg-card--vertical sg-card--full sg-card--padding-small sg-card--no-border">
			<div class="sg-card__hole sg-card__hole--lavender-secondary-light">
				<div class="sg-text sg-text--container" title="${this.title}">${this.text}</div>
        <div class="sg-horizontal-separator sg-horizontal-separator--short-spaced"></div>
			</div>
    </div>`).appendTo(this.$header);

    this.$conditionsContainerSection = $(".sg-card__hole", this.$sectionCard);

    if (!this.options.isCommon)
      this.$sectionCard.addClass("sg-card--no-bottom-radius");

    this.RenderClose();
    this.RenderFilterSelectCard();
  }
  RenderConditionsContainer() {
    this.$conditionsContainerBox = $(`
    <div class="sg-content-box">
      <div class="sg-content-box__actions"></div>
    </div>`);
    this.$conditionsContainer = $(".sg-content-box__actions", this.$conditionsContainerBox);
  }
  RenderFilterSelectCard() {
    this.$filtersSelectContainer = $(templateFilterSelectCard.template()).appendTo(this.$sectionCard);

    this.$filterSelect = $("select", this.$filtersSelectContainer);

    this.RenderFilterContainer();
    this.RenderRegexpButton();
  }
  RenderFilterContainer() {
    this.$filterContainer = $(templateFilterContainer.template());

    this.$filterWrapper = $("> .sg-actions-list__hole:nth-child(1)", this.$filterContainer);
    this.$buttonContainer = $("> .sg-actions-list__hole:nth-child(2)", this.$filterContainer);
    this.$addFilterButton = Button({
      type: "primary-blue",
      size: "small",
      icon: {
        type: "check"
      }
    });

    this.$addFilterButton.appendTo(this.$buttonContainer);
  }
  RenderRegexpButton() {
    this.$regexpButton = Button({
      type: "primary",
      size: "small",
      title: System.data.locale.core.massModerateReportedContents.regexp,
      text: ".*",
      spaced: {
        bottom: {
          small: true
        }
      }
    });
  }
  RenderClose() {
    if (!this.options.isCommon) {
      this.$close = $(`
			<div class="sg-toplayer__close sg-toplayer__close--spaced-small">
				<svg class="sg-icon sg-icon--gray-secondary sg-icon--x14">
					<use xlink:href="#icon-x"></use>
				</svg>
			</div>`).prependTo(this.$sectionCard);
    }
  }
  BindHandlers() {
    this.$close && this.$close.click(this.RemoveSection.bind(this));
    this.$regexpButton.click(this.ToggleDarkButton.bind(this));
    this.$filterSelect.change(this.UpdateFilterValueContainer.bind(this));
    this.$addFilterButton.click(this.AddFilterButtonClicked.bind(this));
    this.$conditionsContainer.on("click", ".sg-box", this.RemoveCondition.bind(this));
    this.$matchedButton.click(this.ToggleReports.bind(this));
    this.$startButton.click(this.StartModerating.bind(this));
    this.$stopButton.click(this.StopModerating.bind(this));
  }
  RemoveSection() {
    if (
      !this.moderatingStarted ||
      confirm(System.data.locale.core.notificationMessages.stillProcessing)
    ) {
      this.StopModerating();
      this.$section.remove();
      this.main.ToggleActionButtons();
    }
  }
  ToggleDarkButton() {
    this.$regexpButton.ToggleType("primary-blue");
  }
  UpdateFilterValueContainer() {
    let value = this.$filterSelect.val();
    let $selectedOption = $(":selected", this.$filterSelect);
    let $filterSelectParent = this.$filterSelect.parents(".sg-select");

    this.HideRegexpButton();
    this.$filterSelect.attr("class", "sg-select__element");
    $filterSelectParent.attr("class", "sg-select sg-select--full-width");

    this.ClearFilterContainer();

    if (value) {
      this[value](this.$filterWrapper);
      this.ShowFilterContainer();
      this.$filterSelect.addClass($selectedOption.attr("class"));
      $filterSelectParent.addClass($selectedOption.attr("class"));
    }
  }
  HideRegexpButton() {
    this.main.HideElement(this.$regexpButton);
  }
  ShowRegexpButton() {
    this.$regexpButton.prependTo(this.$buttonContainer);
  }
  ShowFilterContainer() {
    this.$filterContainer.appendTo(this.$filtersSelectContainer);
  }
  ClearFilterContainer() {
    this.$filterWrapper.html("");
    this.main.HideElement(this.$filterContainer);
  }
  CONTENT_TYPE($target) {
    this.filter = new ContentType($target);
  }
  REPORTER($target) {
    this.filter = new UserId($target, "REPORTER");
  }
  REPORTEE($target) {
    this.filter = new UserId($target, "REPORTEE");
  }
  DATE_RANGE($target) {
    this.filter = new DateRange($target);
  }
  REPORT_REASON($target) {
    this.filter = new ReportReasonText($target);

    this.ShowRegexpButton();
  }
  AddFilterButtonClicked() {
    if (this.AddFilter())
      this.ToggleDeleteSection();
  }
  AddFilter() {
    let filterData = this.filter.Data();

    if (filterData) {
      let $previousContentType = this.IsContentTypeExist();

      if (filterData.type == "CONTENT_TYPE" && $previousContentType.length > 0) {
        let condition = $previousContentType.prop("condition");

        if (condition.value != filterData.value)
          this.main.modal.notification(System.data.locale.core.notificationMessages.youNeedToRemoveThePreviousFilterFirst, "error");
        else
          return true;
      } else if (this.IsConditionExist(filterData)) {
        this.main.modal.notification(System.data.locale.core.notificationMessages.thisConditionAlreadyAdded, "error");
      } else if (this.IsConditionExistInTheCommonConditions(filterData)) {
        this.main.modal.notification(System.data.locale.core.notificationMessages.thisConditionAlreadyAddedInCommonConditions, "error");
      } else {
        if (filterData.type == "CONTENT_TYPE")
          this.contentType = filterData.value;

        let $conditionContainer = $(`<div class="sg-box sg-box--xxsmall-padding sg-box--margin-spaced sg-box--no-min-height sg-box--no-border sg-media--clickable no-select ${filterData.class}"></div>`);
        let $condition = $(`<div class="sg-box__hole${this.IsRegexSelected() ? " regex" : ""}" data-hash="${filterData.hash}">${filterData.text}</div>`);

        $condition.prop("condition", filterData);
        $condition.appendTo($conditionContainer);
        $conditionContainer.appendTo(this.$conditionsContainer);
        //window.RegexColorizer.addStyleSheet();
        window.RegexColorizer.colorizeAll();

        this.FilterReports();

        return true;
      }
    }
  }
  IsContentTypeExist() {
    let $conditions = $(`[data-hash]`, this.$conditionsContainer);

    return $conditions.filter((i, element) => element.condition && element.condition.type == "CONTENT_TYPE");
  }
  IsConditionExist(conditionData) {
    let $condition = $(`[data-hash="${conditionData.hash}"]`, this.$conditionsContainer);

    return $condition.length > 0
  }
  IsConditionExistInTheCommonConditions(conditionData) {
    let $condition = $(`[data-hash="${conditionData.hash}"]`, this.main.commonConditionSection.$conditionsContainer);

    return $condition.length > 0
  }
  IsRegexSelected() {
    return this.$regexpButton._type == "primary-blue";
  }
  FilterReports() {
    this.ToggleConditionContainer();

    if (!this.options.isCommon) {
      this.conditions = this.PrepareConditions();
      this.filteredReports = this.ReduceReports();

      this.RefreshFooterReportStatus();
      this.ToggleStartButton();
      this.main.ToggleActionButtons();
      this.ShowFooter();
    } else {
      let $sections = $("> div", this.main.$conditionSectionsContainer);

      $sections.each(section => section && section.ConditionSection && section.ConditionSection.FilterReports());
    }
  }
  ToggleConditionContainer() {
    let $conditions = $(">.sg-box", this.$conditionsContainer);
    let target = "<div />";

    if ($conditions.length > 0)
      target = this.$conditionsContainerSection;

    this.$conditionsContainerBox.appendTo(target);
  }
  PrepareConditions() {
    let $conditions = $(".sg-box > .sg-box__hole[data-hash]", this.$conditionsContainer);
    let $commonConditions = $(".sg-box > .sg-box__hole[data-hash]", this.main.commonConditionSection.$conditionsContainer);
    let conditions = [];

    $conditions.each((i, element) => {
      this.ParseConditionElements(conditions, element);
    });
    $commonConditions.each((i, element) => {
      this.ParseConditionElements(conditions, element);
    });

    return conditions;
  }
  ParseConditionElements(conditions, element) {
    let key;
    let value;
    let data = element.condition;

    if (data.type == "CONTENT_TYPE") {
      key = "model_type_id";
      value = CONTENT_TYPES[data.value];
    }

    if (data.type == "REPORTER") {
      key = "report.user.id";
      value = data.value;
    }

    if (data.type == "REPORTEE") {
      key = "user.id";
      value = data.value;
    }

    if (data.type == "DATE_RANGE") {
      key = "report.created";
      value = data.value
    }

    if (data.type == "REPORT_REASON") {
      key = "report.abuse.data";

      if (this.IsRegexSelected()) {
        value = new RegExp(data.value, "i");
      } else {
        value = new RegExp(`\\b${data.value}\\b`, "i");
      }
    }

    conditions.push({
      key,
      value
    });
  }
  ReduceReports() {
    let reports = [];

    if (this.conditions.length) {
      reports = this.main.reports.reduce((reducedReports, report) => {
        let result = true;

        for (let i = 0, condition;
          (condition = this.conditions[i]); i++) {

          if (result) {
            let prop = eval(`report.${condition.key}`);

            if (
              !prop ||
              !(
                (
                  condition.key == "report.created" &&
                  this.IsBetweenDates(condition.value, prop)
                ) ||
                (
                  condition.key == "report.abuse.data" &&
                  condition.value.test(prop)
                ) ||
                prop == condition.value
              )
            ) {
              result = false;
              break;
            }
          }
        }

        if (result) {
          reducedReports.push(report);
        }

        return reducedReports;
      }, []);
    }

    return reports
  }
  IsBetweenDates({ date1, date2 } = {}, value) {
    let dateReport = moment(value).tz(System.data.Brainly.defaultConfig.locale.TIMEZONE);

    return dateReport >= date1 && dateReport <= date2;
  }
  RefreshFooterReportStatus(cleanReports = true) {
    this.HideReportsContainer(cleanReports);
    this.$matchedReportsCount.text(this.filteredReports.length);
  }
  ToggleStartButton() {
    if (!this.moderatingStarted && this.filteredReports.length > 0)
      this.ShowStartButton();
    else
      this.HideStartButton();

    this.ToggleActionButtonsContainer();
  }
  ShowStartButton() {
    this.HideStopButton();
    this.$startButton.appendTo(this.$actionButtonsSpinnerContainer);
  }
  HideStartButton() {
    this.main.HideElement(this.$startButton);
  }
  ToggleActionButtonsContainer() {
    if (this.$actionButtonsSpinnerContainer.children().length > 0)
      this.$actionButtonsContainer.appendTo(this.$footerActionList);
    else
      this.main.HideElement(this.$actionButtonsContainer);
  }
  /**
   * @param {Event} event
   */
  RemoveCondition(event) {
    /**
     * @type {HTMLDivElement}
     */
    let target = (event.currentTarget || event.target);
    /**
     * @type {ContentType}
     */
    let condition = target.lastChild.condition;

    if (condition.type == "CONTENT_TYPE") {
      this.contentType = undefined;

      this.ToggleDeleteSection();
    }

    target.remove();
    this.FilterReports();
  }
  ToggleReports() {
    this.RenderReports();
    this.ToggleReportsContainer();
  }
  RenderReports() {
    if (this.filteredReports.length > 0)
      this.filteredReports.slice(0, 200).forEach(this.RenderReport.bind(this));
  }
  RenderReport(report) {
    let users = this.main.users.reduce((users, user) => {
      if (user.id == report.user.id)
        users.reportee = user;
      else if (user.id == report.report.user.id)
        users.reporter = user;

      return users;
    }, {});

    let reportDate = moment(report.report.created).tz(System.data.Brainly.defaultConfig.locale.TIMEZONE);
    report.report.created_fixed = reportDate.format("L LT");

    let $report = $(templateReportBox.template({ ...report, ...users }));

    $report.appendTo(this.$reportsContainer);
  }
  ToggleReportsContainer() {
    if (this.$reportsContainer.is(":visible") || this.filteredReports.length == 0)
      this.HideReportsContainer();
    else
      this.ShowReportsContainer();
  }
  HideReportsContainer(cleanChilds) {
    this.main.HideElement(this.$reportsContainer);

    if (cleanChilds)
      this.$reportsContainer.html("");
  }
  ShowReportsContainer() {
    if (this.filteredReports.length == 0)
      return this.HideReportsContainer();

    this.$reportsContainer.appendTo(this.$footer);
  }
  /**
   * @param {Event} event
   */
  ChangeActionType(event) {
    let type = event.target.id;
    this.actionType = type;

    this.ToggleDeleteSection();
    this.actionTypeSection.HideWarning();
  }
  ToggleDeleteSection() {
    if (this.actionType == "delete")
      this.ShowDeleteSection();
    else
      this.HideDeleteSection();

  }
  ShowDeleteSection() {
    if (!this.deleteSection)
      this.deleteSection = new DeleteSection({
        hideReasons: ["comment"],
        handlers: {
          contentTypeChange: this.DeleteSectionContentTypeChanged.bind(this)
        },
        noSpacedTop: true
      });

    if (this.contentType) {
      if (this.deleteSection.selectedReasonSection)
        this.deleteSection.selectedReasonSection.Hide();

      this.deleteSection.type = this.contentType;

      this.deleteSection.ShowReasons();
      this.deleteSection.contentTypeSection.Hide();
    } else
      this.deleteSection.ShowContentType();

    this.deleteSection.ShowOptions();
    this.deleteSection.$.appendTo(this.$actionTypeContainer);
  }
  DeleteSectionContentTypeChanged() {
    this.$filterSelect.val("CONTENT_TYPE").change();
    let type = this.deleteSection.type;

    if (type == "task")
      type = "QUESTION";

    if (type == "response")
      type = "ANSWER";

    this.filter.$select.val(type).change();

    let addFilter = this.AddFilter();

    return !!addFilter
  }
  HideDeleteSection() {
    if (this.deleteSection)
      this.main.HideElement(this.deleteSection.$);
  }
  StartModerating() {
    let isDataPrepared = this.PrepareModerateRequestData();

    if (!isDataPrepared)
      this.main.TryToStopModerating();
    else {
      this.moderatingStarted = true;
      this.targetedAmountOfModerating = this.filteredReports.length;

      this.ShowCounter();
      this.Log();
      this.ToggleStopButton();
      this._loop_Moderate = setInterval(this.Moderate.bind(this));
      this._loop_ResetCounter = setInterval(() => (this.activeModerateConnectionCount = 0), 1000);
    }
  }
  FinishModerating() {
    this.StopModerating();
    this.main.ToggleActionButtons();
  }
  async StopModerating(manualStop) {
    this.moderatingStarted = false;

    this.DisableStopButton();
    this.ShowActionButtonSpinner();
    this.main.ToggleStopButton();
    clearInterval(this._loop_Moderate);
    clearInterval(this._loop_ResetCounter);

    if (manualStop)
      this.HideCounterSpinner();

    await Promise.all(this.openedModerateConnections);

    this.openedModerateConnections = [];

    this.HideActionButtonSpinner();
    this.HideStopButton();
    this.EnableStopButton();
    this.ToggleStartButton();
  }
  ShowActionButtonSpinner() {
    this.$actionButtonsSpinner.appendTo(this.$actionButtonsSpinnerContainer);
  }
  HideActionButtonSpinner() {
    this.main.HideElement(this.$actionButtonsSpinner);
  }
  ToggleStopButton() {
    if (this.moderatingStarted)
      this.ShowStopButton();
    else
      this.HideStopButton();

    this.ToggleActionButtonsContainer();
  }
  ShowStopButton() {
    this.HideStartButton();
    this.$stopButton.appendTo(this.$actionButtonsSpinnerContainer);
  }
  HideStopButton() {
    this.main.HideElement(this.$stopButton);
  }
  DisableStopButton() {
    this.$stopButton.Disable();
  }
  EnableStopButton() {
    this.$stopButton.Enable();
  }
  PrepareModerateRequestData() {
    if (!this.actionType)
      this.actionTypeSection.ShowWarning();
    else {
      if (this.actionType == "delete") {
        if (this.deleteSection.selectedReason) {
          this.moderateData = {
            reason_id: this.deleteSection.selectedReason.id,
            reason: this.deleteSection.reasonText,
            give_warning: this.deleteSection.giveWarning,
            take_points: this.deleteSection.takePoints
          };

          if (this.contentType == "QUESTION")
            this.moderateData.return_points = this.deleteSection.returnPoints;

          return true
        }
      } else
        return true
    }
  }
  ShowCounter() {
    this.ShowCounterSpinner();
    this.HideCounterCheckIcon();
    this.ChangeCounterLabelText();
    this.$counterTextContainer.insertAfter(this.$matchedButtonContainer);
  }
  ShowCounterSpinner() {
    this.HideCounterCheckIcon();
    this.$counterTextSpinner.prependTo(this.$counterTextLabel);
  }
  HideCounterSpinner() {
    this.main.HideElement(this.$counterTextSpinner);
  }
  HideCounterCheckIcon() {
    this.main.HideElement(this.$counterTextCheckIcon);
  }
  ChangeCounterLabelText() {
    let text = "";

    if (this.actionType == "delete")
      text = "deleted";
    else if (this.actionType == "confirm")
      text = "confirmed";

    this.$counterTextLabelText.text(System.data.locale.common[text]);
    this.ResetCounter();
  }
  ResetCounter() {
    this.confirmedCount = 0;
  }
  ShowCounterCheckIcon() {
    this.HideCounterSpinner();
    this.$counterTextCheckIcon.prependTo(this.$counterTextLabel);
  }
  async Moderate() {
    if (this.moderatingStarted && this.activeModerateConnectionCount < this.main.requestLimit) {
      let report = this.PullReport();
      this.activeModerateConnectionCount++;

      if (!report)
        this.FinishModerating();
      else {
        report.identifier = `${report.model_id}:${report.model_type_id}`;

        if (this.main.moderatedReports.includes(report.identifier))
          this.IncreaseCounterText();
        else {
          try {
            let promise;
            let action = new Action();

            if (this.actionType == "confirm") {
              promise = action.ConfirmContent(report.model_id, report.model_type_id);
            } else if (this.actionType == "delete") {
              let Method;
              let data = {
                ...this.moderateData,
                model_id: report.model_id
              }

              if (this.contentType == "QUESTION")
                Method = "RemoveQuestion";

              else if (this.contentType == "ANSWER")
                Method = "RemoveAnswer";

              else if (this.contentType == "COMMENT")
                Method = "RemoveComment";

              promise = action[Method](data);
            }

            //promise = System.Delay();

            this.openedModerateConnections.push(promise);

            let res = await promise;
            //res = { "success": true, "message": "Testing", "data": null };

            this.HandleModerateResponse(report, res);
          } catch (error) {
            this.HandleModerateError(error);
          }
        }
      }
    }
  }
  PullReport() {
    return this.filteredReports.shift();
  }
  IncreaseCounterText() {
    this.$counterTextNumber.text(++this.confirmedCount);

    if (this.confirmedCount == this.targetedAmountOfModerating)
      this.ShowCounterCheckIcon();
  }
  /**
   * @param {{success:boolean, message?:"", data?:null|{}|[]}} res
   */
  HandleModerateResponse(report, res) {
    if (res) {
      if (res.success) {
        this.RefreshFooterReportStatus(false);
        this.main.RemoveReportFromStore(report);
        this.main.moderatedReports.push(report.identifier);
      }

      this.IncreaseCounterText();
    } else
      this.HandleModerateError("Server send empty response");

  }
  HandleModerateError(error) {
    console.error(error);

    if (!report.tryTime)
      report.tryTime = 0;

    if (++report.tryTime < 3)
      this.filteredReports.push(report);
  }
  Log() {
    if (this.filteredReports.length) {
      let idList = this.filteredReports.map(report => `${report.model_id}:${report.model_type_id}`);

      System.log(23, { data: idList });
    }
  }
}

export default ConditionSection
