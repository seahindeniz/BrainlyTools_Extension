"use strict";

import { GetUsers, PutUser } from "../../../controllers/ActionsOfServer";
import { getUserByID } from "../../../controllers/ActionsOfBrainly";
import Request from "../../../controllers/Request";
import usersNodes from "./usersNodes";
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
		if (window.fetchedUsers[brainlyID].brainlyData) {
			refreshUserAvatar(window.fetchedUsers[brainlyID].brainlyData, elm);
		} else {
			getUserByID(brainlyID, res => {
				window.fetchedUsers[brainlyID].brainlyData = res.data;
				refreshUserAvatar(res.data, elm);
			});
		}
	});
};

const Users = (callback) => {
	let $usersLayout = $(`
	<div id="users" class="column is-narrow">
		<article class="message is-warning">
			<div class="message-header" title="${System.data.locale.popup.extensionManagement.users.title}">
				<p>${System.data.locale.popup.extensionManagement.users.text}</p>
			</div>
			<div class="message-body">
				<article class="media">
					<nav class="level">
						<div class="level-left"></div>
					</nav>
				</article>
				<p class="help">Some users has colored border in their avatars and this color shows their permission status of extension usability.</br></br>
				<b style="color:#f00">Red</b> border means this user are banned from the extension.</br>
				<b style="color:#fc0">Mustard</b> border means the user has permission to use the extension but hasn't use it yet</br>
				<b style="color:#0f0">Green</b> color means the user is an active user.</br>
				<b>No border</b> color means that user has privilege assigned but not given permission to use the extension in their account and hasn't started to use yet.</p>
			</div>
		</article>
	</div>`);

	callback($usersLayout);

	GetUsers(res => {
		let $usersListContainer = $(".message-body > article.media", $usersLayout);
		let $level = $(".level > .level-left", $usersListContainer);

		if (res.success && res.data) {
			let $usersNodes = usersNodes(res.data);
			$level.append($usersNodes);
			refreshUsers($level);
		}

		let $addNewBox = $(`
		<article class="media addNew">
			<div class="media-content field-label has-text-centered">
				<label class="label">${System.data.locale.popup.extensionManagement.users.addNewOrEditUser}</label>
			</div>
		</article>
		<article class="media addNew user">
			<div class="media-left is-invisible has-text-centered">
				<!--<p class="image is-48x48">
					<img class="avatar is-rounded" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
				</p>-->
				<a target="_blank">
					<figure class="image is-48x48">
						<img class="avatar is-rounded" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
					</figure>
					<div>
						<p class="nick"></p>
					</div>
				</a>
			</div>
			<div class="media-content">
				<div class="content">
					<div class="field">
						<div class="control is-expanded has-icons-left">
							<input class="input" type="text" placeholder="${System.data.locale.core.UserFinder.profileID}">
							<span class="icon is-left">
								<i class="fas fa-user"></i>
							</span>
						</div>
						<br>
						<div class="control permission is-hidden">
							<div class="field">
								<input id="switchPermission" type="checkbox" class="switch is-rtls" checked="checked">
								<label for="switchPermission">${System.data.locale.popup.extensionManagement.users.permission}</label>
							</div>
						</div>
						<br>
						<div class="control privileges is-hidden">
							<label class="label">${System.data.locale.popup.extensionManagement.userManagement.privileges}</label>
						</div>
					</div>
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

		$addNewBox.insertAfter($usersListContainer);

		let $privilegesContainer = $(".media-content .privileges", $addNewBox);

		System.data.locale.popup.extensionManagement.users.privilegeList.forEach(privilege => {
			$privilegesContainer.append(`
			<div class="field" title="${privilege.description}">
				<input class="is-checkradio is-block is-info" id="p-${privilege.type}" type="checkbox">
				<label for="p-${privilege.type}">${privilege.title}</label>
			</div>`);
		});

		let lastSearchedID = null;
		let $privilegeInputs = $('input[type="checkbox"]', $privilegesContainer);
		let $permissionContainer = $(".media-content .permission", $addNewBox);
		let $permission = $("input", $permissionContainer);
		let $actions = $(".media-right", $addNewBox);
		let $avatarContainer = $(".media-left", $addNewBox);
		let $link = $("a", $avatarContainer);
		let $nick = $(".nick", $avatarContainer);
		let $avatar = $("img.avatar", $avatarContainer);
		let $idInput = $('input[type="text"]', $addNewBox);
		let processUser = user => {
			let profileLink = System.createBrainlyLink("profile", { nick: user.nick, id: user.id });
			let userAvatar = System.prepareAvatar(user);
			let serverData = window.fetchedUsers[user.id];

			$link.attr("href", profileLink);
			$nick.text(user.nick);
			$avatar.attr("src", userAvatar);
			$avatarContainer.removeClass("is-invisible");
			$actions.removeClass("is-invisible");
			$privilegeInputs.prop("checked", false);
			$permission.prop("checked", false);

			if (serverData) {
				$permission.prop("checked", serverData.approved);

				if (serverData.privileges && serverData.privileges.length > 0) {
					serverData.privileges.forEach(type => $("#p-" + type, $privilegesContainer).prop("checked", true));
				}
			}
			
			$permissionContainer.removeClass("is-hidden");
			$privilegesContainer.removeClass("is-hidden");
		}
		const hideItems = clearInput => {
			$link.attr("href", "");
			$nick.text("");
			$avatar.attr("src", avatar);
			$avatarContainer.addClass("is-invisible");
			$actions.addClass("is-invisible");
			$permissionContainer.addClass("is-hidden");
			$privilegesContainer.addClass("is-hidden");

			if (clearInput) {
				$idInput.val("");
			}
		};

		/**
		 * User icon/link click
		 */
		$level.on("click", ".level-item > a", function(e) {
			e.preventDefault();
			let id = this.dataset["userId"];

			$idInput.val(id).trigger("input").focus();
		});

		/**
		 * User search input
		 */
		$idInput.on("input", function() {
			if (!this.value && !(this.value.length > 0)) {
				hideItems();
			} else {
				let id = ~~(this.value.replace(/.*\-/gi, ""));
				if (!(id >= 0)) {
					hideItems();
				} else {
					if (id !== lastSearchedID) {
						lastSearchedID = id;
						if (window.fetchedUsers[id] && window.fetchedUsers[id].brainlyData) {
							processUser(window.fetchedUsers[id].brainlyData);
						} else {
							Request.BrainlyReq("GET", `/api_users/get/${id}`, (res) => {
								if (res.success && res.data) {
									window.fetchedUsers[id] = {
										nick: res.data.nick,
										brainlyID: res.data.id,
										brainlyData: null
									};
									window.fetchedUsers[id].brainlyData = res.data;

									processUser(res.data);
								} else {
									Notification(System.data.locale.popup.notificationMessages.cannotFindUser, "danger");
									hideItems();
								}
							});
						}
					}
				}
			}
		});

		/**
		 * Action buttons handling
		 */
		$addNewBox.on("click", ".media-right > a", function(e) {
			e.preventDefault();

			let that = $(this);

			if (that.is(".reset")) {
				hideItems(true);
			}
			if (that.is(".submit")) {
				let id = $idInput.val().replace(/.*\-/gi, "");

				if (!id || id == "") {
					Notification("I need an ID number so I can process", "danger");
				} else if (!(~~id > 0)) {
					Notification("Unvalid ID number range", "danger");
				} else {
					let privileges = $("input:checked", $privilegesContainer).map((i, el) => ~~(el.id.replace("p-", ""))).get();
					let user = window.fetchedUsers[id];

					if (!user) {
						Notification(System.data.locale.popup.notificationMessages.cannotFindUser, "danger");
					} else {
						let approved = $permission.prop("checked");
						let data = {
							id: user.brainlyID,
							nick: user.nick,
							privileges,
							approved
						};
						//console.log(data);

						PutUser(data, res => {
							//console.log(res);
							if (!res) {
								Notification(System.data.locale.common.notificationMessages.operationError, "danger");
							} else {
								if (!res.success) {
									Notification((res.message || System.data.locale.common.notificationMessages.operationError), "danger");
								} else {
									Notification(System.data.locale.common.allDone, "success");

									$("#"+res.data._id, $level).parent().remove();
									user._id = res.data._id;
									user.approved = approved;
									$level.prepend(usersNodes(user));
									refreshUsers($level);

									$('html, body').animate({
										scrollTop: $("#" + res.data._id).offset().top
									}, 1000);

									hideItems(true);
								}
							}
						});
					}
				}
			}
		});
	});
};

export default Users
