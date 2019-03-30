import WaitForElement from "../../../helpers/WaitForElement";

async function TodaysActions() {
	let infoBox = await WaitForElement(selectors.userInfoBoxPoints);

	if (System.data.Brainly.userData.user.mod_actions_count >= 0) {
		let $todaysActions = $(`
		<div style="margin: -4px 0 3px;">
			<a href="/moderation_new/view_moderator/${System.data.Brainly.userData.user.id}" target="_blank">
				<span class="sg-text sg-text--xsmall sg-text--gray sg-text--capitalize">${System.data.locale.home.todaysActions}: </span>
				<span class="sg-text sg-text--xsmall sg-text--gray sg-text--emphasised">${System.data.Brainly.userData.user.mod_actions_count}</span>
			</a>
		</div>`);

		$todaysActions.insertBefore(infoBox);
	}
}

export default TodaysActions
