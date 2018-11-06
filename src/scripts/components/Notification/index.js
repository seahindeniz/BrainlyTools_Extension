/**
 * Trigger Brainly's create flash notification function
 * @param {string} message - Message content as HTML
 * @param {string} type - typeof message > ["", "success", "info", "warning", "failure", "error"]
 * @param {boolean} permanent - Message content as HTML
 */
let makeFlash = (message, type = "", permanent = false) => {
	if (!message || message == "")
		return false;

	let extIcon = `<img src="${System.data.meta.extension.URL}/icons/icon24.png" alt="Brainly Tools" class="notification-brainlyToolsImg">`;

	if (window.Zadanium) {
		type === "error" && (type = "failure");
		Zadanium.namespace('flash_msg').flash.setMsg(extIcon + message, type);
		console.log($("#flash-msg > div.msg:last-child"));
	} else if (window.Application) {
		(type === "warning" || type == "failure") && (type = "error");
		Application.alert.flash.addMessage(extIcon + message, type)
	} else {
		//e = "show-message", n = {type: "error", message: "Test"}
		(type === "warning" || type == "failure") && (type = "error");
		type != "" && (type = " sg-flash__message--" + type)

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
