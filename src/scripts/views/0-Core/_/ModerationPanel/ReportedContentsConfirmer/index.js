import template from "backtick-template";
import ConditionSection from "./ConditionSection";
import templateModalContent from "./templates/ModalContent.html";
import Modal from "../../../../../components/Modal";
import { GetReportedContents } from "../../../../../controllers/ActionsOfBrainly";

const spinner = `<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`;

class ReportedContentsConfirmer {
	constructor() {
		this.users = [];
		this.reports = [];
		this.conditionCount = 0;
		this.matchedSections = [];
		this.confirmedReports = [];
		this.commonConditionSection;

		this.Init();
	}
	Init() {
		this.RenderLi();
		this.RenderModal();
		this.BindEvents();
	}
	RenderLi() {
		this.$li = $(`
		<li class="sg-menu-list__element" style="display: table; width: 100%; padding-right: 1em;">
			<span class="sg-text sg-text--link sg-text--blue sg-text--small">${System.data.locale.core.reportedContentsConfirmer.text}</span>
		</li>`);
	}
	RenderModal() {
		this.modal = new Modal({
			header: `<div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-text sg-text--peach">${System.data.locale.core.reportedContentsConfirmer.text}</div>
					</div>
				</div>
			</div>`,
			content: template(templateModalContent),
			size: "large"
		});
		this.$modal = this.modal.$modal;
		this.$idInput = $(".id input", this.$modal);
		this.$close = $(".sg-toplayer__close", this.$modal);
		this.$confirmAllButton = $(".js-confirm-all", this.$modal);
		this.$stopConfirmingButton = $(".js-stop-confirming", this.$modal);
		this.$spinnerOfFetching = $(".sg-spinner-container", this.$modal);
		this.$totalReportsCount = $(".js-total-reports-count", this.$modal);
		this.$fetchedReportsCount = $(".js-fetched-reports-count", this.$modal);
		this.$conditionSectionsContainer = $(".js-condition-sections", this.$modal);
		this.$addUniqueConditionSectionButtonContainer = $(".addConditionContainer", this.$modal);
		this.$addUniqueConditionSectionButton = $("button", this.$addUniqueConditionSectionButtonContainer);

		this.RenderCommonConditionSection();
	}
	RenderCommonConditionSection() {
		this.commonConditionSection = this.AddConditionSection(System.data.locale.core.reportedContentsConfirmer.commonConditions.text, System.data.locale.core.reportedContentsConfirmer.commonConditions.title, { isCommon: true });

		this.HideElement(this.commonConditionSection.$section);
	}
	AddConditionSection(text, title, options) {
		if (!title) {
			return new Error("Title not specified");
		}

		let conditionSection = new ConditionSection(this, text, title, options);

		conditionSection.$section.prop("ConditionSection", conditionSection);
		conditionSection.$section.insertBefore(this.$addUniqueConditionSectionButtonContainer);

		return conditionSection;
	}
	BindEvents() {
		this.$close.click(this.modal.Close.bind(this.modal));
		this.$li.on("click", "span", this.OpenModal.bind(this));

		this.$addUniqueConditionSectionButton.click(this.AddUniqeCondition.bind(this));
		this.$confirmAllButton.click(this.StartConfirming.bind(this));
		this.$stopConfirmingButton.click(this.StopConfirming.bind(this));
		/* this.$stop.click(this.Stop.bind(this));
		this.$start.click(this.Start.bind(this)); */
	}
	OpenModal() {
		this.modal.Open();

		if (!this.IsFetchStartedBefore) {
			this.FetchReportedContents();
		}
	}
	async FetchReportedContents(last_id) {
		this.IsFetchStartedBefore = true;
		let resReports = await GetReportedContents(last_id);

		if (resReports && resReports.success && resReports.data) {
			this.StoreFetchedReports(resReports.data.items);
			this.StoreUsers(resReports.users_data);
			this.UpdateCountLabels(resReports.data.total_count);
			this.UpdateConditionSections();

			if (resReports.data.last_id > 0 && resReports.data.items.length != resReports.data.total_count) {
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
	HideElement($element) {
		$element.addClass("js-hidden");
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
		this.reports = this.reports.filter(report => {
			if (report.model_id != _report.model_id && report.model_type_id != _report.model_type_id) {
				return report;
			}
		});

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
		return $("> .sg-box:not(:eq(0))", this.$conditionSectionsContainer);
	}
	AddUniqeCondition() {
		let title = System.data.locale.core.reportedContentsConfirmer.conditionN.title;
		let text = System.data.locale.core.reportedContentsConfirmer.conditionN.text.replace("%{amount_of_conditions}", ` ${++this.conditionCount} `);

		this.ShowElement(this.commonConditionSection.$section);
		this.AddConditionSection(text, title);
	}
	StartConfirming() {
		if (this.matchedSections.length) {
			this.HideConfirmButton();
			this.ShowStopButton();
			this.matchedSections.forEach(section => section.ConditionSection.StartConfirming());
		} else {
			this.modal.notification(System.data.locale.core.notificationMessages.conditionsDoesntMatchAnything, "info");
		}
	}
	StopConfirming() {
		if (this.matchedSections.length) {
			this.ShowConfirmButton();
			this.HideStopButton();
			this.matchedSections.forEach(section => section.ConditionSection.StopConfirming());
		}
	}
	ShowConfirmButton() {
		this.ShowElement(this.$confirmAllButton);
	}
	HideConfirmButton() {
		this.HideElement(this.$confirmAllButton);
	}
	ToggleConfirmButton() {
		this.matchedSections = this.SectionsHasMatchedReports();

		if (this.matchedSections.length > 0 && this.totalReports == this.reports.length) {
			this.ShowConfirmButton();
			this.HideStopButton();
		} else {
			this.HideConfirmButton();
		}
	}
	ShowStopButton() {
		this.ShowElement(this.$stopConfirmingButton);
	}
	HideStopButton() {
		this.HideElement(this.$stopConfirmingButton);
	}
	ToggleStopButton() {
		let matchedSections = this.SectionsStillConfirming();

		if (matchedSections.length) {
			this.HideConfirmButton();
			this.ShowStopButton();
		} else {
			this.HideStopButton();
			this.ToggleConfirmButton();
		}
	}
	SectionsHasMatchedReports() {
		let $uniqueConditionSections = this.UniqueConditionSections().toArray();

		if ($uniqueConditionSections.length) {
			$uniqueConditionSections = $uniqueConditionSections.filter((section) => {
				if (section.ConditionSection.filteredReports.length) {
					return section;
				}
			});
		}

		return $uniqueConditionSections;
	}
	SectionsStillConfirming() {
		let $uniqueConditionSections = this.UniqueConditionSections().toArray();
		if ($uniqueConditionSections.length) {
			$uniqueConditionSections = $uniqueConditionSections.filter((section) => {
				if (section.ConditionSection.confirmingStarted) {
					return section;
				}
			});
		}

		return $uniqueConditionSections;
	}
}

export default ReportedContentsConfirmer
