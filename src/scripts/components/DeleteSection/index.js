import DeleteReasonCategoryList from "../DeleteReasonCategoryList";

class DeleteSection {
	constructor(reasons, type) {
		this.type = type;
		this.selectedReason;
		this.reasons = reasons;

		this.Render();
		this.RenderReasons();
		this.RenderReasonWarning();
		this.BindEvents();
	}
	Render() {
		this.$ = $(`
		<div class="sg-content-box sg-content-box--spaced-top-xxlarge sg-content-box--spaced-bottom sg-content-box--full">
			<div class="sg-content-box__actions">
				<div class="sg-horizontal-separator"></div>
				<div class="sg-actions-list sg-content-box__actions--spaced-top sg-content-box__actions--spaced-bottom reasons"></div>
				<div class="sg-horizontal-separator js-hidden"></div>
				<div class="sg-actions-list sg-content-box__actions--spaced-top sg-content-box__actions--spaced-bottom sub-reasons"></div>
			</div>
			<div class="sg-content-box__actions">
				<textarea class="sg-textarea sg-textarea--invalid sg-textarea--full-width"></textarea>
			</div>
			<div class="sg-content-box__actions">
				${this.type == "task" || this.type == "response"? `
					<div class="sg-label sg-label--secondary" >
						<div class="sg-label__icon" title="${System.data.locale.common.moderating.takePoints[this.type].title}">
							<div class="sg-checkbox">
								<input type="checkbox" class="sg-checkbox__element" id="take_points">
								<label class="sg-checkbox__ghost" for="take_points">
								<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
									<use xlink:href="#icon-check"></use>
								</svg>
								</label>
							</div>
						</div>
						<label class="sg-label__text" for="take_points">${System.data.locale.common.moderating.takePoints[this.type].text}</label>
					</div>
					<div class="sg-vertical-separator sg-vertical-separator--small"></div>
					${this.type == "task"? `
						<div class="sg-label sg-label--secondary" >
							<div class="sg-label__icon" title="${System.data.locale.common.moderating.returnPoints.title}">
								<div class="sg-checkbox">
									<input type="checkbox" class="sg-checkbox__element" id="return_points">
									<label class="sg-checkbox__ghost" for="return_points">
									<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
										<use xlink:href="#icon-check"></use>
									</svg>
									</label>
								</div>
							</div>
							<label class="sg-label__text" for="return_points">${System.data.locale.common.moderating.returnPoints.text}</label>
						</div>
						<div class="sg-vertical-separator sg-vertical-separator--small"></div>`
						:""
					}`
					:""
				}
				<div class="sg-label sg-label--secondary" >
					<div class="sg-label__icon" title="${System.data.locale.common.moderating.giveWarning.title}">
						<div class="sg-checkbox">
							<input type="checkbox" class="sg-checkbox__element" id="give_warning">
							<label class="sg-checkbox__ghost" for="give_warning">
							<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
								<use xlink:href="#icon-check"></use>
							</svg>
							</label>
						</div>
					</div>
					<label class="sg-label__text" for="give_warning">${System.data.locale.common.moderating.giveWarning.text}</label>
				</div>
			</div>
		</div>`);

		this.$textarea = $('textarea', this.$);
		this.$takePoints = $('#take_points', this.$);
		this.$giveWarning = $('#give_warning', this.$);
		this.$returnPoints = $('#return_points', this.$);
		this.$reasonsContainer = $('.reasons', this.$);
		this.$subReasonsContainer = $('.sub-reasons', this.$);
		this.$firstHorizontalSeparator = $(".sg-horizontal-separator:first", this.$);
	}
	RenderReasons() {
		this.$reasons = $(DeleteReasonCategoryList(this.reasons, this.type));
		this.$reasonsRadios = $('input', this.$reasons);

		this.$reasons.appendTo(this.$reasonsContainer);
	}
	RenderReasonWarning() {
		this.$selectReasonWarning = $(`<div class="sg-bubble sg-bubble--bottom sg-bubble--row-start sg-bubble--peach sg-text--light">${System.data.locale.common.moderating.selectReason}</div>`);
	}
	BindEvents() {
		let that = this;

		this.$reasonsRadios.change(function() {
			let id = System.ExtractId(this.id);
			that.selectedReason = that.reasons.find(reason => reason.id == id);

			that.UpdateTextarea("");
			that.HideReasonWarning();
			that.RenderSubReasons(id);
			that.ShowSubReasonSeperator();
		});

		this.$subReasonsContainer.on("change", "input", function() {
			let id = System.ExtractId(this.id);
			let subReason = that.selectedReason.subcategories.find(reason => reason.id == id);

			that.UpdateTextarea(subReason.text);
		});
	}
	/**
	 * @param {string} text
	 */
	UpdateTextarea(text) {
		this.$textarea.val(text);
	}
	RenderSubReasons() {
		this.$subReasons = $(DeleteReasonCategoryList(this.selectedReason.subcategories, "sub-reasons"));

		this.$subReasonsContainer.html("");
		this.$subReasonsContainer.append(this.$subReasons);
	}
	ShowSubReasonSeperator() {
		let $reasonSeperator = $('div.sg-horizontal-separator', this.$);

		$reasonSeperator.removeClass("js-hidden");
	}
	ShowReasonWarning() {
		if (this.$selectReasonWarning.parents("body").length == 0) {
			this.$selectReasonWarning.insertAfter(this.$firstHorizontalSeparator);
		} else {
			this.$selectReasonWarning
				.fadeTo('fast', 0.5)
				.fadeTo('fast', 1)
				.fadeTo('fast', 0.5)
				.fadeTo('fast', 1);
		}

		this.$selectReasonWarning.focus();
	}
	async HideReasonWarning() {
		await this.$selectReasonWarning.slideUp('fast').promise();
		this.$selectReasonWarning.appendTo("<div />").show()
	}
	get reasonText() {
		return this.$textarea.val();
	}
	get takePoints() {
		return this.$takePoints.is(':checked');
	}
	get giveWarning() {
		return this.$giveWarning.is(':checked');
	}
	get returnPoints() {
		return this.$returnPoints.is(':checked');
	}
}

export default DeleteSection
