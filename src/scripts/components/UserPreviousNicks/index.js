export default (user) => {
	let $previousNickBox = $(`
	<div class="previousNicks">
		<b>${System.data.locale.texts.globals.previous_nicks} </b>
		<span>${(user.previousNicks && user.previousNicks.join(", ")) || " -"}</span>
	</div>`);

	return $previousNickBox
}
