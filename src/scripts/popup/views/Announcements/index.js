"use strict";

import { GetAnnouncements, CreateAnnouncement, UpdateAnnouncement, RemoveAnnouncement } from "../../../controllers/ActionsOfServer";
import { getUserByID } from "../../../controllers/ActionsOfBrainly";
import announcementsNodes from "./announcementsNodes";
import Notification from "../../components/Notification";

window.fetchedUsers = {};
const refreshUserAvatar = (user, elm) => {
	let avatar = System.prepareAvatar(user);

	if (avatar) {
		$(`a[data-user-id="${user.id}"]`, elm).each((i, el) => {
			let $img = $("img.avatar", el);
			$img.attr("src", avatar);
			el.href = System.createProfileLink(user.nick, user.id);
			!el.title && (el.title = user.nick);
		});
	}
};
const refreshUsers = (elm) => {
	Object.keys(window.fetchedUsers).forEach(brainlyID => {
		if (window.fetchedUsers[brainlyID] && window.fetchedUsers[brainlyID].brainlyData) {
			refreshUserAvatar(window.fetchedUsers[brainlyID].brainlyData, elm);
		} else {
			getUserByID(brainlyID, res => {
				window.fetchedUsers[brainlyID].brainlyData = res.data;
				refreshUserAvatar(res.data, elm);
			});
		}
	});
};

