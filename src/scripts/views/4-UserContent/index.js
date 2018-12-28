"use strict";

import InjectToDOM from "../../helpers/InjectToDOM";
import { attachmentIcon } from "../../components/Icons";
import { GetTaskContent } from "../../controllers/ActionsOfBrainly";

System.pageLoaded("User Content inject OK!");

window.sitePassedParams && (window.sitePassedParams = JSON.parse(sitePassedParams));
//Console.clear();

if (System.checkRoute(4, "") || System.checkRoute(4, "tasks") || System.checkRoute(4, "responses") || System.checkRoute(4, "comments_tr")) {
	window.selectors = {
		tableHeaderRow: "#content-old > div > div > table > thead > tr",
		tableContentBody: "#content-old > div > div > table > tbody:first",
		contentRows: "#content-old > div > div > table > tbody > tr:not(.moderateActions)",
		contentLinks: "#content-old > div > div > table > tbody > tr:not(.moderateActions) > td > a"
	}

	let $tableHeaderRow = $(selectors.tableHeaderRow);
	let $tableContentBody = $(selectors.tableContentBody);
	let $contentRows = $(selectors.contentRows);
	let $contentLinks = $(selectors.contentLinks);
	let taskContents = {};

	if (System.checkUserP([1, 2, 6])) {
		$tableHeaderRow.prepend(`<th style="width: 5%;"><b>${System.data.locale.userContent.select}</b></th>`);

		$contentRows.each((i, el) => {
			$(el).prepend(`
			<td>
				<div class="sg-checkbox">
					<input type="checkbox" class="sg-checkbox__element" id="${"select"+i}">
					<label class="sg-checkbox__ghost" for="${"select"+i}">
					<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
						<use xlink:href="#icon-check"></use>
					</svg>
					</label>
				</div>
			</td>`);
		});
		let $contentSelectCheckboxes = $('input[type="checkbox"]', $contentRows);

		window.$moderateActions = $(`
		<tbody>
			<tr class="moderateActions">
				<td colspan="5">
					<div class="sg-label sg-label--secondary" >
						<div class="sg-label__icon">
							<div class="sg-checkbox">
								<input type="checkbox" class="sg-checkbox__element" id="selectAll">
								<label class="sg-checkbox__ghost" for="selectAll">
								<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
									<use xlink:href="#icon-check"></use>
								</svg>
								</label>
							</div>
						</div>
						<label class="sg-label__text" for="selectAll">${System.data.locale.common.selectAll}</label>
					</div>
				</td>
			</tr>
		</tbody>`).insertAfter($tableContentBody);

		$("input#selectAll", window.$moderateActions).click(function() {
			$contentSelectCheckboxes.prop("checked", this.checked);
		});
	}

	let prepareContentBoxes = taskId => {
		let $taskLink = $(`a[href$="${taskId}"]`);
		let $parentTr = $($taskLink).parents("tr");
		let $parentTd = $($taskLink).parent();
		let taskView = taskContents[taskId];
		let task = taskView.data.task;
		let responses = taskView.data.responses;
		let taskOwner = taskView.users_data_WithUID[task.user_id];

		let attachmentPrepare = attachments => {
			let strAttachments = "";
			if (attachments.length > 0) {
				let tempStr = "";
				for (let j = 0, attachment;
					(attachment = attachments[j]); j++) {
					tempStr += `
					<div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
						<div class="brn-attachments__attachment">
							<a href="${attachment.full}" class="brn-attachment" id="${attachment.id}" target="_blank">
								${
									attachment.thumbnail?
									`<div class="sg-box sg-box--image-wrapper">
										<img class="sg-box__image" src="${attachment.thumbnail}">
									</div>`:
									`<div class="sg-box sg-box--dark sg-box--no-border sg-box--image-wrapper">
										<div class="sg-box__hole">
											<span class="sg-link sg-link--gray sg-link--emphasised">${attachment.type}</span>
										</div>
									</div>`
								}
							</a>
						</div>
					</div>`;
				}
				strAttachments += `<div class="attachments"><div class="sg-actions-list">${tempStr}</div></div>`;
			}
			return strAttachments;
		}
		let taskAttachments = attachmentPrepare(task.attachments);
		if (taskAttachments && (System.checkRoute(4, "") || System.checkRoute(4, "tasks"))) {
			$parentTd.prepend(attachmentIcon);
		}
		let responseFields = "";
		if (responses.length > 0) {
			for (let j = 0, response;
				(response = responses[j]); j++) {
				if (System.checkRoute(4, "responses")) {
					if (response.user_id == window.sitePassedParams[0]) {
						$parentTd.parent().attr("data-responseid", response.id);
						if (response.approved && response.approved.approver) {
							$(`<span class="approved">🗸</span>`).prependTo($parentTd);
							$parentTr.addClass("approved");
						}
					}
				}

				let responseOwner = taskView.users_data_WithUID[response.user_id];
				let responseAttachments = attachmentPrepare(response.attachments);

				if (responseOwner.id == sitePassedParams[0] && responseAttachments && System.checkRoute(4, "responses")) {
					$parentTd.prepend(attachmentIcon);
				}

				responseFields += `
				<fieldset class="responseField">
					<legend><a href="${System.createProfileLink(responseOwner.nick, responseOwner.id)}">${responseOwner.nick}</a></legend>
					<div class="content">${response.content + responseAttachments}</div>
				</fieldset>`;
			}
		}

		let $taskContent = $(`
		<div class="taskContent">
			<fieldset class="taskField">
				<legend><a href="${System.createProfileLink(taskOwner.nick, taskOwner.id)}">${taskOwner.nick}</a></legend>
				<div class="content">${task.content}</div>
				${taskAttachments}
			</fieldset>
			${responseFields}
		</div>`);

		$taskContent.appendTo($parentTd);
	};
	let isCommentPage = System.checkRoute(4, "comments_tr");

	$contentLinks.each(async function() {
		let taskId = this.href.split("/").pop();

		if (taskId > 0) {
			$(this).parents("tr").attr("data-taskId", taskId);

			if (!isCommentPage) {
				let res = await GetTaskContent(taskId);

				if (res) {
					res.users_data_WithUID = {};

					res.users_data.forEach(user => {
						res.users_data_WithUID[user.id] = user;
					});

					taskContents[taskId] = res;

					prepareContentBoxes(taskId);
				}
			}
		}
	});

	if (!isCommentPage) {
		$contentLinks.click(function(e) {
			if (!(e.ctrlKey || e.shiftKey)) {
				e.preventDefault();
				let $taskContent = $(this).next(".taskContent");
				if ($taskContent.length > 0) {
					$taskContent.toggle();
				}
			}
		});
	}

	if (System.checkUserP(1) && System.checkRoute(4, "") || System.checkRoute(4, "tasks")) {
		InjectToDOM("/scripts/views/4-UserContent/tasks.js");
	}

	if (System.checkUserP([2, 6]) && System.checkRoute(4, "responses")) {
		InjectToDOM(["/scripts/views/4-UserContent/responses.js"]);
	}

	if (System.checkUserP(45) && System.checkRoute(4, "comments_tr")) {
		InjectToDOM("/scripts/views/4-UserContent/comments.js");
	}
}
