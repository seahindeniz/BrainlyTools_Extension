import moment from "moment-timezone";
import template from "backtick-template";

import UserId from "./Filters/UserId";
import DateRange from "./Filters/DateRange";
import ContentType from "./Filters/ContentType";
import ReportReasonText from "./Filters/ReportReasonText";

import templateFooter from "./templates/Footer.html";
import templateReportBox from "./templates/ReportBox.html";
import templateFilterContainer from "./templates/FilterContainer.html";
import templateFilterSelectCard from "./templates/FilterSelectCard.html";

import { ConfirmContent } from "../../../../../controllers/ActionsOfBrainly";

String.prototype.template = template.asMethod;

const CONTENT_TYPES = {
	QUESTION: 1,
	ANSWER: 2
}

class ConditionSection {
	constructor(main, text, title = "", options = {}) {
		this.main = main;
		this.text = text;
		this.title = title;
		this.options = options;
		this.confirmedCount = 0;
		this.filteredReports = [];
		this.confirmingStarted = false;

		this.RenderSection();
		this.BindEvents();
	}
	RenderSection() {
		this.$section = $(`
		<div class="sg-box sg-box--full sg-box--no-padding sg-box--spaced-bottom-large sg-box--light-border">
			<div class="sg-box__hole">
				<div class="sg-content-box sg-content-box__content--full">
					<div class="sg-content-box__content"></div>
				</div>
			</div>
		</div>`);
		this.$header = $(".sg-content-box__content", this.$section);

		this.RenderFooter();
		this.RenderSectionCard();
	}
	RenderFooter() {
		let confirmedText = System.data.locale.core.reportedContentsConfirmer.confirmed.replace("%{number_of_confirmed_reports}", "<b>0</b>");
		this.$footer = $(templateFooter.template({ matchedText: this.ReplaceMatchedTextString(), confirmedText }));

		this.$matchedButton = $("button", this.$footer);
		this.$affectedReportsCount = $(".sg-label__number", this.$matchedButton);

		this.$confirmedTextContainer = $(".js-confirmed", this.$footer);
		this.$confirmedCount = $("b", this.$confirmedTextContainer);
		this.$confirmedSpinner = $(".sg-spinner-container", this.$confirmedTextContainer);

		this.$reportsContainer = $("> .sg-content-box:eq(1)>.sg-content-box__content", this.$footer);

		if (!this.options.isCommon) {
			this.$footer.insertAfter(this.$header);
		}
	}
	ReplaceMatchedTextString() {
		let matchedText = System.data.locale.core.reportedContentsConfirmer.matched.match(/(.*)(\%{.*})+$|(\%{.*})(.*)+$/);
		let text = `<label class="sg-label__text">Matched</label><div class="sg-label__number">0</div>`;

		if (matchedText.length > 3) {
			matchedText = matchedText.filter(Boolean);

			if (matchedText[1].indexOf("%") >= 0) {
				text = matchedText[1].replace("%{number_of_matched_reports}", `<div class="sg-label__number">0</div>`) + `<label class="sg-label__text">${matchedText[2]}</label>`;
			} else {
				text = `<label class="sg-label__text">${matchedText[1]}</label>` + matchedText[2].replace("%{number_of_matched_reports}", `<div class="sg-label__number">0</div>`);
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

		this.$conditionsContainer = $(".sg-card__hole", this.$sectionCard);

		this.RenderClose();
		this.RenderFilterSelectCard();
	}
	RenderFilterSelectCard() {
		this.$filtersSelectContainer = $(templateFilterSelectCard.template()).appendTo(this.$sectionCard);

		this.$filterSelect = $("select", this.$filtersSelectContainer);

		this.RenderFilterContainer();
	}
	RenderFilterContainer() {
		this.$filterContainer = $(templateFilterContainer.template()).appendTo(this.$filtersSelectContainer);

		this.$regexpButton = $("button.regexp", this.$filterContainer);
		this.$addFilterButton = $("button:not(.regexp)", this.$filterContainer);
		this.$filterWrapper = $(`<div class="sg-actions-list__hole sg-actions-list__hole--grow js-filter-value"></div>`).prependTo(this.$filterContainer);
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
	BindEvents() {
		let that = this;
		this.$filterSelect.change(this.UpdateFilterValueContainer.bind(this));
		this.$addFilterButton.click(this.AddCondition.bind(this));
		this.$close && this.$close.click(this.RemoveSection.bind(this));
		this.$regexpButton.click(this.ToggleDarkButton);
		this.$conditionsContainer.on("dblclick", ">.sg-box", function() {
			this.remove();
			that.FilterReports();
		});
		this.$matchedButton.click(this.ToggleReports.bind(this));
	}
	RemoveSection() {
		this.$section.remove();
		this.main.ToggleConfirmButton();
	}
	ToggleDarkButton() {
		this.classList.toggle("sg-button-secondary--dark");
	}
	UpdateFilterValueContainer() {
		let value = this.$filterSelect.val();
		let $selectedOption = $(":selected", this.$filterSelect);
		let $filterSelectParent = this.$filterSelect.parents(".sg-select");

		this.main.HideElement(this.$regexpButton);
		this.$filterSelect.attr("class", "sg-select__element");
		$filterSelectParent.attr("class", "sg-select sg-select--full-width");

		this.ClearFilterContainer();

		if (value) {
			this[value](this.$filterWrapper);
			this.main.ShowElement(this.$filterContainer);
			this.$filterSelect.addClass($selectedOption.attr("class"));
			$filterSelectParent.addClass($selectedOption.attr("class"));
		}
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

		this.main.ShowElement(this.$regexpButton);
	}
	AddCondition() {
		let conditionData = this.filter.Data();

		if (conditionData) {
			if (this.IsConditionExist(conditionData)) {
				this.main.modal.notification(System.data.locale.core.notificationMessages.thisConditionAlreadyAdded, "error");
			} else if (this.IsConditionExistInTheCommonConditions(conditionData)) {
				this.main.modal.notification(System.data.locale.core.notificationMessages.thisConditionAlreadyAddedInCommonConditions, "error");
			} else {
				let $conditionContainer = $(`<div class="sg-box sg-box--xxsmall-padding sg-box--margin-spaced sg-box--no-min-height sg-box--no-border sg-media--clickable no-select ${conditionData.class}"></div>`);
				let $condition = $(`<div class="sg-box__hole${this.IsRegexButtonDark()?"":" regex"}" data-hash="${conditionData.hash}">${conditionData.text}</div>`);

				$condition.prop("condition", conditionData);
				$condition.appendTo($conditionContainer);
				$conditionContainer.appendTo(this.$conditionsContainer);
				//window.RegexColorizer.addStyleSheet();
				window.RegexColorizer.colorizeAll();

				this.FilterReports();
			}
		}
	}
	IsConditionExist(conditionData) {
		let $condition = $(`[data-hash="${conditionData.hash}"]`, this.$conditionsContainer);

		return $condition.length > 0
	}
	IsConditionExistInTheCommonConditions(conditionData) {
		let $condition = $(`[data-hash="${conditionData.hash}"]`, this.main.commonConditionSection.$conditionsContainer);

		return $condition.length > 0
	}
	IsRegexButtonDark() {
		return this.$regexpButton.is(".sg-button-secondary--dark");
	}
	FilterReports() {
		if (!this.options.isCommon) {
			this.conditions = this.PrepareConditions();
			this.filteredReports = this.ReduceReports();

			this.RefreshFooterReportStatus();
			this.main.ToggleConfirmButton();
			this.ShowFooter();
		}
	}
	RefreshFooterReportStatus() {
		this.main.HideElement(this.$reportsContainer.html(""));
		this.$affectedReportsCount.text(this.filteredReports.length);
	}
	ShowFooter() {
		this.$sectionCard.addClass("sg-card--no-bottom-radius");
		this.main.ShowElement(this.$footer);
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

			if (!this.$regexpButton.is(".sg-button-secondary--dark")) {
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
	ToggleReports() {
		if (this.$reportsContainer.prop("childElementCount") == 0) {
			this.RenderReports();
		}

		this.main.ToggleElement(this.$reportsContainer);
	}
	RenderReports() {
		if (this.filteredReports.length > 0) {
			this.filteredReports.slice(0, 200).forEach(this.RenderReport.bind(this));
		}
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
	StartConfirming() {
		this.confirmingStarted = true;

		this.ShowConfirmedText();
		this.Confirm();
	}
	StopConfirming() {
		this.confirmingStarted = false;

		this.main.HideElement(this.$confirmedSpinner);
		this.main.ToggleStopButton();
	}
	ShowConfirmedText() {
		this.main.ShowElement(this.$confirmedSpinner);
		this.main.ShowElement(this.$confirmedTextContainer);
	}
	HideConfirmedText() {
		this.main.HideElement(this.$confirmedTextContainer);
	}
	async Confirm() {
		if (this.confirmingStarted) {
			let report = this.PullReport();

			if (!report) {
				this.StopConfirming();
			} else {
				let reportString = `${report.model_id}:${report.model_type_id}`;

				if (this.main.confirmedReports.includes(reportString)) {
					this.Confirm();
					this.IncreaseConfirmedCount();
				} else {
					try {
						let resConfirm = await ConfirmContent(report.model_id, report.model_type_id);
						//await System.delay();	let resConfirm = { "protocol": "28", "impl": "5.1", "schema": "moderation/responses/moderation.success.res", "success": true, "message": "Le contenu a été accepté", "data": null, "validated": false };

						if (resConfirm && resConfirm.success) {
							this.main.confirmedReports.push(reportString);
							this.main.RemoveReportFromStore(report);
						}

						this.Confirm();
						this.IncreaseConfirmedCount();
					} catch (error) {
						console.error(error);

						if (!report.tryTime) {
							report.tryTime = 0;
						}

						if (++report.tryTime < 3) {
							this.filteredReports.push(report);
							this.Confirm();
						}
					}
				}
			}
		}
	}
	PullReport() {
		let report;

		if (this.filteredReports.length) {
			report = this.filteredReports.shift();
		}

		return report
	}
	IncreaseConfirmedCount() {
		this.$confirmedCount.text(++this.confirmedCount);
	}
}

export default ConditionSection
