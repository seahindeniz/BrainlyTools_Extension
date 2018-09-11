"use strict";

import WaitForElm from "../../helpers/WaitForElm";
import WaitForFn from "../../helpers/WaitForFn";
import secondsToTime from "../../helpers/secondsToTime";
import { RemoveQuestion, OpenModerationTicket, CloseModerationTicket } from "../../controllers/Actions";
import Buttons from "../../components/Buttons";
import Notification from "../../components/Notification";
import extModeratePanel from "../../components/extModeratePanel";
import Storage from "../../helpers/extStorage";

_console.log("Root inject OK!");

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
let ext_actions_buttons_click_handler = function() {
	let btn_index = $(this).index();
	let parent_feed = $(this).parents(selectors.feed_item);
	let feedContentBox = $(">.sg-content-box", parent_feed)
	let question_link = $(selectors.questionLink, parent_feed).attr("href");

	if (question_link != "") {
		let question_id = Number(question_link.split("/").pop());

		if (question_id => 0) {
			if (btn_index == 0 || btn_index == 1) {
				if (confirm(System.data.locale.texts.moderate.do_you_want_to_delete)) {
					let reason = System.data.Brainly.deleteReasons.task[System.data.config.quickDeleteButtonsReasons.task[btn_index]];
					let taskData = {
						model_id: question_id,
						reason_id: reason.category_id,
						reason: reason.text
					};
					let svg = $("svg", this);
					$(`<div class="sg-spinner sg-spinner--xxsmall sg-spinner--light"></div>`).insertBefore(svg);
					svg.remove();
					RemoveQuestion(taskData, (res) => {
						if (res && res.success) {
							feedContentBox.addClass("sg-flash__message--error");
						}
					});
				}
			} else if (btn_index == 2) {
				OpenModerationTicket(question_id, res => {
					if (!res) {
						Notification(System.data.locale.texts.globals.errors.went_wrong, "error");
					} else if (!res.success) {
						res && Notification(res.message, "error");
					} else {
						let $toplayer = extModeratePanel(res);
						let $closeIcon = $(".sg-toplayer__close", $toplayer);
						let $counter = $(".js-counter", $toplayer);
						let $reasonCategories = $(".reasonCategories", $toplayer);
						let $categoryRadio = $('input[name="categories"]', $toplayer);
						let $reasons = $('div.reasons', $toplayer);
						let $reasonSeperator = $('div.sg-horizontal-separator', $toplayer);
						let $textarea = $('textarea', $toplayer);
						let $take_points = $('#take_points', $toplayer);
						let $return_points = $('#return_points', $toplayer);
						let $give_warning = $('#give_warning', $toplayer);
						let $submit = $('button.js-submit', $toplayer);
						let selectedCategory = null;

						$toplayer.appendTo(selectors.toplayerContainer);

						let closeModPanel = () => {
							let svg = $("svg", $closeIcon);

							$(`<div class="sg-spinner sg-spinner--xxsmall"></div>`).insertBefore(svg);
							svg.remove();
							$closeIcon.off("click");

							CloseModerationTicket(question_id, res => {
								let notifyType = "error"
								if (res.success) {
									notifyType = "info"
								}
								Notification(res.message, notifyType);
								clearInterval(_loop_panelCounter);
								$closeIcon.parents(".js-moderate-modal").remove();
							});
						}

						let panelCounter = () => {
							let time = secondsToTime(--res.data.ticket.time_left);
							if (time.m == 0 && time.s == 0) {
								clearInterval(_loop_panelCounter);
								closeModPanel();
							}

							$counter.html((time.m <= 9 ? "0" + time.m : time.m) + ":" + (time.s <= 9 ? "0" + time.s : time.s));
						}
						panelCounter();
						let _loop_panelCounter = setInterval(panelCounter, 1000);

						$closeIcon.click(closeModPanel);

						$categoryRadio.change(function() {
							$(".selecReasonWarn", $toplayer).remove();
							$reasonSeperator.removeClass("js-hidden");
							$textarea.val("");

							let selectedCategoryId = this.id.replace(/^\D+/g, "");
							selectedCategory = res.data.delete_reasons.task.find((cat) => {
								return cat.id == selectedCategoryId;
							});

							let reasons = "";
							selectedCategory.subcategories.forEach((reason, i) => {
								reasons += `
								<div class="sg-actions-list__hole sg-actions-list__hole--spaced-xsmall">
									<div class="sg-label sg-label--secondary">
										<div class="sg-label__icon">
											<div class="sg-radio sg-radio--undefined">
												<input type="radio" class="sg-radio__element" name="reasons" id="reason${reason.id}">
												<label class="sg-radio__ghost" for="reason${reason.id}"></label>
											</div>
										</div>
										<label class="sg-label__text" for="reason${reason.id}">${reason.title}</label>
									</div>
								</div>`
							});
							$reasons.html(reasons);
						});
						$reasons.on("change", "input", function() {
							let selectedReasonId = this.id.replace(/^\D+/g, "");
							let reason = selectedCategory.subcategories.find((cat) => {
								return cat.id == selectedReasonId;
							});
							$textarea.val(reason.text);
						});
						$submit.click(function() {
							if (!selectedCategory) {
								let $selecReasonWarn = $(".selecReasonWarn", $toplayer);
								if ($selecReasonWarn.length == 0) {
									$(`<div class="sg-bubble sg-bubble--bottom sg-bubble--row-start sg-bubble--peach selecReasonWarn">${System.data.locale.texts.moderate.choose_reason}</div>`).insertBefore($reasonCategories)
								} else {
									$selecReasonWarn.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
								}
							} else {
								$(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter($submit);;
								let taskData = {
									model_id: res.data.task.id,
									reason_id: selectedCategory.id,
									reason: $textarea.val(),
									give_warning: $give_warning.is(':checked'),
									take_points: $take_points.is(':checked'),
									return_points: $return_points.is(':checked')
								};
								RemoveQuestion(taskData, (res) => {
									if (res && res.success) {
										feedContentBox.addClass("sg-flash__message--error");
										$closeIcon.parents(".js-moderate-modal").remove();
										clearInterval(_loop_panelCounter);
									}
								});
							}
						});
					}
				});
			}
		}
	}
};
let prepareButtons = Buttons('RemoveQuestion', [
	{
		text: System.data.Brainly.deleteReasons.task[System.data.config.quickDeleteButtonsReasons.task[0]].title,
		title: System.data.Brainly.deleteReasons.task[System.data.config.quickDeleteButtonsReasons.task[0]].text,
		type: "peach",
		icon: "x"
	},
	{
		text: System.data.Brainly.deleteReasons.task[System.data.config.quickDeleteButtonsReasons.task[1]].title,
		title: System.data.Brainly.deleteReasons.task[System.data.config.quickDeleteButtonsReasons.task[1]].text,
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
		for (let i = 0, node;
			(node = nodes[i]); i++) {
			node.classList.add("ext-buttons-added");
			let $ext_actions = $(`<div class="ext_actions">${prepareButtons}</div>`);

			$ext_actions.appendTo($(selectors.feeds_questionsBox_buttonList, node));
		}
	}
}
let observeForNewQuestionBoxes = feeds_parent => {
	_console.log("feed parent has found");
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
	_console.log("observe has found");
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
