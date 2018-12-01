import makeToplayer from "../Toplayer"
import notification from "../../components/Notification";

class ModalToplayer {
	constructor(heading, content, actions, addAfter = "", size) {
		this.$ = $(`
		<div class="js-modal">
			<div class="sg-overlay"></div>
		</div>`);

		$(".sg-overlay", this.$).append(makeToplayer(size || "medium", heading, content, actions, addAfter));

		return this;
	}
	notification(message, type = "", permanent = false) {
		let $notification = notification(message, type, permanent);
		
		if ($notification) {
			let $closeIcon = $(".sg-toplayer__close", this.$);

			$notification.css("z-index", 2);
			$notification.insertBefore($closeIcon);
		}
	}
}
export default ModalToplayer;
