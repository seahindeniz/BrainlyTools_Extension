"use strict";

import DeleteSection from "../../components/DeleteSection";
import notification from "../../components/notification";
import { GetTaskContent, RemoveComment } from "../../controllers/ActionsOfBrainly";

let selectors = window.selectors,
	$moderateActions = window.$moderateActions;

let $tableContentBody = $(selectors.tableContentBody);
let $contentRows = $(selectors.contentRows);
let $contentLinks = $(selectors.contentLinks);
let isPageProcessing = false;

window.onbeforeunload = function() {
	if (isPageProcessing) {
		return System.data.locale.common.notificationMessages.ongoingProcess;
	}
}

/**
 * Prepare comment id's
 */
let requestedTasks = [];
let processComments = comments => {
	$contentLinks.each(function() {
		let commentText = this.innerText || "";
		commentText = commentText.replace(/\.\.\.$/gm, "");
		let commentCreatedDate = $(this).parent().nextAll(":last-child").text();

		if (commentText && commentText != "") {
			let foundComment = comments.find(comment => {
				return comment.content.replace(/\s{2,}/, " ").startsWith(commentText) &&
					comment.created.replace(/T|\+.*/gim, " ").startsWith(commentCreatedDate);
			});

			if (foundComment) {
				$(this).parents("tr").attr("data-commentId", foundComment.id);
			}
		}
	});
};

$contentLinks.each(async function() {
	let taskId = this.href.split("/").pop();

	this.setAttribute("target", "_blank");

	if (taskId > 0 && requestedTasks.indexOf(taskId) < 0) {
		requestedTasks.push(taskId);

		let res = await GetTaskContent(taskId);

		if (res) {
			let comments = []

			if (res.data.task.comments.items && res.data.task.comments.items.length > 0) {
				comments = [...comments, ...res.data.task.comments.items]
			}

			if (res.data.responses && res.data.responses.length > 0) {
				res.data.responses.forEach(response => {
					if (response.comments.items && response.comments.items.length > 0) {
						comments = [...comments, ...response.comments.items];
					}
				});
			}

			if (comments.length > 0) {
				processComments(comments);
			}
		}
	}
});

/**
 * Prepare delete section
 */
let $deleteSection = DeleteSection(System.data.Brainly.deleteReasons.comment, "comment");
let $categories = $(".categories", $deleteSection);
let $textarea = $('textarea', $deleteSection);
let $give_warning = $('#give_warning', $deleteSection);

$deleteSection.appendTo($("td", $moderateActions));

let $submitContainer = $(`
<div class="sg-spinner-container">
	<button class="sg-button-secondary sg-button-secondary--peach js-submit">${System.data.locale.common.moderating.confirm} !</button>
</div>`).insertAfter($deleteSection);
let $submit = $(".js-submit", $submitContainer);

$submit.click(function() {
	let $checkedContentSelectCheckboxes = $('input[type="checkbox"]:checked:not([disabled])', $tableContentBody);
	let $selectAComment_warning = $(".selectAComment_warning", $moderateActions);

	if ($checkedContentSelectCheckboxes.length == 0) {
		if ($selectAComment_warning.length == 0) {
			$(`<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--light selectAComment_warning">${System.data.locale.userContent.notificationMessages.selectAtLeasetOneComment}</div>`).prependTo($("td", $moderateActions));
		} else {
			$selectAComment_warning.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
		}
	} else {
		$selectAComment_warning.remove();
		let $selectAReason_warning = $(".selectAReason_warning", $deleteSection);

		if (!window.selectedCategory) {
			if ($selectAReason_warning.length == 0) {
				$(`<div class="sg-bubble sg-bubble--bottom sg-bubble--row-start sg-bubble--peach sg-text--light selectAReason_warning">${System.data.locale.common.moderating.selectReason}</div>`).insertBefore($categories)
			} else {
				$selectAReason_warning.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
			}
		} else {
			$selectAReason_warning.remove();
			if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
				let $progressBarContainer = $("#commentProgress", $moderateActions);

				if ($progressBarContainer.length == 0) {
					$progressBarContainer = $(`<div id="commentProgress" class="progress-container sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large"><progress class="progress is-info" value="0" max="${$checkedContentSelectCheckboxes.length}" data-label="${System.data.locale.common.progressing}"></progress></div>`);

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
					let model_id = $parentRow.data("commentid");
					let commentData = {
						model_id,
						reason_id: window.selectedCategory.id,
						reason: $textarea.val(),
						give_warning: $give_warning.is(':checked'),
					};

					idList.push(model_id);
					
					let res = await RemoveComment(commentData);

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

				System.log(7, sitePassedParams[0], idList);
			}
		}
	}
});
