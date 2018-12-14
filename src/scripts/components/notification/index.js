/**
 * Trigger Brainly's create flash notification function
 * @param {string} message - Message content as HTML or Text
 * @param {string} type - typeof message > ["", "success", "info", "warning", "failure", "error"]
 * @param {boolean} permanent - To make it permanent
 */
let makeFlash = (message, type = "", permanent = false) => {
	if (!message || message == "") {
		return false;
	}

	let extIcon = `<img src="${System.data.meta.extension.URL}/icons/icon24.png" alt="Brainly Tools" class="notification-brainlyToolsImg">`;

	/**
	 * Determine if notification was created on old UI. 
	 * Old UI has the Zadanium object init.
	 */
	if (window.Zadanium) {
		if (type === "error") {
			type = "failure";
		}

		Zadanium.namespace('flash_msg').flash.setMsg(extIcon + message, type);
	} else if (window.Application) {
		if (type === "warning" || type == "failure") {
			type = "error";
		}

		Application.alert.flash.addMessage(extIcon + message, type)
	} else {
		if (type === "warning" || type == "failure") {
			type = "error";
		}

		if (type != "") {
			type = " sg-flash__message--" + type;
		}

		let flash = $(`
		<div class="sg-flash">
			<div class="sg-flash__message${type} js-flash-message">
				${extIcon}
				<div class="sg-text sg-text--to-center sg-text--emphasised sg-text--small sg-text--light">${message}</div>
			</div>
		</div>`);

		flash.appendTo(".flash-messages-container");

		let flashClickHandler = () => flash.remove();

		flash.click(flashClickHandler);
		!permanent && setTimeout(flashClickHandler, 10000);

		return flash;
	}
}

export default makeFlash
