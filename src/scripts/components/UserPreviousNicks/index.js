export default (user) => {
	let $previousNickBox = $(`
	<div class="previousNicks">
		<b title="${System.data.locale.userProfile.previousNicks.title}">${System.data.locale.userProfile.previousNicks.text}: </b>
		<span>${(user.previousNicks && user.previousNicks.join(", ")) || " -"}</span>
	</div>`);

	return $previousNickBox
}
