"use strict";

import { RemoveAnswer, ApproveAnswer } from "../../controllers/ActionsOfBrainly";
import DeleteSection from "../../components/DeleteSection";
import Notification from "../../components/Notification";

let selectors = window.selectors,
	$moderateActions = window.$moderateActions;

//WaitForElm('#content-old > div > div > table > tbody > tr:nth-child(1) > td', () => {
let $contentRows = $(selectors.contentRows);
let $tableContentBody = $(selectors.tableContentBody);
let isPageProcessing = false;
window.onbeforeunload = function() {
	if (isPageProcessing) {
		return System.data.locale.common.notificationMessages.ongoingProcess;
	}
}
/**
 * Action buttons
 */
let $actions = $(`
<div class="sg-content-box sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large">
	<div class="sg-content-box__content sg-content-box__content--full">
		<div class="sg-actions-list"></div>
	</div>
</div>`);
$actions.appendTo($("td", $moderateActions));

let $actionsList = $(".sg-actions-list", $actions);

/**
 * Approving
 */
System.checkUserP(6, () => {
	let $btnApprove = $(`
	<div class="sg-actions-list__hole">
		<div class="sg-spinner-container">
			<button class="sg-button-secondary approve">${System.data.locale.common.moderating.approve}</button>
		</div>
	</div>`);

	$btnApprove.appendTo($actionsList);

	$("button.approve", $btnApprove).click(function() {
		let $checkedContentSelectCheckboxes = $('tr:not(.approved) input[type="checkbox"]:checked:not([disabled])', $tableContentBody);
		let $alreadyApproved = $('tr.approved input[type="checkbox"]:checked:not([disabled])', $tableContentBody);

		if ($alreadyApproved.length > 0) {
			$alreadyApproved.prop("checked", false);
			Notification(System.data.locale.common.moderating.notificationMessages.someOfSelectedAnswersAreApproved, "info");
		}

		if ($checkedContentSelectCheckboxes.length == 0) {
			Notification(System.data.locale.common.moderating.notificationMessages.selectAnUnapprovedAnswerForApproving, "info");
		} else {
			if (confirm(System.data.locale.common.moderating.notificationMessages.confirmApproving)) {
				let $progressBarContainer = $("#approveProgress", $moderateActions);

				if ($progressBarContainer.length == 0) {
					$progressBarContainer = $(`<div id="approveProgress" class="progress-container sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large"><progress class="progress is-info" value="0" max="${$checkedContentSelectCheckboxes.length}" data-label="${System.data.locale.common.progressing}"></progress></div>`);

					$progressBarContainer.appendTo($("td", $moderateActions));
				}

				let $progressBar = $("progress", $progressBarContainer);

				$progressBarContainer.show();

				isPageProcessing = true;
				let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter(this);
				let counter = 0;

				let updateCounter = () => {
					counter++;

					$progressBar.val(counter);

					if (counter == $checkedContentSelectCheckboxes.length) {
						$spinner.remove();
						$progressBar.attr("data-label", System.data.locale.common.allDone)
						$progressBar.attr("class", "progress is-success");
						isPageProcessing = false;
					}
				}

				$checkedContentSelectCheckboxes.each(function() {
					let $parentRow = $(this).parents("tr");
					let rowNumber = ~~($(">td:eq(1)", $parentRow).text());
					let responseId = $parentRow.data("responseid");

					ApproveAnswer(responseId, res => {
						if (!res) {
							Notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
							updateCounter();
						} else {
							if (!res.success) {
								Notification("#" + rowNumber + " > " + (res.message || System.data.locale.userContent.notificationMessages.alreadyApproved), "error");
								$parentRow.addClass("already");
							}
							$(`<span class="approved">🗸</span>`).insertBefore($("> td > a", $parentRow));
							$parentRow.addClass("approved");
							updateCounter();
						}
					});
				});

			}
		}
	});
});

