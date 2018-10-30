"use strict";

import WaitForElm from "../../helpers/WaitForElm";
import WaitForFn from "../../helpers/WaitForFn";
import { getAllModerators, sendMessage } from "../../controllers/ActionsOfBrainly";
import Buttons from "../../components/Buttons";
import Notification from "../../components/Notification";
import Storage from "../../helpers/extStorage";
import Progress from "../../components/Progress";

System.pageLoaded("Supervisors page OK!");

let currentColumn = 0;
let sortIt = userLi => {
	$(`.connectedSortable:eq(${currentColumn++})`).append(userLi);
	if (currentColumn == 5) {
		currentColumn = 0;
	}
}

WaitForElm(".connectedSortable > li", usersLi => {
	let usersID = [];

	usersLi.forEach(userLi => {
		usersID.push(userLi.id);
		sortIt(userLi);
	});

	getAllModerators(usersID, {
		each: user => {
			let avatar = System.prepareAvatar(user);
			let buddyLink = System.createBrainlyLink("profile", { nick: user.nick, id: user.id });
			let $userLi = $(`.connectedSortable li[id="${user.id}"]`);
			let ranks = [];

			if (user.ranks_ids && user.ranks_ids.length > 0) {
				user.ranks_ids.forEach(rankId => {
					let current_rank = System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];
					if (current_rank || rankId == 12) {
						ranks.push(`<span class="" style="color:#${(current_rank.color || "000")};">${current_rank.name}</span>`);
					}
				});
			}

			user.$li = $userLi;
			$userLi.html(`
			<a href="${buddyLink}">
				<div>
					<img src="${avatar}" width="65" height="65">
				</div>
				${user.nick}
			</a>
			<div class="ranks">${ranks.join('<br>')}</div>`);
		},
		done: () => {
			let optionsOfRanks = System.data.Brainly.defaultConfig.config.data.ranks.map(rank => {
				return `<option value="${rank.id}"${rank.color?` style="color:#${rank.color};"`:""}>${rank.name}</option>`;
			});
			let $actionBox = $(`
			<div class="actionBox">
				<div class="ranks">
					<select multiple>
						<option selected value="all">${System.data.locale.supervisors.allRanks}</option>
						${optionsOfRanks}
					</select>
				</div>
				<div class="tableLayout js-hidden">
					<span class="sg-text sg-text--xsmall sg-text--link sg-text--bold sg-text--mint">${System.data.locale.supervisors.tableLayout}</span>
				</div>
			</div>`).insertAfter("#mod_sup");

			let $rankSelect = $(".ranks > select", $actionBox);
			let $tableLayout = $(".tableLayout > span", $actionBox);
			let listedUsers = System.allModerators.list;

			/**
			 * Rank select
			 */
			let rankSelectHandler = function() {
				let selectedRankIds = [...this.selectedOptions].map(option => option.value);
				currentColumn = 0;
				listedUsers = System.allModerators.list.filter(user => {
					if (selectedRankIds.indexOf("all") >= 0 || selectedRankIds.some(v => user.ranks_ids.includes(~~v))) {
						user.$li.removeClass("js-hidden");
						sortIt(user.$li);

						return true;
					} else {
						user.$li.addClass("js-hidden");

						return false;
					}
				});
			};

			$rankSelect.change(rankSelectHandler);

			/**
			 * Table layout
			 */
			let tableLayoutHandler = () => {};

			$tableLayout.click(tableLayoutHandler);

			/**
			 * Message sender
			 */

			System.checkUserP(10, () => {
				let $sendMessage = $(`
				<div class="sendMessage">
					<span class="sg-text sg-text--xsmall sg-text--link sg-text--bold sg-text--blue">${System.data.locale.supervisors.sendMessagesToMods}</span>
					<div class="messageBox js-hidden">
						<textarea class="sg-textarea sg-text--small sg-textarea--tall sg-textarea--full-width" placeholder="${System.data.locale.messages.groups.writeSomething}"></textarea>

						<div class="sg-spinner-container">
							<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--alt js-listed" title="${System.data.locale.supervisors.sendMessagesToListedMods.title}">⇐ ${System.data.locale.supervisors.sendMessagesToListedMods.text}</button>
						</div>
						<div class="sg-spinner-container">
							<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--dark js-all" title="${System.data.locale.supervisors.sendMessagesToAllMods.title}">${System.data.locale.supervisors.sendMessagesToAllMods.text}</button>
						</div>
					</div>
				</div>`);
				let $sendMessageContainer = $("> span", $sendMessage);
				let $messageBox = $("> div.messageBox", $sendMessage);
				let $messageInput = $("> div.messageBox > textarea", $sendMessage);
				let $sendButton = $("> div.messageBox > div > button", $sendMessage);
				let isSending = false;

				$sendMessage.appendTo($actionBox);

				window.onbeforeunload = function() {
					if (isSending) {
						return System.data.locale.common.notificationMessages.ongoingProcess;
					}
				}
				/**
				 * Message box visibility
				 */
				let sendMessageContainerHandler = () => {
					$messageBox.toggleClass("js-hidden");
				};

				$sendMessageContainer.click(sendMessageContainerHandler);

				/**
				 * Send message
				 */
				$sendButton.click(function() {
					let users = [];

					if (this.classList.contains("js-listed")) {
						users = listedUsers;
					} else if (this.classList.contains("js-all")) {
						users = System.allModerators.list
					}

					if (isSending) {
						Notification(System.data.locale.supervisors.notificationMessages.ongoingProcess, "info");
					} else if ($messageInput.val() == "") {
						Notification(System.data.locale.supervisors.notificationMessages.emptyMessage, "info");
						$messageInput.focus();
					} else if (users.length == 0) {
						Notification(System.data.locale.supervisors.notificationMessages.noUser, "info");
						$rankSelect.focus();
					} else {
						isSending = true;
						let message = $messageInput.val();
						let idList = users.map(user => user.id);
						let idListLen = idList.length;
						let previousProgressBars = $("#content-old > .progress-container");
						let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small sg-spinner--light"></div></div>`);
						let progress = new Progress({
							type: "is-success",
							label: System.data.locale.common.progressing,
							max: idListLen
						});

						$spinner.insertAfter(this);
						$sendButton.addClass("js-disabled");
						progress.container.prependTo("#content-old");

						if (previousProgressBars.length > 0) {
							previousProgressBars.remove();
						}

						sendMessage(idList, message, {
							each: i => {
								progress.update(i);
								progress.updateLabel(`${i} - ${idListLen}`);
							},
							done: () => {
								isSending = false;

								$spinner.remove();
								$messageInput.val("");
								$messageInput.prop("disabled", false);
								$sendButton.removeClass("js-disabled");
								progress.updateLabel(`(${idListLen}) - ${System.data.locale.common.allDone}`);
							}
						});
					}
				});
			});
		}
	});
});
