"use strict";

import { RemoveAnswer, ApproveAnswer } from "../../controllers/ActionsOfBrainly";
import DeleteSection from "../../components/DeleteSection";
import Notification from "../../components/Notification";

let selectors = window.selectors,
	$moderateActions = window.$moderateActions;

//WaitForElm('#content-old > div > div > table > tbody > tr:nth-child(1) > td', () => {
let $contentRows = $(selectors.contentRows);
let $tableContentBody = $(selectors.tableContentBody);
let onPageIsProcess = false;
window.onbeforeunload = function() {
	if (onPageIsProcess) {
		return System.data.locale.texts.globals.warning_ongoingProcess;
	}
}
/**
 * Action buttons
 */
let $actions = $(`
<div class="sg-content-box sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large">
	<div class="sg-content-box__content sg-content-box__content--full">
		<div class="sg-actions-list">
			<div class="sg-actions-list__hole"><button class="sg-button-secondary sg-button-secondary--peach deleteSection">${System.data.locale.texts.globals.moderate}</button></div>
			<div class="sg-actions-list__hole">
				<div class="sg-spinner-container">
					<button class="sg-button-secondary approve">${System.data.locale.texts.answer_approve.approve}</button>
				</div>
			</div>
		</div>
	</div>
</div>`);
$actions.appendTo($("td", $moderateActions));
$("button.deleteSection", $actions).click(() => $("#deleteSection", $moderateActions).slideToggle("fast"));

/**
 * Approving
 */
$("button.approve", $actions).click(function() {
	let $checkedContentSelectCheckboxes = $('tr:not(.approved) input[type="checkbox"]:checked:not([disabled])', $tableContentBody);
	let $alreadyApproved = $('tr.approved input[type="checkbox"]:checked:not([disabled])', $tableContentBody);

	if ($alreadyApproved.length > 0) {
		$alreadyApproved.prop("checked", false);
		Notification(System.data.locale.texts.user_content.warning_someOfSelectedAnswersAreApproved, "info");
	}

	if ($checkedContentSelectCheckboxes.length == 0) {
		Notification(System.data.locale.texts.user_content.warning_selectAnUnapprovedAnswerForApproving, "info");
	} else {
		if (confirm(System.data.locale.texts.user_content.message_confirmApproving)) {
			let $progressBarContainer = $("#approveProgress", $moderateActions);

			if ($progressBarContainer.length == 0) {
				$progressBarContainer = $(`<div id="approveProgress" class="sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large"><progress class="progress is-info" value="0" max="${$checkedContentSelectCheckboxes.length}" data-label="${System.data.locale.texts.globals.progressing}"></progress></div>`);

				$progressBarContainer.appendTo($("td", $moderateActions));
			}

			let $progressBar = $("progress", $progressBarContainer);

			$progressBarContainer.show();

			onPageIsProcess = true;
			let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter(this);
			let counter = 0;

			let updateCounter = () => {
				counter++;

				$progressBar.val(counter);

				if (counter == $checkedContentSelectCheckboxes.length) {
					$spinner.remove();
					$progressBar.attr("data-label", System.data.locale.texts.globals.allDone)
					$progressBar.attr("class", "progress is-success");
					onPageIsProcess = false;
				}
			}

			$checkedContentSelectCheckboxes.each(function() {
				let $parentRow = $(this).parents("tr");
				let responseId = $parentRow.data("responseid");

				ApproveAnswer(responseId, res => {
					if (!res) {
						Notification(System.data.locale.texts.globals.errors.went_wrong, "error");
					} else {
						if (res.success) {
							$(`<span class="approved">🗸</span>`).insertBefore($("> td > a", $parentRow));
							$parentRow.addClass("approved");
							updateCounter();
						} else if (res.message) {
							Notification(res.message, "error");
						}
					}
				});
			});

		}
	}
});

/**
 * Delete panel
 */
let $deleteSection = DeleteSection(System.data.Brainly.deleteReasons.response, "response");
let $categories = $(".categories", $deleteSection);
let $textarea = $('textarea', $deleteSection);
let $take_points = $('#take_points', $deleteSection);
let $give_warning = $('#give_warning', $deleteSection);

let $submitContainer = $(`
<div class="sg-spinner-container">
	<button class="sg-button-secondary sg-button-secondary--peach js-submit">${System.data.locale.texts.moderate.confirm} !</button>
</div>`).appendTo($deleteSection);

$deleteSection.hide()
$deleteSection.appendTo($("td", $moderateActions));

let $submit = $(".js-submit", $submitContainer);

$submit.click(function() {
	let $checkedContentSelectCheckboxes = $('input[type="checkbox"]:checked:not([disabled])', $tableContentBody);
	let $selectResponseWarn = $(".selectResponseWarn", $moderateActions);

	if ($checkedContentSelectCheckboxes.length == 0) {
		if ($selectResponseWarn.length == 0) {
			$(`<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--light selectResponseWarn">${System.data.locale.texts.user_content.select_an_answer_first}</div>`).prependTo($("td", $moderateActions));
		} else {
			$selectResponseWarn.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
		}
	} else {
		$selectResponseWarn.remove();
		let $selectReasonWarn = $(".selectReasonWarn", $deleteSection);

		if (!window.selectedCategory) {
			if ($selectReasonWarn.length == 0) {
				$(`<div class="sg-bubble sg-bubble--bottom sg-bubble--row-start sg-bubble--peach sg-text--light selectReasonWarn">${System.data.locale.texts.moderate.choose_reason}</div>`).insertBefore($categories)
			} else {
				$selectReasonWarn.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
			}
		} else {
			if (confirm(System.data.locale.texts.moderate.do_you_want_to_delete)) {
				let $progressBarContainer = $("#deleteProgress", $moderateActions);

				if ($progressBarContainer.length == 0) {
					$progressBarContainer = $(`<div id="deleteProgress" class="sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large"><progress class="progress is-info" value="0" max="${$checkedContentSelectCheckboxes.length}" data-label="${System.data.locale.texts.globals.progressing}"></progress></div>`);

					$progressBarContainer.appendTo($("td", $moderateActions));
				}

				let $progressBar = $("progress", $progressBarContainer);

				$progressBarContainer.show();

				onPageIsProcess = true;
				let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter(this);
				let counter = 0;

				let updateCounter = () => {
					counter++;

					$progressBar.val(counter);

					if (counter == $checkedContentSelectCheckboxes.length) {
						$spinner.remove();
						$progressBar.attr("data-label", System.data.locale.texts.globals.allDone)
						$progressBar.attr("class", "progress is-success");
						onPageIsProcess = false;
					}
				}

				let idList = [];

				$checkedContentSelectCheckboxes.each(function() {
					let $parentRow = $(this).parents("tr");
					let responseId = $parentRow.data("responseid");
					let responseData = {
						model_id: responseId,
						reason_id: window.selectedCategory.id,
						reason: $textarea.val(),
						give_warning: $give_warning.is(':checked'),
						take_points: $take_points.is(':checked')
					};

					idList.push(responseId);

					RemoveAnswer(responseData, res => {
						if (!res) {
							Notification(System.data.locale.texts.globals.errors.went_wrong, "error");
						} else {
							if (res.success) {
								$(this).attr("disabled", "disabled")
								$parentRow.addClass("removed");
								updateCounter();
							} else if (res.message) {
								Notification(res.message, "error");
							}
						}
					});
				});

				System.log(6, sitePassedParams[0], idList);
			}
		}
	}
});
