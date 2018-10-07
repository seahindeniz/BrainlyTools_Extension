class Progress {
	constructor(options) {
		// sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large
		this.container = $(`
		<div class="progress-container">
			<progress class="progress ${options.type}" value="0" max="${options.max}" data-label="${options.label}"></progress>
		</div>`);
		this.bar = $("progress", this.container);

		this.container.click(() => {
			this.close();
		});

		return this;
	}
	update(n) {
		this.bar.val(n);
		return this;
	}
	updateLabel(text) {
		this.bar.attr("data-label", text);
		return this;
	}
	close() {
		setTimeout(() => {
			if (this.bar.val() == ~~this.bar.attr("max")) {
				this.container.remove();
			}
		}, 3000);
	}
}
export default Progress;
