"use strict";

import { sendMessageToBrainlyIds } from "../../../../controllers/ActionsOfBrainly";
import { MessageSended, UpdateMessageGroup } from "../../../../controllers/ActionsOfServer";
import Progress from "../../../../components/Progress";
import autosize from "autosize";
import renderGroupModal from "./groupModal";
import ScrollToDown from "../../../../helpers/ScrollToDown";

let locale__groups = System.data.locale.messages.groups;

class GroupChatbox {
	constructor() {
		this.$chatbox = $(`
		<div class="sg-content-box__header js-hidden">
			<div class="sg-actions-list">
				<div class="sg-actions-list__hole sg-hide-for-medium-up">
					<div class="sg-button-secondary sg-button-secondary--small sg-button-secondary--dark js-open-conversation-list">${locale__groups.title}</div>
				</div>
				<div class="sg-actions-list__hole">
					<span class="sg-text sg-text--link sg-text--bold js-groupTitle"></span>
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
							<label class="sg-label__text">${locale__groups.deleteGroup}</label>
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
							<label class="sg-label__text">${locale__groups.editGroup}</label>
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
								<textarea class="sg-textarea sg-textarea--nested" maxlength="512" placeholder="${locale__groups.writeSomething}" style="display:none;"></textarea>
							</div>
							<div class="sg-actions-list__hole sg-actions-list__hole--to-end">
								<div class="sg-spinner-container">
									<button class="sg-button-secondary sg-button-secondary--alt sg-button-secondary--small">${locale__groups.send}</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>`);

		this.$messagesContainer = $(".js-group-chat", this.$chatbox);
		this.$messageInput = $("footer.brn-chatbox__footer textarea", this.$chatbox);
		this.$sendButton = $("footer.brn-chatbox__footer button", this.$chatbox);
		this.$progressHole = $(".sg-actions-list > .sg-actions-list__hole.progress", this.$chatbox);

		autosize(this.$messageInput);
		this.$messageInput.show();

		this.BindEvents();
	}
	BindEvents() {
		let $editGroup = $("button.js-edit-group", this.$chatbox);
		let $deleteGroup = $("button.js-delete-group", this.$chatbox);

		$editGroup.click(() => {
			new renderGroupModal(this.group, this.groupLi);
		});

		$deleteGroup.click(() => {
			this.DeleteGroup();
		});

		this.$messageInput.on({
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

						if (!window.isPageProcessing) {
							this.SendMessage();
						}
					}
				}
			}
		});
		this.$sendButton.click(this.SendMessage.bind(this));
	}
	InitGroup(group, groupLi) {
		this.group = group;
		this.groupLi = groupLi;

		this.HideChatbox();
		this.PrepareChatbox();
	}
	PrepareChatbox() {
		let $title = $(".js-groupTitle", this.$chatbox);

		$title.html(this.group.title);

		this.RefreshChatbox();
		this.ShowChatbox();
		this.PrepareMessageMedia(this.group.messages);
	}
	HideChatbox() {
		this.$chatbox.addClass("js-hidden");
	}
	ShowChatbox() {
		this.$chatbox.removeClass("js-hidden");
	}
	RefreshChatbox() {
		this.$messagesContainer.html("");
		this.$progressHole.html("");
	}
	PrepareMessageMedia(message) {
		if (message) {
			if (message instanceof Array) {
				if (message.length > 0) {
					message.forEach(this.RenderMessageMedia.bind(this));
				}
			} else {
				this.RenderMessageMedia(message)
			}
		}
	}
	RenderMessageMedia(data) {
		let user = System.data.Brainly.userData.user;
		let avatar = System.prepareAvatar(user);
		let profileLink = System.createProfileLink(user.nick, user.id);
		let message = data.message;

		if (message && message != "") {
			message.replace(/\r\n|\n/gm, "<br>");
		}

		this.$messagesContainer.append(`
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
								<time class="js-time" datetime="${data.time}"></time>
							</li>
						</ul>
					</div>
				</div>
				<div class="sg-media__content brn-container--4of5">
					<div class="sg-content-box sg-content-box--spaced-top-xxsmall">
						<div class="sg-box sg-box--blue sg-box--no-min-height sg-box--no-border-small">
							<span class="sg-text sg-text--break-words sg-text--light">${message}</span>
						</div>
					</div>
				</div>
			</div>
		</article>`);

		ScrollToDown(this.$messagesContainer.get(0));
	}
	async SendMessage() {
		window.isPageProcessing = true;

		let sendedMessagesCount = 0;
		let message = this.$messageInput.val();
		let membersLen = this.group.members.length;
		let $groupLiMessateContent = $(".js-message-content", this.groupLi);

		let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small"></div></div>`).insertAfter(this.$sendButton);

		let previousProgressBars = $(".progress-container", this.$progressHole);
		let progress = new Progress({
			type: "is-success",
			label: System.data.locale.common.progressing,
			max: membersLen
		});

		this.$messageInput.prop("disabled", true);
		progress.container.appendTo(this.$progressHole);

		if (previousProgressBars.length > 0) {
			previousProgressBars.remove();
		}

		let doInEachSending = () => {
			progress.update(++sendedMessagesCount);
			progress.updateLabel(`${sendedMessagesCount} - ${membersLen}`);
		};

		let membersWithConversationIds = await sendMessageToBrainlyIds(this.group.members, message, doInEachSending);
		console.log("membersWithConversationIds:", membersWithConversationIds);

		//this.CheckForImproperMember(membersWithConversationIds);

		window.isPageProcessing = false;

		$spinner.remove();
		progress.updateLabel(`(${membersLen}) - ${System.data.locale.common.allDone}`);

		autosize.update(
			this.$messageInput
			.val("")
			.prop("disabled", false)
		);

		this.RenderMessageMedia({ message, time: new Date().toISOString() });

		$groupLiMessateContent
			.text(message.substring(0, 60))
			.attr("title", message);

		MessageSended({
			_id: this.group._id,
			message,
			members: membersWithConversationIds
		});
	}
	async DeleteGroup() {
		if (confirm(System.data.locale.common.notificationMessages.areYouSure)) {
			let resUpdated = await UpdateMessageGroup(this.group._id, { remove: true });

			if (resUpdated && resUpdated.success) {
				this.HideChatbox()
				this.groupLi.remove();
			}
		}
	}
	CheckForImproperMember(members) {
		// dönen listeyi kontrol et ve eğer içerisinde mesaj gönderilemeyen bir kullanıcı varsa, olası sebebini exception koduyla veya deleted olarak kullanıcıdan gruptan kaldırmasını iste.
		// 500 kullanılmayan veya silinen hesaplar için. 504 engellenmiş hesaplar için
		//new renderGroupModal(this.group, this.groupLi);
		let improperMembers = [];

		if (member && members.length > 0) {
			members.forEach(member => {
				if (member.exception) {
					improperMembers.push(member);
				}
			});
		}

		if (improperMembers.length > 0) {

		}
	}
}

export default GroupChatbox
