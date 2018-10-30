"use strict";

import { getUserByID, sendMessage } from "../../controllers/ActionsOfBrainly";
import Notification from "../../components/Notification";

const isPosInt = str => /^\+?\d+$/.test(str);
const MessageSender = $seperator => {
	let $messageSenderLi;

	$messageSenderLi = $(`
	<li class="sg-menu-list__element MessageSender" style="display: table; width: 100%;">
		<a class="sg-menu-list__link" href="#">${System.data.locale.core.MessageSender.text} (Beta)</a>
		<div class="sg-content-box js-hidden">
			<div class="sg-content-box__content sg-content-box--spaced-bottom-small">
				<div class="sg-text sg-text--xsmall sg-text--gray" style="width: 24em;">${System.data.locale.core.MessageSender.information}</div>
			</div>
			<div class="sg-content-box__actions">
				<div class="sg-actions-list">
				<div class="sg-actions-list__hole sg-actions-list__hole--grow userId">
					<input type="text" class="sg-input sg-input--full-width" placeholder="${System.data.locale.core.MessageSender.lastRegisteredUserId}">
				</div>
				<div class="sg-actions-list__hole counter" style="display: none;">
					<div class="sg-label">
						<label class="sg-label__text"></label>
					</div>
				</div>
			</div>
			</div>
			<div class="sg-content-box__actions">
				<textarea class="sg-textarea sg-textarea--full-width message" placeholder="${System.data.locale.messages.groups.writeSomething}"></textarea>
			</div>
			<div class="sg-content-box__actions">
				<div class="sg-actions-list sg-actions-list--space-between">
					<div class="sg-actions-list__hole">
						<input type="button" class="sg-button-secondary sg-button-secondary--small sg-button-secondary--alt js-send" value="${System.data.locale.messages.groups.send}">
					</div>
					<div class="sg-actions-list__hole">
						<input type="button" class="sg-button-secondary sg-button-secondary--small sg-button-secondary--peach js-hidden js-stop" value="${System.data.locale.core.MessageSender.stop}">
					</div>
				</div>
			</div>
		</div>
	</li>`);
	if ($seperator.parents(".brn-moderation-panel__list").length > 0) {
		$messageSenderLi.insertBefore($seperator);

		let $messageSenderLink = $("> a", $messageSenderLi);
		let $messageSender = $("> div.js-hidden", $messageSenderLi);
		let $userIdContainer = $("div.userId", $messageSenderLi);
		let $userId = $("> input", $userIdContainer);
		let $counter = $(".counter", $messageSenderLi);
		let $counterLabel = $("> div > label", $counter);
		let $messageInput = $(".message", $messageSenderLi);
		let $sendButton = $(`input.js-send`, $messageSenderLi);
		let $stopButton = $(`input.js-stop`, $messageSenderLi);
		let __loop_messageSendProcess;
		let isSending = false;

		window.onbeforeunload = function() {
			if (isSending) {
				return System.data.locale.common.notificationMessages.ongoingProcess;
			}
		}

		/**
		 * Show message sender box
		 */
		const messageSenderLinkHandler = e => {
			e.preventDefault();
			$messageSender.toggleClass("js-hidden");
		}

		$messageSenderLink.click(messageSenderLinkHandler);

		/**
		 * User id input
		 */
		let delayTimer;
		const userIdHandler = function() {
			let value = this.value;

			if (!value || value === "" || !isPosInt(value) || !(~~value > 0)) {
				this.classList.add("sg-input--invalid");
				this.classList.remove("sg-input--valid", "userFound", "userNotFound");

				if (delayTimer) {
					clearTimeout(delayTimer);
				}
			} else {
				this.classList.remove("sg-input--invalid", "userFound", "userNotFound");
				this.classList.add("sg-input--valid");
				clearTimeout(delayTimer);

				delayTimer = setTimeout(() => {
					getUserByID(value, res => {
						if (!res || !res.success || !res.data) {
							this.classList.add("userNotFound");

							if (res.message) {
								Notification(res.message, "error");
							}
						} else {
							this.classList.add("userFound");
						}
					});
				}, 1000);
			}
		};

		$userId.on("input", userIdHandler);

		/**
		 * Send process
		 */
		let _loop_sendMessage;
		let lastMessage = "";
		let currentId = 0;
		let stopProcessing = false;
		const sendButtonHandler = function() {
			isSending = true;
			let id = $userId.val();
			let message = $messageInput.val().trim().replace(/ {2,}/g, " ");

			if (currentId == 0) {
				currentId = id;
			}

			if (!$userId.is(".sg-input--valid.userFound")) {
				Notification(System.data.locale.core.notificationMessages.youNeedToEnterValidId, "error");
				$userId.focus();
			} else if (!message || message == "") {
				Notification(System.data.locale.core.notificationMessages.cantSendEmptyMessage, "error");
				$messageInput.focus();
			} else if (
				message != lastMessage ||
				(message == lastMessage && stopProcessing) ||
				(message == lastMessage && !stopProcessing && confirm(System.data.locale.core.notificationMessages.tryingToSendTheSameMessage))
			) {
				$userIdContainer.removeClass("sg-actions-list__hole--grow");
				$counter.show();
				$stopButton.removeClass("js-hidden");

				let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`).insertAfter(this);
				lastMessage = message;

				_loop_sendMessage = sendMessage(`${currentId}:1`, message, {
					each: () => {
						$counterLabel.text(currentId--);

						let percent = 100 - (currentId * 100) / id;
						$counter.attr("data-percent", percent.toFixed(1) + "%");
						$counter.css("background", `linear-gradient(to right, #11e0ba ${percent}%,#fff 0%)`)
					},
					done: idList => {
						console.log(idList);
						isSending = false;

						$spinner.remove();
						$messageInput.prop("disabled", false);
						$stopButton.addClass("js-hidden");
						/*MessageSended({
							_id: group._id,
							message,
							members: [`0:${id}`]
						});*/
					}
				});
			}
		}

		$sendButton.click(sendButtonHandler);

		/**
		 * Stop sending process
		 */
		const stopButtonHandler = () => {
			clearInterval(_loop_sendMessage);
			stopProcessing = true;
		}
		$stopButton.click(stopButtonHandler);
	}
};

export default MessageSender