const Announcements = (callback) => {
	let $announcementLayout = $(`
	<div id="announcements" class="column is-narrow">
		<article class="message is-info">
			<div class="message-header">
				<p>${System.data.locale.popup.extensionManagement.announcements.text}</p>
			</div>
			<div class="message-body"></div>
		</article>
	</div>`);

	callback($announcementLayout);

	GetAnnouncements(res => {
		let $announcementsBody = $(".message-body", $announcementLayout);

		if (res.success && res.data) {
			let $announcementsNodes = announcementsNodes(res.data);

			$announcementsBody.append($announcementsNodes);
			refreshUsers($announcementsBody);
		}

		let $addNewBox = $(`
		<article class="media addNew">
			<div class="media-content field-label has-text-centered">
				<label class="label">${System.data.locale.popup.extensionManagement.announcements.addNewAnnouncement}</label>
			</div>
		</article>
		<article class="media addNew announcement">
			<figure class="media-left">
				<p class="image is-32x32">
					<img src="${System.data.Brainly.userData.user.fixedAvatar}">
			</p>
			</figure>
			<div class="media-content">
				<div class="content">
						<input class="input announcementTitle" type="text">
						<br>
						<textarea class="announcementContent" name="editor"></textarea>
				</div>
			</div>
			<div class="media-right is-invisible">
				<a href="#" class="icon has-text-success submit" title="${System.data.locale.common.save}">
					<i class="fas fa-check"></i>
				</a><br>
				<a href="#" class="icon has-text-danger reset" title="${System.data.locale.common.clearInputs}">
					<i class="fas fa-undo"></i>
				</a>
			</div>
		</article>`);
		$announcementsBody.append($addNewBox);

		let createEditor = (elm) => {
			let options = {
				showPlaceholder: true,
				useInputsPlaceholder: true,
				addNewLineOnDBLClick: false,
				"toolbarButtonSize": "small",
				"toolbarSticky": false,
				"buttons": ",,source,|,undo,redo,|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,align,outdent,indent,,font,fontsize,brush,paragraph,|,image,file,video,table,link,\n,cut,hr,eraser,copyformat,|,symbol,fullsize,selectall,print"
			};

			if (elm.is("input")) {
				options = {
					placeholder: System.data.locale.popup.extensionManagement.announcements.editorTitle,
					"allowResizeY": false,
					"preset": "inline",
					"height": 20,
					events: {
						beforeEnter: () => false
					},
					"showCharsCounter": false,
					"showWordsCounter": false,
					"showXPathInStatusbar": false,
					...options
				};
			} else if (elm.is("textarea")) {
				options = {
					placeholder: System.data.locale.popup.extensionManagement.announcements.editorContent,
					"enter": "BR",
					"height": 300,
					"uploader": {
						"insertImageAsBase64URI": true
					},
					...options
				};
			}

			return new Jodit(elm.get(0), options);
		}
		/**
		 * Prepare WYSIWYG for new announcement inputs
		 */
		let $announcementTitle = $(".addNew input.announcementTitle", $announcementsBody);
		let $announcementContent = $(".addNew textarea.announcementContent", $announcementsBody);
		let $actionsContainer = $(".addNew .media-right.is-invisible", $announcementsBody);

		var editorUpdateAnnouncementTitle = null;
		var editorUpdateAnnouncementContent = null;
		var editorNewAnnouncementTitle = createEditor($announcementTitle);
		var editorNewAnnouncementContent = createEditor($announcementContent);
		let inputChangeHandler = function(e, b, c) {
			let titleValue = editorNewAnnouncementTitle.getEditorValue(),
				contentValue = editorNewAnnouncementContent.getEditorValue();
			if (titleValue != "" || contentValue != "") {
				$actionsContainer.removeClass("is-invisible");
			} else {
				$actionsContainer.addClass("is-invisible");
			}
		};
		editorNewAnnouncementTitle.events.on('change', inputChangeHandler);
		editorNewAnnouncementContent.events.on('change', inputChangeHandler);

		let clearEditorsValue = () => {
			editorNewAnnouncementTitle.setElementValue("");
			editorNewAnnouncementContent.setElementValue("");
		}

		/**
		 * Action buttons handling
		 */
		$announcementsBody.on("click", ".media-right > a", function(e) {
			e.preventDefault();
			let that = $(this);
			if (that.is(".reset")) {
				clearEditorsValue();
			}
			if (that.is(".submit")) {
				let titleValue = editorNewAnnouncementTitle.getEditorValue(),
					contentValue = editorNewAnnouncementContent.getEditorValue();
				if (!titleValue || titleValue == "") {
					Notification("You must add an announcement title", "danger");
				} else if (!contentValue || contentValue == "") {
					Notification("You must add an announcement text", "danger");
				} else {
					let data = {
						id: that.parents("article.media").attr("id"),
						title: titleValue,
						content: contentValue
					};
					CreateAnnouncement(data, res => {
						if (!res) {
							Notification(System.data.locale.common.notificationMessages.operationError, "danger");
						} else {
							if (!res.success) {
								Notification((res.message || System.data.locale.common.notificationMessages.operationError), "danger");
							} else {
								Notification(System.data.locale.popup.notificationMessages.createdMessage);

								$announcementsBody.prepend(announcementsNodes(res.data));
								refreshUsers($announcementsBody);

								$('html, body').animate({
									scrollTop: $("#" + res.data._id).offset().top
								}, 1000);

								clearEditorsValue();
							}
						}
					});
				}
			} else if (that.is(".update")) {
				let titleValue = editorUpdateAnnouncementTitle.getEditorValue(),
					contentValue = editorUpdateAnnouncementContent.getEditorValue();
				if (!titleValue || titleValue == "") {
					Notification("You must add an announcement title", "danger");
				} else if (!contentValue || contentValue == "") {
					Notification("You must add an announcement text", "danger");
				} else {
					let data = {
						id: that.parents("article.media").attr("id"),
						title: titleValue,
						content: contentValue
					};
					//data.id = that.parents("article.media").attr("id");

					UpdateAnnouncement(data, res => {
						if (!res) {
							Notification(System.data.locale.common.notificationMessages.operationError, "danger");
						} else {
							if (!res.success) {
								Notification((res.message || System.data.locale.common.notificationMessages.operationError), "danger");
							} else {
								Notification(System.data.locale.popup.notificationMessages.updatedMessage);
							}
						}
					});

				}
			} else if (that.is(".remove")) {
				if (confirm(System.data.locale.common.notificationMessages.areYouSure)) {
					let parentArticle = that.parents("article.media");
					let id = parentArticle.attr("id");
					RemoveAnnouncement(id, res => {
						if (!res) {
							Notification(System.data.locale.common.notificationMessages.operationError, "danger");
						} else {
							if (!res.success) {
								Notification((res.message || System.data.locale.common.notificationMessages.operationError), "danger");
							} else {
								Notification(System.data.locale.popup.notificationMessages.removedMessage);
								parentArticle.slideUp("normal", function() { this.remove(); });
							}
						}
					});
				}
			} else if (that.is(".edit")) {
				let $parentArticle = that.parents("article.media");
				$parentArticle.toggleClass("is-editing");
				let $editorContent = $(".media-content.editor", $parentArticle);
				if ($editorContent.length == 0) {
					let $announcementContainer = $(".media-content", $parentArticle);
					let $editors = $(`
					<div class="media-content editor">
						<div class="content">
							<input class="input announcementTitle" type="text">
							<br>
							<textarea class="announcementContent" name="editor"></textarea>
						</div>
					</div>
					
					<div class="media-right editing">
						<a href="#" class="icon has-text-danger edit" title="${System.data.locale.popup.extensionManagement.announcements.cancelEdit}">
							<i class="fas fa-lg fa-times-circle"></i>
						</a><br>
						<a href="#" class="icon has-text-success update" title="${System.data.locale.popup.extensionManagement.announcements.update}">
							<i class="fas fa-check"></i>
						</a>
					</div>`).insertAfter($announcementContainer);
					editorUpdateAnnouncementTitle = createEditor($("input.announcementTitle", $editors));
					editorUpdateAnnouncementContent = createEditor($("textarea.announcementContent", $editors));

					editorUpdateAnnouncementTitle.setElementValue($(".announcementTitle", $announcementContainer).html());
					editorUpdateAnnouncementContent.setElementValue($(".announcementContent", $announcementContainer).html());

				} else {}

			} else if (that.is(".publish")) {
				let status = JSON.parse($(this).attr("data-published"));
				let $article = that.parents("article.media");

				UpdateAnnouncement({ id: $article.attr("id"), publish: !status }, res => {
					if (!res) {
						Notification(System.data.locale.common.notificationMessages.operationError, "danger");
					} else {
						if (!res.success) {
							Notification((res.message || System.data.locale.common.notificationMessages.operationError), "danger");
						} else {
							Notification(System.data.locale.popup.notificationMessages.updatedMessage);
							$(this).attr({
								"data-published": !status,
								title: System.data.locale.popup.extensionManagement.announcements[!status ? "unpublish" : "publish"]
							});
							$("[data-fa-i2svg]", this).toggleClass('fa-eye').toggleClass('fa-eye-slash');
							$(".media-content > .content > [data-fa-i2svg]", $article).toggleClass('fa-eye').toggleClass('fa-eye-slash');
						}
					}
				});
			}
		});
	});
};

export default Announcements
