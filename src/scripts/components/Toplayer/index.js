class Toplayer {
	constructor({ size = "medium", header = "", content = "", actions = "", addAfter = "" } = {}) {
		this.size = size;
		this.header = header;
		this.content = content;
		this.actions = actions;
		this.addAfter = addAfter;

		this.RenderToplayer();
		this.RenderHeader();
		this.RenderContent();
		this.RenderActions();
		this.RenderAdditionalElements();
	}
	RenderToplayer() {
		this.$toplayer = $(`
		<div class="sg-toplayer">
			<div class="sg-toplayer__close">
				<svg class="sg-icon sg-icon--gray-secondary sg-icon--x14">
					<use xlink:href="#icon-x"></use>
				</svg>
			</div>
			<div class="sg-toplayer__wrapper">
				<div class="sg-content-box"></div>
			</div>
		</div>`);

		if (this.size) {
			this.$toplayer.addClass(`sg-toplayer--modal sg-toplayer--${this.size}`);
		}

		this.$close = $(".sg-toplayer__close", this.$toplayer);
		this.$contentContainer = $("> .sg-toplayer__wrapper > .sg-content-box", this.$toplayer);
	}
	RenderHeader() {
		this.$header = $(`<div class="sg-content-box__header">${this.header}</div>`);

		if (this.size) {
			this.$header.addClass("sg-content-box__content--spaced-bottom-large");
		}

		this.$header.appendTo(this.$contentContainer);
	}
	RenderContent() {
		this.$content = $(`<div class="sg-content-box__content">${this.content}</div>`);

		if (this.size) {
			this.$content.addClass("sg-content-box__content--spaced-bottom-large");
		}

		this.$content.appendTo(this.$contentContainer);
	}
	RenderActions() {
		this.$actions = $(`<div class="sg-content-box__actions">${this.actions}</div>`);

		this.$actions.appendTo(this.$contentContainer);
	}
	RenderAdditionalElements() {
		if (this.addAfter) {
			this.$additionalElements = $(this.addAfter);

			this.$additionalElements.appendTo(this.$contentContainer);
		}
	}
	ShowCloseSpinner() {
		let $svg = $("svg", this.$close);

		$(`<div class="sg-spinner sg-spinner--xxsmall"></div>`).insertBefore($svg);
		$svg.remove();
	}
}
export default Toplayer
