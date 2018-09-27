"use strict";

import { GetAnnouncements, CreateAnnouncement, UpdateAnnouncement, RemoveAnnouncement } from "../../../controllers/ActionsOfServer";
import { getUserByID } from "../../../controllers/ActionsOfBrainly";
import announcementsNodes from "./announcementsNodes";
import Notification from "../../components/Notification";

window.fetchedUsers = {};
const refreshUserAvatar = (user, elm) => {
	user.avatars && (user.avatars[64] || user.avatars[100]) &&
		$(`a[data-user-id="${user.id}"]`, elm).each((i, el) => {
			let $img = $("img.avatar", el);
			$img.attr("src", user.avatars[64] || user.avatars[100]);
			el.removeAttribute("data-user-id");
			el.href = System.createProfileLink(user.nick, user.id);
			el.title = user.nick;
		});
};
const refreshUsers = (elm) => {
	Object.keys(window.fetchedUsers).forEach(brainlyID => {
		if (!window.fetchedUsers[brainlyID]) {
			getUserByID(brainlyID, res => {
				window.fetchedUsers[brainlyID] = res.data;
				refreshUserAvatar(res.data, elm);
			});
		}
	});
};

const Announcements = (callback) => {
	GetAnnouncements(res => {
		let $announcementLayout = $("<div/>");

		if (res.success && res.data) {
			let $announcementsNodes = announcementsNodes(res.data);
			$announcementLayout.append($announcementsNodes);
			refreshUsers($announcementLayout);
		}

		let $addNewBox = $(`
		<article class="media addNew">
			<div class="media-content field-label has-text-centered">
				<label class="label">Add new announcement</label>
			</div>
		</article>
		<article class="media addNew">
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
				<a href="#" class="icon has-text-success submit" title="${System.data.locale.texts.globals.save}">
					<i class="fas fa-check"></i>
				</a><br>
				<a href="#" class="icon has-text-danger reset" title="${System.data.locale.texts.extension_options.announcements.clearForm}">
					<i class="fas fa-undo"></i>
				</a>
			</div>
		</article>`);
		$announcementLayout.append($addNewBox);

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
					placeholder: "Announcement title",
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
					placeholder: "Announcement content",
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
		let $announcementTitle = $(".addNew input.announcementTitle", $announcementLayout);
		let $announcementContent = $(".addNew textarea.announcementContent", $announcementLayout);
		let $actionsContainer = $(".addNew .media-right.is-invisible", $announcementLayout);

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
		$(".message-body").on("click", ".media-right > a", function(e) {
			e.preventDefault();
			let that = $(this);
			if (that.is(".reset")) {
				clearEditorsValue();
			}
			if (that.is(".submit, .update")) {
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
					if (that.is(".submit")) {
						CreateAnnouncement(data, res => {
							if (!res) {
								Notification(System.data.locale.texts.globals.errors.operation_error, "danger");
							} else {
								if (!res.success) {
									Notification((res.message || System.data.locale.texts.globals.errors.operation_error), "danger");
								} else {
									Notification(System.data.locale.texts.extension_options.announcements.createdMessage);

									$announcementLayout.prepend(announcementsNodes(res.data));
									refreshUsers($announcementLayout);

									$('html, body').animate({
										scrollTop: $("#" + res.data._id).offset().top
									}, 1000);

									clearEditorsValue();
								}
							}
						});
					} else if (that.is(".update")) {
						data.id = that.parents("article.media").attr("id");

						UpdateAnnouncement(data, res => {
							if (!res) {
								Notification(System.data.locale.texts.globals.errors.operation_error, "danger");
							} else {
								if (!res.success) {
									Notification((res.message || System.data.locale.texts.globals.errors.operation_error), "danger");
								} else {
									Notification(System.data.locale.texts.extension_options.announcements.updatedMessage);
								}
							}
						});
					}
				}
			} else if (that.is(".remove")) {
				if (confirm(System.data.locale.texts.globals.are_you_sure)) {
					let parentArticle = that.parents("article.media");
					let id = parentArticle.attr("id");
					RemoveAnnouncement(id, res => {
						if (!res) {
							Notification(System.data.locale.texts.globals.errors.operation_error, "danger");
						} else {
							if (!res.success) {
								Notification((res.message || System.data.locale.texts.globals.errors.operation_error), "danger");
							} else {
								Notification(System.data.locale.texts.extension_options.announcements.removedMessage);
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
						<a href="#" class="icon has-text-danger edit" title="${System.data.locale.texts.globals.cancelEdit}">
							<i class="fas fa-lg fa-times-circle"></i>
						</a><br>
						<a href="#" class="icon has-text-success update" title="${System.data.locale.texts.globals.update}">
							<i class="fas fa-check"></i>
						</a>
					</div>`).insertAfter($announcementContainer);
					var editorAnnouncementTitle = createEditor($("input.announcementTitle", $editors));
					var editorAnnouncementContent = createEditor($("textarea.announcementContent", $editors));

					editorAnnouncementTitle.setElementValue($(".announcementTitle", $announcementContainer).html());
					editorAnnouncementContent.setElementValue($(".announcementContent", $announcementContainer).html());

				} else {}

			} else if (that.is(".publish")) {
				let status = JSON.parse($(this).attr("data-published"));
				let $article = that.parents("article.media");

				UpdateAnnouncement({ id: $article.attr("id"), publish: !status }, res => {
					if (!res) {
						Notification(System.data.locale.texts.globals.errors.operation_error, "danger");
					} else {
						if (!res.success) {
							Notification((res.message || System.data.locale.texts.globals.errors.operation_error), "danger");
						} else {
							Notification(System.data.locale.texts.extension_options.announcements.updatedMessage);
							$(this).attr({
								"data-published": !status,
								title: System.data.locale.texts.extension_options.announcements[!status ? "unpublish" : "publish"]
							});
							$("[data-fa-i2svg]", this).toggleClass('fa-eye').toggleClass('fa-eye-slash');
							$(".media-content > .content > [data-fa-i2svg]", $article).toggleClass('fa-eye').toggleClass('fa-eye-slash');
						}
					}
				});
			}
		});
		callback($announcementLayout);
	});
};

export default Announcements
