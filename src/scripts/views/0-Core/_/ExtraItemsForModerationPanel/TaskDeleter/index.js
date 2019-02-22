"use strict";

import renderModal from "./modal";
import { RemoveQuestion, CloseModerationTicket } from "../../../../../controllers/ActionsOfBrainly";

const TaskDeleter = $seperator => {
	let $taskDeleterLink;

	$taskDeleterLink = $(`
	<li class="sg-menu-list__element TaskDeleter" style="display: table; width: 100%;">
		<span class="sg-text sg-text--link sg-text--blue sg-text--small">${System.data.locale.core.TaskDeleter.text}</span>
	</li>`);

	$taskDeleterLink.insertBefore($seperator);

	$taskDeleterLink.click(() => {
		let modal = renderModal();
		let $modal = modal.$;
		let $textarea = $(".sg-textarea.js-id-input", $modal);
		let $textareaBack = $(".sg-textarea.back", $modal);
		let $questionsWillBeDeleted = $(".sg-content-box__actions .sg-actions-list > .sg-actions-list__hole > .sg-text > span", $modal);
		let $nHasBeenDeleted = $(".sg-content-box__actions .sg-actions-list > .sg-actions-list__hole > .sg-text > b", $modal);
		let $confirmButton = $(".js-submit", $modal);
		let $categories = $(".categories", $modal);
		let $reasonTextarea = $("#deleteSection textarea", $modal);
		let $return_points = $("#return_points", $modal);
		let $give_warning = $("#give_warning", $modal);
		let $take_points = $("#take_points", $modal);

		$textarea
			.css({
				width: $textareaBack.outerWidth(),
				height: $textareaBack.outerHeight()
			}).on({
				scroll: function() {
					$textareaBack.scrollTop(this.scrollTop);
				},
				input: function() {
					$textarea.css({
						width: $textareaBack.outerWidth(),
						height: $textareaBack.outerHeight()
					});
					$textareaBack.html(this.innerHTML);

					//let idList = this.innerText.match(/\d{1,}/gm);
					let idList = System.ExtractIds(this.innerText);
					if (idList && idList.length > 0) {
						idList = Array.from(new Set(idList));

						$questionsWillBeDeleted.text(idList.length);

						let temp = this.innerHTML;

						idList.forEach(id => {
							temp = temp.replace(new RegExp(`((?:\\b|pt)+${id}\\b)`), `<span style="background: #fec83c">$1</span>`);
						});
						$textareaBack.html(temp);
					}
				},
				paste: function(e) {
					e.preventDefault();

					let text = (e.originalEvent || e).clipboardData.getData("text/plain");

					document.execCommand("insertText", false, text);
				}
			});

		let confirmButtonHandler = () => {
			let idList = $textarea.html().match(/\d{1,}/gm);
			let $enterIdWarn = $(".enterIdWarn", $modal);
			let $selectReasonWarn = $(".selectReasonWarn", $modal);

			if (!idList || idList && idList.length == 0) {
				if ($enterIdWarn.length == 0) {
					$(`<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--light enterIdWarn">${System.data.locale.core.notificationMessages.enterIdWarn}</div>`).insertAfter($textarea.parent()).focus()
				} else {
					$enterIdWarn.fadeTo('fast', 0.5).fadeTo('fast', 1).fadeTo('fast', 0.5).fadeTo('fast', 1).focus();
				}
			} else if (!window.selectedCategory) {
				$enterIdWarn.remove();
				if ($selectReasonWarn.length == 0) {
					$(`<div class="sg-bubble sg-bubble--bottom sg-bubble--row-start sg-bubble--peach sg-text--light selectReasonWarn">${System.data.locale.common.moderating.selectReason}</div>`).insertBefore($categories)
				} else {
					$selectReasonWarn.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
				}
			} else {
				$selectReasonWarn.remove();
				$enterIdWarn.remove();

				if (confirm(System.data.locale.core.notificationMessages.warningBeforeDelete)) {

					let taskData = {
						reason_id: window.selectedCategory.id,
						reason: $reasonTextarea.val(),
						give_warning: $give_warning.is(':checked'),
						take_points: $take_points.is(':checked'),
						return_points: $return_points.is(':checked')
					};
					window.isPageProcessing = true;
					let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter($confirmButton);
					let counter = 0;

					$nHasBeenDeleted.parents(".js-hidden").removeClass("js-hidden");

					let updateCounter = () => {
						$nHasBeenDeleted.text(++counter);

						if (counter == idList.length) {
							$spinner.remove();
							window.isPageProcessing = false;
							modal.notification(System.data.locale.core.notificationMessages.deleteProcessDone, "success");
						}
					}
					let removeIt = async id => {
						taskData.model_id = id;
						let res = await RemoveQuestion(taskData);

						CloseModerationTicket(id);

						if (!res) {
							modal.notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
						} else {
							if (res.success) {
								updateCounter();
							} else if (res.message) {
								modal.notification(res.message, "error");
							}
						}
					}

					System.log(5, { user: System.data.Brainly.userData.user, data: idList });
					idList.forEach(id => {
						removeIt(id);
					});
				}
			}
		};

		$confirmButton.click(confirmButtonHandler);
	});

}

export default TaskDeleter
