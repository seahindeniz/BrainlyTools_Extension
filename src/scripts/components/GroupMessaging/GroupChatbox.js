"use strict";

import { sendMessages } from "../../controllers/ActionsOfBrainly";
import { MessageSended, UpdateMessageGroup } from "../../controllers/ActionsOfServer";
import Progress from "../Progress";
import autosize from "autosize";
import renderGroupModal from "./groupModal";

let __groups = System.data.locale.messages.groups;

const GroupChatbox = function(group) {
	let $chatBox = $(`
	<div class="sg-content-box__header">
		<div class="sg-actions-list">
			<div class="sg-actions-list__hole sg-hide-for-medium-up">
				<div class="sg-button-secondary sg-button-secondary--small sg-button-secondary--dark js-open-conversation-list">${__groups.title}</div>
			</div>
			<div class="sg-actions-list__hole">
				<span class="sg-text sg-text--link sg-text--bold">${group.title}</span>
			</div>
			<div class="sg-actions-list__hole sg-actions-list__hole--to-right">
				<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--active-inverse js-delete-group">
					<div class="sg-label sg-label--secondary sg-label--unstyled">
						<div class="sg-label__icon">
							<div class="sg-icon sg-icon--adaptive sg-icon--x14">
								<svg class="sg-icon__svg">
									<use xlink:href="#icon-x"></use>
								</svg>
							</div>
						</div>
						<label class="sg-label__text">${__groups.deleteGroup}</label>
					</div>
				</button>
				<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--inverse js-edit-group">
					<div class="sg-label sg-label--secondary">
						<div class="sg-label__icon">
							<div class="sg-icon sg-icon--lavender sg-icon--x14">
								<svg class="sg-icon__svg">
									<use xlink:href="#icon-pencil"></use>
								</svg>
							</div>
						</div>
						<label class="sg-label__text">${__groups.editGroup}</label>
					</div>
				</button>
			</div>
			<div class="sg-actions-list__hole sg-box--full progress"></div>
		</div>
	</div>
	<div class="sg-content-box__content">
		<div class="sg-horizontal-separator"></div>
		<section class="brn-chatbox__chat js-group-chat"></section>
	</div>
	<div class="sg-content-box__content">
		<footer class="brn-chatbox__footer">
			<div class="sg-horizontal-separator"></div>
			<div class="sg-content-box sg-content-box--spaced-top js-chatbox-footer">
				<div class="sg-textarea sg-textarea--auto-height sg-textarea--short">
					<div class="sg-actions-list sg-actions-list--no-wrap">
						<div class="sg-actions-list__hole sg-actions-list__hole--grow">
							<textarea class="sg-textarea sg-textarea--nested" maxlength="512" placeholder="${__groups.writeSomething}" style="display:none;"></textarea>
						</div>
						<div class="sg-actions-list__hole sg-actions-list__hole--to-end">
							<div class="sg-spinner-container">
								<button class="sg-button-secondary sg-button-secondary--alt sg-button-secondary--small">${__groups.send}</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	</div>`);

	let messageMedia = messages => {
		let $messagesContainer = $(".brn-chatbox__chat.js-group-chat", $chatBox);
		let user = System.data.Brainly.userData.user;
		let avatar = System.prepareAvatar(user);
		let profileLink = System.createProfileLink(user.nick, user.id);
		let createMedia = message => {
			$messagesContainer.append(`
			<article class="sg-media message sg-media--to-right">
				<div class="sg-media__aside">
					<div class="sg-avatar sg-avatar--xsmall  ">
						<a href="${profileLink}" title="${user.nick}">
							<img class="sg-avatar__image" src="${avatar}" alt="${user.nick}" title="${user.nick}"></a>
					</div>
				</div>
				<div class="sg-media__wrapper">
					<div class="sg-media__content sg-media__content--small">
						<div class="sg-text sg-text--obscure sg-text--gray-secondary sg-text--emphasised">
							<ul class="sg-breadcrumb-list sg-breadcrumb-list--adaptive sg-breadcrumb-list--short">
								<li class="sg-breadcrumb-list__element">
									<a class="sg-text sg-text--obscure sg-text--gray-secondary sg-text--emphasised" href="${profileLink}">
										${user.nick}
									</a>
								</li>
								<li class="sg-breadcrumb-list__element">
									<time class="js-time" datetime="${message.time}"></time>
								</li>
							</ul>
						</div>
					</div>
					<div class="sg-media__content brn-container--4of5">
						<div class="sg-content-box sg-content-box--spaced-top-xxsmall">
							<div class="sg-box sg-box--blue sg-box--no-min-height sg-box--no-border-small">
								<span class="sg-text sg-text--break-words sg-text--light">${message.message}</span>
							</div>
						</div>
					</div>
				</div>
			</article>`);
		};
		if (messages instanceof Array) {
			messages.forEach(createMedia);
		} else {
			createMedia(messages);
		}

		let __e = $messagesContainer.get(0);
		let __loop_scroll = setInterval(() => {
			__e.scrollTop = 1E9;
			if (__e.scrollTop > 0)
				clearInterval(__loop_scroll);
		});
	}

	if (group.messages && group.messages.length > 0) {
		messageMedia(group.messages);
	}

	let $deleteGroup = $("button.js-delete-group", $chatBox);
	let $editGroup = $("button.js-edit-group", $chatBox);
	let $messageInput = $("footer.brn-chatbox__footer textarea", $chatBox);
	let $sendButton = $("footer.brn-chatbox__footer button", $chatBox);
	let $progressHole = $(".sg-actions-list > .sg-actions-list__hole.progress", $chatBox);
	let $groupLiMessateContent = $(".js-message-content", this);
	let isSending = false;

	window.onbeforeunload = function() {
		if (isSending) {
			return System.data.locale.common.notificationMessages.ongoingProcess;
		}
	}

	autosize($messageInput);
	$messageInput.show();

	let sendMessageHandler = () => {
		console.log(group);
		isSending = true;
		let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small"></div></div>`).insertAfter($sendButton);
		let membersLen = group.members.length;
		let sendedMessagesCount = 0;
		let message = $messageInput.val();
		let previousProgressBars = $(".progress-container", $progressHole);
		let progress = new Progress({
			type: "is-success",
			label: System.data.locale.common.progressing,
			max: membersLen
		});

		$messageInput.prop("disabled", true);
		progress.container.appendTo($progressHole);

		if (previousProgressBars.length > 0) {
			previousProgressBars.remove();
		}

		sendMessages(group.members, message, {
			each: () => {
				progress.update(++sendedMessagesCount);
				progress.updateLabel(`${sendedMessagesCount} - ${membersLen}`);
			},
			done: () => {
				isSending = false;

				$spinner.remove();
				progress.updateLabel(`(${membersLen}) - ${System.data.locale.common.allDone}`);
				$messageInput.val("");
				$messageInput.prop("disabled", false);
				autosize.update($messageInput);
				messageMedia({ message, time: new Date().toISOString() });
				console.log($groupLiMessateContent);
				$groupLiMessateContent.text(message.substring(0, 60));
				$groupLiMessateContent.attr("title", message);
				MessageSended({
					_id: group._id,
					message,
					members: group.members.map(member => ~~member.brainlyID)
				});
			}
		});
	};

	$messageInput.on({
		"keydown": e => {
			if (e.keyCode == 13) {
				if (!e.shiftKey) {
					e.preventDefault();
				}
			}
		},
		"keyup": e => {
			if (e.keyCode == 13) {
				if (!e.shiftKey) {
					e.preventDefault();

					if (!isSending) {
						sendMessageHandler();
					}
				}
			}
		}
	});
	$sendButton.click(sendMessageHandler);

	$editGroup.click(() => renderGroupModal.bind(this)(group))
	$deleteGroup.click(() => {
		if (confirm(System.data.locale.common.notificationMessages.areYouSure)) {
			UpdateMessageGroup(group._id, { remove: true }, res => {
				if (res && res.success) {
					$chatBox.remove();
					this.remove();
				}
			});
		}
	});
	return $chatBox
}

export default GroupChatbox
