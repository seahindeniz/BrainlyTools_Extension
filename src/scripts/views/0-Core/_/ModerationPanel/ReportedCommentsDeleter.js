import notification from "../../../../components/notification";
import { GetReportedComments, RemoveComment } from "../../../../controllers/ActionsOfBrainly";

const spinner = `<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`;

class ReportedCommentsDeleter {
	constructor() {
		this.reports = []
		this.started = false;
		this.deletedReportsCount = 0;
		this.activeConnections = 0;
		this.deleteProcessInterval = null;

		this.Init();
	}
	Init() {
		this.RenderLi();
		this.RenderPanel();
		this.BindEvents();
	}
	RenderLi() {
		this.$li = $(`
		<li class="sg-menu-list__element" style="display: table; width: 100%; padding-right: 1em;">
			<span class="sg-text sg-text--link sg-text--blue sg-text--small">${System.data.locale.core.reportedCommentsDeleter.text}</span>
		</li>`);
	}
	RenderPanel() {
		this.$panel = $(`
		<div class="sg-content-box reportedCommentsPanel">
			<div class="sg-content-box__content sg-content-box--spaced-bottom-large">
				<div class="sg-text sg-text--xsmall sg-text--gray">${System.data.locale.core.reportedCommentsDeleter.description}</div>
			</div>
			<div class="sg-content-box__actions sg-content-box--spaced-bottom">
				<div class="sg-actions-list">
					<div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
						<div class="sg-label sg-label--secondary">
							<div class="sg-label__icon">
								<div class="sg-checkbox">
									<input type="checkbox" class="sg-checkbox__element" id="giveWarning">
									<label class="sg-checkbox__ghost" for="giveWarning">
										<div class="sg-icon sg-icon--adaptive sg-icon--x10">
											<svg class="sg-icon__svg">
												<use xlink:href="#icon-check"></use>
											</svg></div>
									</label>
								</div>
							</div>
							<label class="sg-label__text" for="giveWarning" title="${System.data.locale.common.moderating.giveWarning.title}">${System.data.locale.common.moderating.giveWarning.text}</label>
						</div>
					</div>
					<div class="sg-actions-list__hole sg-actions-list__hole--grow">
						<div class="sg-select sg-select--full-width">
							<div class="sg-select__icon"></div>
							<select class="sg-select__element reasons">
								<option disabled selected>${System.data.locale.core.reportedCommentsDeleter.selectAReason}</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="sg-content-box__actions">
				<div class="sg-actions-list sg-actions-list--space-between">
					<div class="sg-actions-list__hole">
						<div class="sg-spinner-container">
							<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--alt js-start">${System.data.locale.common.start}</button>
						</div>
					</div>
					<div class="sg-actions-list__hole">
						<div class="sg-spinner-container">
							<button class="sg-button-secondary sg-button-secondary--small  sg-button-secondary--peach js-hidden js-stop">${System.data.locale.common.stop}</button>
						</div>
					</div>
				</div>
			</div>
			<div class="sg-content-box__content sg-content-box--spaced-bottom-small process js-hidden">
				<div class="sg-content-box">
					<div class="sg-content-box__title">
						<h2 class="sg-header-secondary status">${System.data.locale.core.reportedCommentsDeleter.deleting}..</h2>
					</div>
					<div class="sg-content-box__content">
						<div class="sg-text pending">${System.data.locale.core.reportedCommentsDeleter.numberOfPending}: <b>0</b></div>
					</div>
					<div class="sg-content-box__content">
						<div class="sg-text deleted">${System.data.locale.core.reportedCommentsDeleter.deleted}: <b>0</b></div>
					</div>
				</div>
			</div>
		</div>`);

		this.$spinner = $(spinner);
		this.$stop = $(".js-stop", this.$panel);
		this.$status = $(".status", this.$panel);
		this.$start = $(".js-start", this.$panel);
		this.$reasons = $(".reasons", this.$panel);
		this.$deleted = $(".deleted > b", this.$panel);
		this.$pending = $(".pending > b", this.$panel);
		this.$processSection = $(".process", this.$panel);
		this.$giveWarning = $("#giveWarning", this.$panel);

		this.RenderReasons();
	}
	RenderReasons() {
		let reasons = System.data.Brainly.deleteReasons.__withTitles.comment;

		$.each(reasons, (name, details) => {
			if (!name.startsWith("__")) {
				let title = details.title || details.text.substring(0, 25) + "...";

				this.$reasons.append(`<option value="${details.id}" title="${details.text}">${title}</option>`);
			}
		});
	}
	BindEvents() {
		this.$li.on("click", "span", this.TogglePanel.bind(this));
		this.$stop.click(this.ManuelStop.bind(this));
		this.$start.click(this.StartDeleting.bind(this));
	}
	TogglePanel() {
		if (this.$panel.is(":visible")) {
			this.$panel.appendTo("</ div>");
		} else {
			this.$panel.appendTo(this.$li);
		}
	}
	ManuelStop() {
		this.Stop();
		this.$start.text(System.data.locale.common.continue);
	}
	Stop() {
		this.StopDeleting();
		this.StopFetching();
	}
	StopDeleting() {
		clearInterval(this.resetCounterInterval);
		clearInterval(this.deleteProcessInterval);

		this.deleteProcessInterval = null;

		this.$stop.addClass("js-hidden");
		this.$spinner.appendTo("</ div>");
		this.$start.removeClass("sg-button-secondary--disabled").prop("disabled", false);
		this.$status.text(`${System.data.locale.core.reportedCommentsDeleter.stopped}..`);
	}
	StopFetching() {
		this.started = false;
	}
	async StartDeleting() {
		let reasonId = this.$reasons.val();
		this.selectedReason = System.data.Brainly.deleteReasons.__withIds.comment[reasonId];

		if (!this.selectedReason) {
			notification(System.data.locale.common.moderating.selectReason, "info");
		} else if (this.started) {
			notification(System.data.locale.core.notificationMessages.alreadyStarted, "info");
		} else {
			this.started = true;

			this.$spinner.appendTo(this.$start);
			this.$start.addClass("sg-button-secondary--disabled").prop("disabled", true);
			this.$status.text(`${System.data.locale.core.reportedCommentsDeleter.deleting}..`);

			System.log(23);
			await this.LoadReportedComments(this.last_id);

			this.DeleteStoredReports();
			this.$stop.removeClass("js-hidden");
			this.$processSection.removeClass("js-hidden");
		}
	}
	async LoadReportedComments(last_id) {
		let resReports = await GetReportedComments(last_id);

		this.CheckData(resReports);

		return Promise.resolve(resReports);
	}
	CheckData(res) {
		if (res && res.data) {
			if (res.data.items) {
				if (res.data.items.length == 0 && !res.data.last_id) {
					this.StopFetching();
				} else {
					this.last_id = res.data.last_id;

					this.StoreReports(res.data.items);
					this.$pending.text(this.reports.length);
				}

				if (res.data.last_id && this.started) {
					this.LoadReportedComments(res.data.last_id);
				}
			}
		}
	}
	StoreReports(reports) {
		reports.forEach(report => this.reports.push(report));
	}
	DeleteStoredReports() {
		this.deleteProcessInterval = setInterval(this.DeleteStoredReport.bind(this));
		this.resetCounterInterval = setInterval(() => {
			this.activeConnections = 0;
		}, 1000);
	}
	DeleteStoredReport() {
		if (this.reports.length == 0) {
			this.Stop();
			this.HideStartButton();
		} else if (this.activeConnections < 6) {
			this.activeConnections++;
			let report = this.GrabReport();

			this.DeleteReport(report);
		}
	}
	HideStartButton() {
		this.$start.appendTo("<div />");
	}
	GrabReport() {
		let report = this.reports.shift();

		return report;
	}
	async DeleteReport(report) {
		let data = {
			model_id: report.model_id,
			reason_id: this.selectedReason.category_id,
			reason: this.selectedReason.text,
			give_warning: this.$giveWarning.is(":checked")
		};

		await RemoveComment(data);
		//await System.Delay();
		this.ContentDeleted();
	}
	ContentDeleted() {
		this.$pending.text(this.reports.length);
		this.$deleted.text(++this.deletedReportsCount);
	}
}

export default ReportedCommentsDeleter
