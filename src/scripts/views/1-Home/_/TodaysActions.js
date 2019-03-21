import WaitForElement from "../../../helpers/WaitForElement";

/**
 * This function will add numbers of actions of moderator into profile box
 */
async function TodaysActions() {
	let infoBox = await WaitForElement(selectors.userInfoBoxPoints);
	let $todaysActions = $(`
	<div style="margin: -4px 0 3px;">
		<span class="sg-text sg-text--xsmall sg-text--gray sg-text--capitalize">${System.data.locale.home.todaysActions}: </span>
		<span class="sg-text sg-text--xsmall sg-text--gray sg-text--emphasised">${System.data.Brainly.userData.user.mod_actions_count}</span>
	</div>`);

	$todaysActions.insertBefore(infoBox);
}

export default TodaysActions
