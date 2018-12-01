import WaitForElement from "../../../helpers/WaitForElement";

/**
 * Mod actions count number into profile box at top of the page
 */
export default async function addTodaysActions() {
	let $todaysActions = $(`
	<div style="margin: -4px 0 3px;">
		<span class="sg-text sg-text--obscure sg-text--gray sg-text--capitalize">${System.data.locale.home.todaysActions}: </span>
		<span class="sg-text sg-text--obscure sg-text--gray sg-text--emphasised">${System.data.Brainly.userData.user.mod_actions_count}</span>
	</div>`);
	let infoBox = await WaitForElement(selectors.userInfoBoxPoints);

	if (infoBox) {
		$todaysActions.insertBefore(infoBox)
	}
}
