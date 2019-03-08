import { ConfirmContent, GetCorrectedContents } from "../../../controllers/ActionsOfBrainly";
import WaitForElement from "../../../helpers/WaitForElement";

class WrongContentConfirmer {
	constructor() {
		this.contents = [];
		this.started = false;

		this.RenderButtons();
		this.BindEvents();
	}
	RenderButtons() {
		this.$stopButton = $(`<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--peach" style="margin-left: 1em;">${System.data.locale.common.stop}</button>`);
		this.$confirmButton = $(`<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--alt" style="margin-left: 1em;">${System.data.locale.moderateAll.wrongContentConfirmer.text}</button>`);
	}
	async BindEvents() {
		let filters = await WaitForElement("#moderation-all > div.top > div.sub-header.row > div.span5 > select.filters");
		this.$filters = $(filters);
		this.$pendingWrongLink = $(".pending-wrong");

		this.$filters.change(this.FiltersChanged.bind(this));
		this.$pendingWrongLink.click(this.FiltersChanged.bind(this));
		this.$confirmButton.click(this.Start.bind(this));
		this.$stopButton.click(this.Stop.bind(this));
	}
	FiltersChanged() {
		if (this.$filters.val() == 999) {
			this.ShowConfirmButton();
		} else {
			this.HideConfirmButton();
		}
	}
	ShowConfirmButton() {
		this.$confirmButton.insertAfter(this.$pendingWrongLink);
	}
	HideConfirmButton() {
		this.$confirmButton.appendTo("<div />");
	}
	Start() {
		if (!this.started) {
			this.started = true;
			this.confirmingStopped = false;

			this.ShowStopButton();
			this.StartFetching();
		}
	}
	Stop() {
		this.confirmingStopped = true;

		this.StopFetching();
	}
	ShowStopButton() {
		this.HideConfirmButton();
		this.$stopButton.insertAfter(this.$pendingWrongLink);
	}
	HideStopButton() {
		this.$stopButton.appendTo("<div />");
	}
	StopFetching() {
		this.started = false;

		this.ShowConfirmButton();
	}
	async StartFetching() {
		if (this.started) {
			let resContents = await GetCorrectedContents(this.last_id);
			console.log(resContents);

			if (resContents && resContents.success && resContents.data.items && resContents.data.items.length > 0) {
				this.last_id = resContents.data.last_id;
				this.StoreContents(resContents.data.items);
				this.StartFetching();
				this.ConfirmContent();
			} else {
				this.StopFetching();
			}
		}
	}
	/**
	 * @param {[]} contents
	 */
	StoreContents(contents) {
		this.contents = [...this.contents, ...contents];
	}
	async ConfirmContent() {
		try {
			if (!this.confirmingStopped) {
				let content = this.PullContent();

				if (!content) {
					this.confirmingStopped = true;
				} else {
					let resConfirm = await ConfirmContent(content.model_id, content.model_type_id);
					console.log(resConfirm);
					this.ConfirmContent();
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
	PullContent() {
		return this.contents.shift();
	}
}

export default WrongContentConfirmer
