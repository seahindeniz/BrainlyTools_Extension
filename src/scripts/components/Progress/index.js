class Progress {
	constructor(options) {
		// sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large
		this.$container = $(`
		<div class="progress-container">
			<progress class="progress ${options.type}" value="0" max="${options.max || 1}" data-label="${options.label}"></progress>
		</div>`);
		this.$bar = $("progress", this.$container);

		this.$container.click(() => {
			this.forceClose();
		});

		return this;
	}
	setMax(n) {
		this.$bar.attr("max", n);
	}
	update(n) {
		this.$bar.val(n);
		return this;
	}
	UpdateLabel(text) {
		this.$bar.attr("data-label", text);
		return this;
	}
	close() {
		setTimeout(() => this.forceClose(), 3000);
	}
	/**
	 * @param {boolean} ignoreValue
	 */
	forceClose(ignoreValue) {
		if (ignoreValue || this.$bar.val() == ~~this.$bar.attr("max")) {
			this.$container.remove();
		}
	}
}
export default Progress;
