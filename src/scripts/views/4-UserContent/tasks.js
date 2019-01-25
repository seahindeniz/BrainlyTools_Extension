"use strict";

import { RemoveQuestion } from "../../controllers/ActionsOfBrainly";
import DeleteSection from "../../components/DeleteSection";
import notification from "../../components/notification";

let selectors = window.selectors,
	$moderateActions = window.$moderateActions;

let $tableContentBody = $(selectors.tableContentBody);
let $contentRows = $(selectors.contentRows);
let isPageProcessing = false;

window.onbeforeunload = function() {
	if (isPageProcessing) {
		return System.data.locale.common.notificationMessages.ongoingProcess;
	}
}

let $deleteSection = DeleteSection(System.data.Brainly.deleteReasons.task, "task");
let $categories = $(".categories", $deleteSection);
let $textarea = $('textarea', $deleteSection);
let $take_points = $('#take_points', $deleteSection);
let $return_points = $('#return_points', $deleteSection);
let $give_warning = $('#give_warning', $deleteSection);

$deleteSection.appendTo($("td", $moderateActions));

let $submitContainer = $(`
<div class="sg-spinner-container">
	<button class="sg-button-secondary sg-button-secondary--peach js-submit">${System.data.locale.common.moderating.confirm} !</button>
</div>`).insertAfter($deleteSection);
let $submit = $(".js-submit", $submitContainer);

$submit.click(function() {
	let $checkedContentSelectCheckboxes = $('input[type="checkbox"]:checked:not([disabled])', $tableContentBody);
	let $selectATask_warning = $(".selectATask_warning", $moderateActions);

	if ($checkedContentSelectCheckboxes.length == 0) {
		if ($selectATask_warning.length == 0) {
			$(`<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--light selectATask_warning">${System.data.locale.userContent.notificationMessages.selectAtLeasetOneQuestion}</div>`).prependTo($("td", $moderateActions));
		} else {
			$selectATask_warning.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
		}
	} else {
		$selectATask_warning.remove();
		let $selectReasonWarn = $(".selectReasonWarn", $deleteSection);

		if (!window.selectedCategory) {
			if ($selectReasonWarn.length == 0) {
				$(`<div class="sg-bubble sg-bubble--bottom sg-bubble--row-start sg-bubble--peach sg-text--light selectReasonWarn">${System.data.locale.common.moderating.selectReason}</div>`).insertBefore($categories)
			} else {
				$selectReasonWarn.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
			}
		} else {
			$selectReasonWarn.remove();
			if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
				let $progressBarContainer = $("#taskProgress", $moderateActions);

				if ($progressBarContainer.length == 0) {
					$progressBarContainer = $(`<div id="taskProgress" class="progress-container sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large"><progress class="progress is-info" value="0" max="${$checkedContentSelectCheckboxes.length}" data-label="${System.data.locale.common.progressing}"></progress></div>`);

					$progressBarContainer.appendTo($("td", $moderateActions));
				}

				let $progressBar = $("progress", $progressBarContainer);

				$progressBarContainer.show();

				isPageProcessing = true;
				let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter($submit);
				let counter = 0;

				let updateCounter = () => {
					$progressBar.val(++counter);

					if (counter == $checkedContentSelectCheckboxes.length) {
						$spinner.remove();
						$progressBar.attr("data-label", System.data.locale.common.allDone)
						$progressBar.attr("class", "progress is-success");
						isPageProcessing = false;
					}
				}

				let idList = [];
				let removeIt = async that => {
					let $parentRow = $(that).parents("tr");
					let rowNumber = ~~($(">td:eq(1)", $parentRow).text());
					let model_id = $parentRow.data("taskid");
					let taskData = {
						model_id,
						reason_id: window.selectedCategory.id,
						reason: $textarea.val(),
						give_warning: $give_warning.is(':checked'),
						take_points: $take_points.is(':checked'),
						return_points: $return_points.is(':checked')
					};

					idList.push(model_id);

					let res = await RemoveQuestion(taskData);

					CloseModerationTicket(model_id);

					updateCounter();

					if (!res) {
						notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
					} else {
						if (!res.success && res.message) {
							notification("#" + rowNumber + " > " + res.message, "error");
							$parentRow.addClass("already");
						}

						$(this).attr("disabled", "disabled");
						$parentRow.addClass("removed");
					}
				};

				$checkedContentSelectCheckboxes.each(function() {
					removeIt(this);
				});

				System.log(5, sitePassedParams[0], idList);
			}
		}
	}
});
