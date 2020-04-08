import ServerReq from "@ServerReq";
import template from "backtick-template";
import Components from "../Components";
import Button from "../../../../../components/Button";
import Modal from "../../../../../components/Modal";
import Action from "../../../../../controllers/Req/Brainly/Action";
import ConditionSection from "./ConditionSection";
// @ts-ignore
import templateModalContent from "./templates/ModalContent.html";

export default class MassModerateReportedContents extends Components {
  constructor(main) {
    super(main);

    this.users = [];
    this.lastIds = [];
    /**
     * @typedef {{id: number, warnings_count: number, reports_count: number, successfull_reports_count: number, removed_contents_count:number}} ReportedUser
     * @type {{model_id: number, model_type_id: number, subject_id: 5, task_id: number, content_short: string, created: string, report: {created: string, abuse: {category_id: number, data: string, name: string, subcategory_id: number}, user: ReportedUser}, user: ReportedUser}[]}
     */
    this.reports = [];
    this.requestLimit = 1;
    this.conditionCount = 0;
    this.isModerating = false;
    this.matchedSections = [];
    this.moderatedReports = [];
    this.commonConditionSection;
    this.openedFetchingConnections = 0;
    this.liLinkContent = System.data.locale.core.massModerateReportedContents
      .text;

    this.RenderListItem();
    this.RenderModal();
    this.RenderAddUniqueConditionSectionButton();
    this.RenderCommonConditionSection();
    this.RenderStartButton();
    this.RenderStartButtonSpinner();
    this.RenderStopButton();
    this.BindHandlers();
  }
  RenderModal() {
    this.modal = new Modal({
      header: `<div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-text sg-text--peach">${System.data.locale.core.massModerateReportedContents.text}</div>
					</div>
				</div>
			</div>`,
      content: template(templateModalContent),
      size: "large"
    });
    this.$modal = this.modal.$modal;
    this.$idInput = $(".id input", this.$modal);
    this.$spinnerOfFetching = $(".sg-spinner-container", this.$modal);
    this.$totalReportsCount = $(".js-total-reports-count", this.$modal);
    this.$fetchedReportsCount = $(".js-fetched-reports-count", this.$modal);
    this.$conditionSectionsContainer = $(
      "> .sg-content-box > .sg-content-box__content > .sg-content-box:eq(0)",
      this.modal.$content);
    this.$addUniqueConditionSectionButtonContainer = $(
      "> .sg-content-box > .sg-content-box__content > .sg-content-box:nth-child(2) .sg-actions-list__hole",
      this.modal.$content);
    this.$counterContainer = $(
      ".sg-content-box__actions > .sg-actions-list > .sg-actions-list__hole:eq(1)",
      this.modal.$content);
    this.$buttonsMainContainer = $(
      ".sg-content-box__actions > .sg-actions-list > .sg-actions-list__hole:eq(2)",
      this.modal.$content);
    this.$buttonsListContainer = $("> .sg-actions-list", this
      .$buttonsMainContainer);
    this.$buttonsContainer = $("> .sg-actions-list__hole", this
      .$buttonsListContainer);
  }
  RenderAddUniqueConditionSectionButton() {
    this.$addUniqueConditionSectionButton = Button({
      type: "solid-blue",
      size: "small",
      icon: {
        type: "plus"
      },
      fullWidth: true,
      text: System.data.locale.core.massModerateReportedContents
        .addConditionBlock
    });

    this.$addUniqueConditionSectionButton.appendTo(this
      .$addUniqueConditionSectionButtonContainer);
  }
  RenderCommonConditionSection() {
    this.commonConditionSection = this.AddConditionSection(System.data.locale
      .core.massModerateReportedContents.commonConditions.text, System.data
      .locale.core.massModerateReportedContents.commonConditions
      .title, { isCommon: true });

    this.HideElement(this.commonConditionSection.$section);
  }
  /**
   * @param {HTMLElement | JQuery<HTMLElement>} element
   */
  HideElement(element) {
    if (element instanceof HTMLElement)
      element.parentElement && element.parentElement.removeChild(element);
    else
      return element.appendTo("<div />");
  }
  AddConditionSection(text, title, options) {
    if (!text)
      throw "Title not specified";

    let conditionSection = new ConditionSection(this, text, title, options);

    conditionSection.$section.prop("ConditionSection", conditionSection);
    conditionSection.$section.appendTo(this.$conditionSectionsContainer);

    return conditionSection;
  }
  RenderStartButton() {
    this.$startButtonContainer = $(
      `<div class="sg-spinner-container"></div>`);
    this.$startButton = Button({
      type: "solid-mint",
      text: System.data.locale.common.startAll
    });

    this.$startButton.prependTo(this.$startButtonContainer);
  }
  RenderStartButtonSpinner() {
    this.$startButtonSpinner = $(
      `<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`
    );
  }
  RenderStopButton() {
    this.$stopButtonContainer = $(
      `<div class="sg-actions-list__hole"></div>`);
    this.$stopButton = Button({
      type: "solid-peach",
      text: System.data.locale.common.stop
    });

    this.$stopButton.prependTo(this.$stopButtonContainer);
  }
  BindHandlers() {
    this.modal.$close.click(this.modal.Close.bind(this.modal));
    this.li.addEventListener("click", this.OpenModal.bind(this));
    this.$addUniqueConditionSectionButton.click(this.AddUniqeCondition.bind(
      this));
    this.$startButton.click(this.StartModerating.bind(this));
    this.$stopButton.click(this.StopModerating.bind(this));
    /* this.$stop.click(this.Stop.bind(this));
    this.$start.click(this.Start.bind(this)); */
  }
  OpenModal() {
    this.modal.Open();

    if (!this.IsFetchStartedBefore) {
      //this.FetchReportedContents(); // If something wents wrong with the fetched last_id's from the extension server, use this method instead of this.GetLastIds
      this.reports = [];

      this.GetLastIds();
    }
  }
  async GetLastIds() {
    let resLastIds = await new ServerReq().GetModerateAllPages();

    if (resLastIds.success) {
      this.lastIds = resLastIds.data;

      this.lastIds.unshift(null);

      this.StartFetching();
    }
  }
  StartFetching() {
    this.IsFetchStartedBefore = true;

    this._loop_fetch = setInterval(this.QuickFetchReportedContents.bind(this),
      10);
    this._loop_resetFetchLimiter = setInterval(() => (this
      .openedFetchingConnections = 0), 1000);
  }
  async QuickFetchReportedContents() {
    if (this.openedFetchingConnections < 8) {
      this.openedFetchingConnections++;
      let last_id = this.lastIds.shift();

      if (typeof last_id == "undefined") {
        this.IsFetchStartedBefore = false;

        this.StopFetching();
        this.HideFetchingSpinner();
        this.UpdateCountLabels(this.reports.length);
      } else {
        let resReports = await new Action().GetReportedContents(last_id);

        if (resReports && resReports.success && resReports.data) {
          this.StoreFetchedReports(resReports.data.items);
          this.StoreUsers(resReports.users_data);
          this.UpdateCountLabels(resReports.data.total_count);
          this.UpdateConditionSections();
        }
      }
    }
  }
  StopFetching() {
    clearInterval(this._loop_fetch);
    clearInterval(this._loop_resetFetchLimiter);
  }
  async FetchReportedContents(last_id) {
    this.IsFetchStartedBefore = true;
    let resReports = await new Action().GetReportedContents(last_id);

    if (resReports && resReports.success && resReports.data) {
      this.StoreFetchedReports(resReports.data.items);
      this.StoreUsers(resReports.users_data);
      this.UpdateCountLabels(resReports.data.total_count);
      this.UpdateConditionSections();

      if (resReports.data.last_id > 0 && resReports.data.items.length !=
        resReports.data.total_count) {
        this.FetchReportedContents(resReports.data.last_id);
      } else {
        this.HideFetchingSpinner();
        this.UpdateCountLabels(this.reports.length);
      }
    }
  }
  HideFetchingSpinner() {
    this.HideElement(this.$spinnerOfFetching);
  }
  ShowElement($element) {
    $element.removeClass("js-hidden");
  }
  ToggleElement($element) {
    $element.toggleClass("js-hidden");
  }
  StoreFetchedReports(items) {
    if (items && items.length > 0)
      this.reports = [...this.reports, ...items];
  }
  RemoveReportFromStore(_report) {
    this.reports = this.reports.filter(report => !(report.model_id == _report
      .model_id && report.model_type_id == _report.model_type_id));

    this.UpdateCountLabels(this.reports.length);
  }
  StoreUsers(users) {
    if (users && users.length > 0)
      this.users = [...this.users, ...users];
  }
  UpdateCountLabels(total_count) {
    this.totalReports = total_count;
    this.$totalReportsCount.text(total_count);
    this.$fetchedReportsCount.text(this.reports.length);
  }
  UpdateConditionSections() {
    let $uniqueConditionSections = this.UniqueConditionSections();

    if ($uniqueConditionSections.length > 0) {
      $uniqueConditionSections.each((i, section) => {
        section.ConditionSection.FilterReports();
      });
    }
  }
  UniqueConditionSections() {
    return $("> .sg-box:not(.is-common)", this.$conditionSectionsContainer);
  }
  AddUniqeCondition() {
    let $uniqueConditionSections = this.UniqueConditionSections();

    if ($uniqueConditionSections.length == 8)
      this.modal.notification(System.data.locale.core.notificationMessages
        .youCantAddMoreThan8Sections, "info");
    else {
      let title = System.data.locale.core.massModerateReportedContents
        .conditionN.title;
      let text = System.data.locale.core.massModerateReportedContents
        .conditionN.text.replace("%{amount_of_conditions}",
          ` ${++this.conditionCount} `);

      this.ShowCommonConditionSection();
      this.AddConditionSection(text);
    }
  }
  ShowCommonConditionSection() {
    if (false)
      this.commonConditionSection.$section.prependTo(this
        .$conditionSectionsContainer);
  }
  StartModerating() {
    if (this.IsOKToModerate()) {
      this.isModerating = true;

      this.SetRequestLimit();
      this.ShowActionButtonSpinner();
      this.ShowStopButton();
      this.matchedSections.forEach(section => section.ConditionSection &&
        section.ConditionSection.StartModerating());
    } else if (this.matchedSections.length == 0) {
      this.modal.notification(System.data.locale.core.notificationMessages
        .conditionsDoesntMatchAnything, "info");
    }
  }
  IsOKToModerate() {
    return !this.isModerating && this.matchedSections.length > 0;
  }
  SetRequestLimit() {
    let length = this.matchedSections.length;

    if (length == 1)
      this.requestLimit = 8;
    if (length == 2)
      this.requestLimit = 4;
    if (length == 3)
      this.requestLimit = 3;
    if (length == 4)
      this.requestLimit = 2;
    if (length >= 5)
      this.requestLimit = 1;
  }
  ShowActionButtonSpinner() {
    this.$startButton.Disable()
    this.$startButtonSpinner.appendTo(this.$startButtonContainer);
  }
  StopModerating() {
    this.isModerating = false;

    if (this.matchedSections.length > 0) {
      this.HideStopButton();
      this.HideActionButtonSpinner();
      this.matchedSections.forEach(section => section.ConditionSection &&
        section.ConditionSection.StopModerating(true));
    }
  }
  HideActionButtonSpinner() {
    this.$startButton.Enable()
    this.HideElement(this.$startButtonSpinner);
  }
  HideActionButtons() {
    this.HideActionButtonSpinner();
    this.HideElement(this.$startButtonContainer);
  }
  ShowActionButtons() {
    this.$startButtonContainer.appendTo(this.$buttonsContainer);
  }
  ToggleActionButtons() {
    this.matchedSections = this.SectionsHasMatchedReports();

    if (this.matchedSections.length > 0 && this.reports.length >= this
      .totalReports) {
      this.isModerating = false;

      this.ShowActionButtons();
      this.HideStopButton();
    } else
      this.HideActionButtons();
  }
  ShowStopButton() {
    this.$stopButtonContainer.appendTo(this.$buttonsListContainer);
  }
  HideStopButton() {
    this.HideElement(this.$stopButtonContainer);
  }
  ToggleStopButton() {
    let matchedSections = this.SectionsStillModerating();

    if (matchedSections.length)
      this.ShowStopButton();
    else {
      this.HideStopButton();
      this.ToggleActionButtons();
    }
  }
  SectionsHasMatchedReports() {
    let $uniqueConditionSections = this.UniqueConditionSections().toArray();

    return $uniqueConditionSections.filter((section) => {
      /**
       * @type {ConditionSection}
       */
      let conditionSection = section.ConditionSection;

      if (conditionSection.filteredReports.length)
        return section;
    });
  }
  SectionsStillModerating() {
    let $uniqueConditionSections = this.UniqueConditionSections().toArray();
    if ($uniqueConditionSections.length) {
      $uniqueConditionSections = $uniqueConditionSections.filter((
        section) => {
        /**
         * @type {ConditionSection}
         */
        let conditionSection = section.ConditionSection;

        if (conditionSection.moderatingStarted)
          return section;
      });
    }

    return $uniqueConditionSections;
  }
  TryToStopModerating() {
    let moderatingSections = this.matchedSections.filter(section => !section
      .moderatingStarted);

    if (moderatingSections.length > 0)
      this.StopModerating()
  }
}
