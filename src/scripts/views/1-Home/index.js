"use strict";

import WaitForElement from "../../helpers/WaitForElement";
import WaitForObject from "../../helpers/WaitForObject";
import addTodaysActions from "./_/addTodaysActions";
import startObservingForDeleteButtons from "./_/startObservingForDeleteButtons";

System.pageLoaded("Root inject OK!");

window.selectors = {
	...window.selectors,
	feeds_parent: ".js-feed-stream",
	feed_item: `div[data-test="feed-item"]`,
	feeds_questionsBox_buttonList: `> div.sg-content-box`,
	questionLink: `.sg-content-box a[data-test="feed-item-link"]`,

	userInfoBoxPoints: ".sg-layout__aside-content .game-box__element > .game-box__user-info > .game-box__progress-items"
}

Home();

async function Home() {
	/**
	 * Add mod actions count number into profile box at top of the page
	 */
	addTodaysActions();

	/**
	 *  Adding remove buttons inside of question boxes
	 **/
	if (System.checkUserP(1) && System.checkBrainlyP(102)) {
		let _$_observe = await WaitForObject("$().observe");
		if (_$_observe) {
			let feeds_parent = await WaitForElement(selectors.feeds_parent);

			if (feeds_parent && feeds_parent.length > 0) {
				feeds_parent[0].classList.add("quickDelete");

				startObservingForDeleteButtons(feeds_parent);
			}
		}
	}
}
