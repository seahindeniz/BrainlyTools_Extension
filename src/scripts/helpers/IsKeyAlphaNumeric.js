/**
 * @param {KeyboardEvent} event
 */
function IsKeyAlphaNumeric(event) {
	return !(
		event.ctrlKey ||
		(
			event.keyCode >= 14 && event.keyCode <= 31 ||
			event.keyCode >= 33 && event.keyCode <= 46 ||
			event.keyCode >= 91 && event.keyCode <= 95 ||
			event.keyCode >= 112 && event.keyCode <= 135 ||
			event.keyCode >= 246 ||
			(/^(?:3|6|8|9|12|144|145|224|225)$/).test(event.keyCode)
		)
	)
}

export default IsKeyAlphaNumeric