/**
 * Answer delete panel
 */
System.checkUserP(2, () => {
	let $btnDeleteSection = $(`
	<div class="sg-actions-list__hole">
		<button class="sg-button-secondary sg-button-secondary--peach deleteSection">${System.data.locale.common.moderating.moderate}</button>
	</div>`);
	$btnDeleteSection.appendTo($actionsList);

	$("button.deleteSection", $btnDeleteSection).click(() => $("#deleteSection", $moderateActions).slideToggle("fast"));

	let $deleteSection = DeleteSection(System.data.Brainly.deleteReasons.response, "response");
	let $categories = $(".categories", $deleteSection);
	let $textarea = $('textarea', $deleteSection);
	let $take_points = $('#take_points', $deleteSection);
	let $give_warning = $('#give_warning', $deleteSection);

	let $submitContainer = $(`
	<div class="sg-spinner-container">
		<button class="sg-button-secondary sg-button-secondary--peach js-submit">${System.data.locale.common.moderating.confirm} !</button>
	</div>`).appendTo($deleteSection);

	$deleteSection.hide()
	$deleteSection.appendTo($("td", $moderateActions));

	let $submit = $(".js-submit", $submitContainer);

	$submit.click(function() {
		let $checkedContentSelectCheckboxes = $('input[type="checkbox"]:checked:not([disabled])', $tableContentBody);
		let $selectResponseWarn = $(".selectResponseWarn", $moderateActions);

		if ($checkedContentSelectCheckboxes.length == 0) {
			if ($selectResponseWarn.length == 0) {
				$(`<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--light selectResponseWarn">${System.data.locale.userContent.notificationMessages.selectAtLeasetOneAnswer}</div>`).prependTo($("td", $moderateActions));
			} else {
				$selectResponseWarn.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
			}
		} else {
			$selectResponseWarn.remove();
			let $selectReasonWarn = $(".selectReasonWarn", $deleteSection);

			if (!window.selectedCategory) {
				if ($selectReasonWarn.length == 0) {
					$(`<div class="sg-bubble sg-bubble--bottom sg-bubble--row-start sg-bubble--peach sg-text--light selectReasonWarn">${System.data.locale.common.moderating.selectReason}</div>`).insertBefore($categories)
				} else {
					$selectReasonWarn.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
				}
			} else {
				if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
					let $progressBarContainer = $("#deleteProgress", $moderateActions);

					if ($progressBarContainer.length == 0) {
						$progressBarContainer = $(`<div id="deleteProgress" class="progress-container sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large"><progress class="progress is-info" value="0" max="${$checkedContentSelectCheckboxes.length}" data-label="${System.data.locale.common.progressing}"></progress></div>`);

						$progressBarContainer.appendTo($("td", $moderateActions));
					}

					let $progressBar = $("progress", $progressBarContainer);

					$progressBarContainer.show();

					isPageProcessing = true;
					let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter(this);
					let counter = 0;

					let updateCounter = () => {
						counter++;

						$progressBar.val(counter);

						if (counter == $checkedContentSelectCheckboxes.length) {
							$spinner.remove();
							$progressBar.attr("data-label", System.data.locale.common.allDone)
							$progressBar.attr("class", "progress is-success");
							isPageProcessing = false;
						}
					}

					let idList = [];

					$checkedContentSelectCheckboxes.each(function(i) {
						let $parentRow = $(this).parents("tr");
						let rowNumber = ~~($(">td:eq(1)", $parentRow).text());
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
								Notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
								updateCounter();
							} else {
								if (!res.success && res.message) {
									Notification("#" + rowNumber + " > " + res.message, "error");
									$parentRow.addClass("already");
								}

								$(this).attr("disabled", "disabled")
								$parentRow.addClass("removed");
								updateCounter();
							}
						});
					});

					System.log(6, sitePassedParams[0], idList);
				}
			}
		}
	});
});
