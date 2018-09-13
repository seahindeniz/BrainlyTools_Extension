"use strict";

import Inject2body from "../../helpers/Inject2body";
import { attachmentIcon } from "../../components/Icons";
import { RemoveQuestion, OpenModerationTicket, GetTaskContent } from "../../controllers/Actions";

Console.log("User Content inject OK!");
System.printLoadedTime();
System.changeBadgeColor("loaded");
window.sitePassedParams && (window.sitePassedParams = JSON.parse(sitePassedParams));
//Console.clear();

if (System.checkRoute(4, "") || System.checkRoute(4, "tasks") || System.checkRoute(4, "responses")) {
	window.selectors = {
		tableHeaderRow: "#content-old > div > div > table > thead > tr",
		tableContentBody: "#content-old > div > div > table > tbody:first",
		contentRows: "#content-old > div > div > table > tbody > tr",
		contentLinks: "#content-old > div > div > table > tbody > tr > td > a"
	}

	let $tableHeaderRow = $(selectors.tableHeaderRow);
	let $tableContentBody = $(selectors.tableContentBody);
	let $contentRows = $(selectors.contentRows);
	let $contentLinks = $(selectors.contentLinks);
	let taskContents = {};

	$tableHeaderRow.prepend(`<th style="width: 5%;"><b>${System.data.locale.texts.user_content.select}</b></th>`);

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
					<label class="sg-label__text" for="selectAll">${System.data.locale.texts.globals.select_all}</label>
				</div>
			</td>
		</tr>
	</tbody>`).insertAfter($tableContentBody);

	let prepareContentBoxes = taskId => {
		let $taskLink = $(`a[href$="${taskId}"]`);
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
					$parentTd.parent().attr("data-responseId", response.id);
					if (response.approved && response.approved.approver && response.user_id == window.sitePassedParams[0]) {
						$(`<span class="approved">🗸</span>`).prependTo($parentTd);
					}
				}
				let responseOwner = taskView.users_data_WithUID[response.user_id];
				let responseAttachments = attachmentPrepare(response.attachments);
				if (responseAttachments && System.checkRoute(4, "responses")) {
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
		</div>`).appendTo($parentTd);
	};
	$contentLinks.each(function() {
		let taskId = this.href.split("/").pop();
		if (taskId > 0) {

			$(this).parents("tr").attr("data-taskId", taskId);
			GetTaskContent(taskId, res => {
				res.users_data_WithUID = {};
				$.each(res.users_data, function() {
					res.users_data_WithUID[this.id] = this;
				});
				taskContents[taskId] = res
				prepareContentBoxes(taskId);
			});
		}
	});

	$contentLinks.click(function(e) {
		if (!(e.ctrlKey || e.shiftKey)) {
			e.preventDefault();
			let $taskContent = $(this).next(".taskContent");
			if ($taskContent.length > 0) {
				$taskContent.toggle();
			}
		}
	});

	$("input#selectAll", window.$moderateActions).click(function() {
		$contentSelectCheckboxes.prop("checked", this.checked);
	});

	if (System.checkRoute(4, "") || System.checkRoute(4, "tasks"))
		Inject2body("/scripts/views/4-UserContent/tasks.js");
	else if (System.checkRoute(4, "responses"))
		Inject2body("/scripts/views/4-UserContent/responses.js");
}
