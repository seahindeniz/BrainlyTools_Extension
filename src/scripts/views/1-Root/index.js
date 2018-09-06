import WaitForElm from "../../helpers/WaitForElm";
import WaitForFn from "../../helpers/WaitForFn";
import { RemoveQuestion } from "../../controllers/Actions";
import makeToplayer from "../../components/Toplayer";
import Buttons from "../../components/Buttons";
import Storage from "../../helpers/extStorage";

console.log("Root inject OK!");

let selectors = {
	feeds_parent: ".sg-layout__box.js-feed-stream",
	feed_item: ".js-feed-item",
	feeds_questionsBox_buttonList: ".sg-content-box > .sg-content-box__title .sg-actions-list > .sg-actions-list__hole:first-child",
	questionLink: ".sg-content-box > .sg-content-box__content > a.sg-link",

	toplayerContainer: "body > div.page-wrapper.js-page-wrapper > section > div.js-toplayers-container",

	userInfoBoxPoints: ".sg-layout__aside-content .game-box__element > .game-box__user-info > .game-box__progress-items"
}

/**
 *  Adding remove buttons inside of question boxes
**/
let ext_actions_buttons_click_handler = function () {
	let btn_index = $(this).index();
	let parent_feed = $(this).parents(selectors.feed_item);
	let question_link = $(selectors.questionLink, parent_feed).attr("href");

	if (question_link != "") {
		let question_id = Number(question_link.split("/").pop());

		if (question_id => 0) {
			if (btn_index == 0 || btn_index == 1) {
				console.log(question_id);
				console.log({
					model_id: question_id,
					reason_id: 25,
					reason: "Default"
				});
				console.log(RemoveQuestion);
				/*Actions.RemoveQuestion(question_id, () => {
					console.log(question_id + " is deleted");
				});*/
			}
			else if (btn_index == 2) {
				let $toplayer = makeToplayer(System.data.locale.texts.moderate.description,
					`<div class="rules"></div>
						<div class="subs"></div>
						<textarea class="sg-textarea sg-textarea--invalid sg-textarea--full-width"></textarea>
						<label class="pull-left"><input type="checkbox" class="take_points" title="${System.data.locale.texts.moderate.take_points.description}">${System.data.locale.texts.moderate.take_points.title}</label>
						<label class="pull-left"><input type="checkbox" class="return_points" checked="checked" title="${System.data.locale.texts.moderate.return_points.description}">${System.data.locale.texts.moderate.return_points.title}</label>
						<label class="pull-left"><input type="checkbox" class="give_warning" title="${System.data.locale.texts.moderate.give_warning.description}">${System.data.locale.texts.moderate.give_warning.title}</label>
						`, `
						<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--alt zaman">
							<div class="sg-button-secondary__hole">${System.data.locale.texts.moderate.confirm}</div>
						</button>`
				);
				$toplayer.appendTo(selectors.toplayerContainer);
			}
		}
	}
};
let prepareButtons = Buttons('RemoveQuestion', [
	{
		text: System.data.Brainly.deleteReasons.task[System.data.config.quickDeleteButtonsReasons.task[0]].title,
		type: "peach",
		icon: "x"
	},
	{
		text: System.data.Brainly.deleteReasons.task[System.data.config.quickDeleteButtonsReasons.task[1]].title,
		type: "peach",
		icon: "x"
	},
	{
		text: System.data.locale.texts.moderate.moreOptions,
		type: "alt",
		icon: "stream"
	}
]);
$("body").on("click", ".ext_actions button", ext_actions_buttons_click_handler);
let createQuestionRemoveButtons = nodes => {
	if (nodes) {
		for (let i = 0, node; (node = nodes[i]); i++) {
			node.classList.add("ext-buttons-added");
			let $ext_actions = $(`<div class="ext_actions">${prepareButtons}</div>`);

			$ext_actions.appendTo($(selectors.feeds_questionsBox_buttonList, node));
		}
	}
}
let observeForNewQuestionBoxes = feeds_parent => {
	console.log("feed parent has found");
	WaitForElm('div.js-feed-item:not(.ext-buttons-added)', e => {
		createQuestionRemoveButtons(e);
	});
	$(feeds_parent).observe('added', 'div.js-feed-item:not(.ext-buttons-added)', e => {
		createQuestionRemoveButtons(e.addedNodes);
	});

	System.printLoadedTime();
	System.changeBadgeColor("loaded");
};
let wait_for_feeds_parent = () => {
	console.log("observe has found");
	WaitForElm(selectors.feeds_parent, observeForNewQuestionBoxes)
}
WaitForFn('$().observe', wait_for_feeds_parent);
//WaitForElm(selectors.feed_item, createQuestionRemoveButtons)

/**
 * Mod actions count info in profile box
 */
let todaysActions = $(`
<div style="margin: -4px 0 3px;">
	<span class="sg-text sg-text--obscure sg-text--gray sg-text--capitalize">${System.data.locale.texts.todays_actions}: </span>
	<span class="sg-text sg-text--obscure sg-text--gray sg-text--emphasised">${System.data.Brainly.userData.user.mod_actions_count}</span>
</div>`);
todaysActions.insertBefore(selectors.userInfoBoxPoints);