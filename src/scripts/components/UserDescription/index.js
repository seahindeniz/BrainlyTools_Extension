export default description => {
	let $userDescription = $(`
	<div class="userDescription">
		<b>${System.data.locale.texts.globals.userDescription} </b>
		<span>${description || " -"}</span>
	</div>`);

	return $userDescription
}
