export default description => {
	let $userBio = $(`
	<div class="userBio" title="${System.data.locale.userProfile.userBio.description}">
		<b>${System.data.locale.userProfile.userBio.title} </b>
		<span>${description || " -"}</span>
	</div>`);

	$userBio.insertBefore("#main-left > div.personal_info > div.helped_info")
}
