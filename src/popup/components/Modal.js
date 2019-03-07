class Modal {
	constructor(element) {
		this.$element = $(element);
		this.$parent = this.$element.parent();

		this.Create();
		this.BindEvents();
	}
	Create() {
		this.$modal = $(`
		<div class="modal is-active">
			<div class="modal-background"></div>
			<div class="modal-content">
				<p class="image"></p>
			</div>
			<button class="modal-close is-large" aria-label="close"></button>
		</div>`);

		this.$content = $(".modal-content > p.image", this.$modal);
		this.$close = $(".modal-close", this.$modal);

		this.$element
			.removeAttr("class")
			.appendTo(this.$content);

		$("video", this.$content)
			.trigger("play")
			.prop("controls", true);

		this.$modal.appendTo("body");
	}
	BindEvents() {
		this.$close.click(this.CloseModal.bind(this));
	}
	async CloseModal() {
		this.$element
			.addClass("preview")
			.trigger("pause")
			.appendTo(this.$parent)
			.prop("controls", false);

		await System.Delay(200);

		this.$modal.remove();
	}
}

export default Modal
