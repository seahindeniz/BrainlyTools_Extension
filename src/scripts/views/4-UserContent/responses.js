"use strict";

import { RemoveAnswer } from "../../controllers/Actions";
import DeleteSection from "../../components/DeleteSection";

let selectors = window.selectors,
	$moderateActions = window.$moderateActions;

//WaitForElm('#content-old > div > div > table > tbody > tr:nth-child(1) > td', () => {
let $contentRows = $(selectors.contentRows);
let $tableContentBody = $(selectors.tableContentBody);

let $deleteSection = DeleteSection(System.data.Brainly.deleteReasons.response, "response");
let $categories = $(".categories", $deleteSection);
let $textarea = $('textarea', $deleteSection);
let $take_points = $('#take_points', $deleteSection);
let $give_warning = $('#give_warning', $deleteSection);

$deleteSection.appendTo($("td", $moderateActions));

let $submitContainer = $(`
<div class="sg-spinner-container">
	<button class="sg-button-secondary sg-button-secondary--peach js-submit">${System.data.locale.texts.moderate.confirm} !</button>
</div>`).insertAfter($deleteSection);
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
				let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter($submit);
				let countRemove = 0;

				let removeSpinner = i => {
					if (i == $checkedContentSelectCheckboxes.length)
						$spinner.remove();
				}

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
					RemoveAnswer(responseData, (res) => {
						if (res) {
							if (res.success) {
								$(this).attr("disabled", "disabled")
								$parentRow.addClass("removed");
								removeSpinner(++countRemove);
							} else if (res.message) {
								Notification(res.message, "error");
							}
						} else {
							Notification(System.data.locale.texts.globals.errors.went_wrong, "error");
						}
					});
				});
			}
		}
	}
});
