import Toplayer from ".";
import notification from "../notification";

class ModalToplayer extends Toplayer {
	constructor(options) {
		super(options);

		this.RenderModal();
	}
	RenderModal() {
		this.$modal = $(`
		<div class="js-modal">
			<div class="sg-overlay"></div>
		</div>`);

		this.$overlay = $(".sg-overlay", this.$modal);

		this.$toplayer.appendTo(this.$overlay);
	}
	Close() {
		this.$modal.appendTo("<div />>");
	}
	Open() {
		this.$modal.appendTo("div.js-toplayers-container");
	}
	notification(message, type = "", makePermanent = false) {
		let $notification = notification(message, type, makePermanent);

		if ($notification) {
			$notification.css("z-index", 2);
			$notification.insertBefore(this.$close);
		}
	}
}
export default ModalToplayer;
