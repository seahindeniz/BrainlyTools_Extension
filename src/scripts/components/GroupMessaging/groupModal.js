"use strict";

import Notification from "../Notification";
import Modal from "../ModalToplayer";
import Dropdown from "../Dropdown";
import { getMessageID, getUserByID } from "../../controllers/ActionsOfBrainly";
import { CreateMessageGroup, UpdateMessageGroup } from "../../controllers/ActionsOfServer";
import userSearch from "./userSearch";
import rankSelector from "./rankSelector";
import userLi from "./userLi";
import groupLi from "./groupLi";

const __groups = System.data.locale.messages.groups;

const groupModal = function(group) {
	let _currentGroupLi = this;
	let $toplayerContainer = $(`<div class="js-toplayers-container"></div>`);
	let createGroupToplayer = new Modal(
		`<div class="sg-actions-list sg-actions-list--no-wrap">
			<div class="sg-actions-list__hole">
				<h2 class="sg-header-secondary">${__groups[group?"editGroup":"createGroup"]}</h2>
			</div>
			<div class="sg-actions-list__hole sg-actions-list__hole--to-right">
				<div class="sg-spinner-container">
					<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--alt sg-button-secondary js-save">${System.data.locale.common.save}</button>
				</div>
			</div>
		</div>`,
		`<div class="sg-actions-list sg-actions-list--space-between group-header">
				<div class="sg-actions-list__hole">
					<div class="sg-actions-list sg-actions-list--space-between sg-actions-list--no-wrap">
						<div class="sg-actions-list__hole">
							<label class="sg-text sg-text--xxlarge js-first-letter"${group?` style="color:${group.color};"`:""}>G</label>
						</div>
						<div class="sg-actions-list__hole">
							<div class="color-container" title="${__groups.groupColor}">
								<datalist id="flatColors">
									<option value="#1abc9c">Turquoise</option><option value="#2ecc71">Emerland</option><option value="#3498db">Peterriver</option><option value="#9b59b6">Amethyst</option><option value="#34495e">Wetasphalt</option><option value="#16a085">Greensea</option><option value="#27ae60">Nephritis</option><option value="#2980b9">Belizehole</option><option value="#8e44ad">Wisteria</option><option value="#2c3e50">Midnightblue</option><option value="#f1c40f">Sunflower</option><option value="#e67e22">Carrot</option><option value="#e74c3c">Alizarin</option><option value="#ecf0f1">Clouds</option><option value="#95a5a6">Concrete</option><option value="#f39c12">Orange</option><option value="#d35400">Pumpkin</option><option value="#c0392b">Pomegranate</option><option value="#bdc3c7">Silver</option><option value="#7f8c8d">Asbestos</option>
								</datalist>
								<input id="colorPicker" list="flatColors" type="color" placeholder="Text input" value="${group?group.color:"#000000"}">
							</div>
						</div>
						<div class="sg-actions-list__hole">
							<input type="text" class="sg-input sg-input--light-alt sg-input--full-width sg-input--large js-group-name" placeholder="${__groups.groupName}"${group?` style="color:${group.color};" value="${group.title}"`:""}>
						</div>
					</div>
				</div>
				<div class="sg-actions-list__hole">
					<div class="sg-actions-list sg-actions-list--space-between sg-actions-list--no-wrap user-category-selector">
						<div class="sg-actions-list__hole sg-box--full"></div>
					</div>
				</div>
			</div>
			<div class="sg-card sg-card--vertical sg-card--full  sg-card--padding-small">
				<div class="sg-card__hole sg-card__hole--lavender-secondary-light group-members-list">
					<div class="sg-actions-list sg-actions-list--space-between">
						<div class="sg-actions-list__hole">
							<h2 class="sg-headline sg-headline--normal sg-headline--gray sg-headline--justify">${__groups.groupMembers}</h2>
						</div>
						<div class="sg-actions-list__hole">
							<button class="sg-button-secondary sg-button-secondary--alt">${__groups.removeAll}</button>
						</div>
					</div>
					<ul class="sg-list sg-list--spaced-elements"></ul>
				</div>
                <div class="sg-card__hole find-users find-users-list">
					<div class="sg-actions-list sg-actions-list--space-between">
						<div class="sg-actions-list__hole">
							<h2 class="sg-headline sg-headline--normal sg-headline--gray sg-headline--justify">${__groups.searchResults}</h2>
						</div>
						<div class="sg-actions-list__hole">
							<button class="sg-button-secondary sg-button-secondary--alt">${__groups.addAll}</button>
						</div>
					</div>
					<ul class="sg-list sg-list--spaced-elements"></ul>
				</div>
              </div>`,
		``,
		"",
		"limited-width");
	let $createGroupToplayer = createGroupToplayer.$;
	let $closeIcon = $(".sg-toplayer__close", $createGroupToplayer);
	let $userCategorySelectorContainer = $(".group-header > div.sg-actions-list__hole > div.user-category-selector", $createGroupToplayer);
	let $save = $("button.js-save", $createGroupToplayer);
	let $color = $("input#colorPicker", $createGroupToplayer);
	let $groupName = $("input.js-group-name", $createGroupToplayer);
	let $firstLetter = $("label.js-first-letter", $createGroupToplayer);
	let $groupMembersList = $(".group-members-list>ul", $createGroupToplayer);
	let $findUsersHeadline = $("div.find-users > h2.sg-headline", $createGroupToplayer);
	let $findUsersList = $(".find-users-list>ul", $createGroupToplayer);
	let $removeAll = $(".group-members-list>.sg-actions-list button", $createGroupToplayer);
	let $addAll = $(".find-users-list>.sg-actions-list button", $createGroupToplayer);
	let $userCategoryList = Dropdown({
		label: __groups.selectGroupType,
		class: "sg-dropdown--full-width",
		items: [{
				value: "findUsers",
				text: __groups.userCategories.findUsers.text
			},
			{
				value: "moderatorRanks",
				text: __groups.userCategories.moderatorRanks.text
			},
			{
				value: "allModerators",
				text: __groups.userCategories.allModerators
			},
			{
				value: "friendsList",
				text: __groups.userCategories.friendsList
			}
		]
	});

	$toplayerContainer.insertBefore("footer.js-page-footer");
	$createGroupToplayer.appendTo($toplayerContainer);
	$userCategoryList.appendTo($(".sg-actions-list__hole", $userCategorySelectorContainer));

	/**
	 * Add and Remove all buttons
	 */
	$addAll.click(() => {
		let $users = $(">li", $findUsersList);

		$users.each((i, user) => {
			if ($(`li[data-user-id="${user.dataset.userId}"]`, $groupMembersList).length == 0) {
				$(user).appendTo($groupMembersList);
			} else {
				user.remove();
			}
		});
	});
	$removeAll.click(() => {
		if (confirm(__groups.notificationMessages.doYouWantToRemoveMembers)) {
			$findUsersList.html("");
			let $users = $(">li", $groupMembersList);

			$users.appendTo($findUsersList);
		}
	});

	/**
	 * Bind the jQuery UI Sortable
	 */
	$(".find-users-list>ul, .group-members-list>ul", $createGroupToplayer).sortable({
		connectWith: ".sg-list",
		snap: $findUsersList,
		snapMode: "inner",
		revert: true,
		start: function(ev, ui) {
			if ($(ui.item).parents(".group-members-list>ul").length == 0) {
				let userID = $(ui.item).attr("data-user-id");

				if ($(`.group-members-list>ul > li[data-user-id="${userID}"]`, $createGroupToplayer).length > 0) {
					$(ui.item).remove();
					createGroupToplayer.notification(__groups.notificationMessages.alreadyExist, "error");
				}
			}
		}
	}).disableSelection();

	/**
	 * Save button
	 */
	let saveHandler = () => {
		let $users = $(".group-members-list>ul > li[data-user-id]", $createGroupToplayer);
		let $newUsers = $(".group-members-list>ul > li.new-user[data-user-id]", $createGroupToplayer);
		let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`);
		let groupData = {
			title: $groupName.val().trim(),
			members: [],
			color: $color.val()
		};

		$spinner.insertAfter($save);
		$save.off("click");

		if (group) {
			if ($users.length == 0) {
				Notification(__groups.notificationMessages.youNeedToAddMembers, "info");
			} else {

				let postToServer = () => {
					if ($users.length == groupData.members.length) {
						group.title = groupData.title;
						group.members = groupData.members;
						group.color = groupData.color;
						UpdateMessageGroup(group._id, groupData, res => {
							if (!res || !res.success) {
								createGroupToplayer.notification(__groups.notificationMessages.cantCreate, "error");
							} else {
								let $groupLi = groupLi(group);

								$groupLi.insertAfter(_currentGroupLi);
								_currentGroupLi.remove();
								createGroupToplayer.notification(__groups.notificationMessages.groupUpdated.replace("%{groupName}", groupData.title), "success");
							}
							$save.on("click", saveHandler);
							$spinner.remove();
							$newUsers.removeClass("new-user");
						});
					}
				}

				$users.each(function(i, li) {
					let brainlyID = li.dataset.userId;
					let member = group.members.find(member => member.brainlyID == brainlyID);

					if (member) {
						groupData.members.push(member);
						postToServer();
					} else {
						getMessageID(brainlyID, res => {
							let userData = {
								brainlyID
							};

							if (res && res.success) {
								userData.conversationID = res.data.conversation_id;
							}

							groupData.members.push(userData);
							postToServer();

						});
					}
				});
			}
		} else if (($newUsers.length > 0)) {
			$newUsers.each(function(i, li) {
				let brainlyID = li.dataset.userId;
				getMessageID(brainlyID, res => {
					let userData = {
						brainlyID
					};

					if (res && res.success) {
						userData.conversationID = res.data.conversation_id;
					}

					groupData.members.push(userData);

					if ($newUsers.length == groupData.members.length) {
						CreateMessageGroup(groupData, res => {
							if (!res || !res.success) {
								createGroupToplayer.notification(__groups.notificationMessages.cantCreate, "error");
								$closeIcon.on("click", closeIconHandler);
								svg.show();
								$spinner.remove();
							} else {
								groupData._id = res.data._id;
								groupData.pinned = false;
								groupData.time = Date();
								let $groupLi = groupLi(groupData);

								$groupLi.insertBefore(window.selectors.groupLiNotPinnedFirst);
								Notification(__groups.notificationMessages.groupCreated.replace("%{groupName}", groupData.title), "success");
								$closeIcon.parents(".js-modal").remove();

							}
						});
					}
				});
			});
		} else {}
	};

	$save.click(saveHandler);

	/**
	 * Modal close
	 */
	window.onbeforeunload = function() {
		let $newUsers = $(".group-members-list>ul > li.new-user[data-user-id]", $createGroupToplayer);

		if ($groupName.val() != $groupName.prop("defaultValue") || $newUsers.length > 0) {
			return System.data.locale.common.notificationMessages.ongoingProcess;
		}
	}
	let closeIconHandler = () => {
		let $users = $(".group-members-list>ul > li[data-user-id]", $createGroupToplayer);
		let $newUsers = $(".group-members-list>ul > li.new-user[data-user-id]", $createGroupToplayer);
		let svg = $("svg", $closeIcon);
		let $spinner = $(`<div class="sg-spinner sg-spinner--xxsmall"></div>`);

		$spinner.insertBefore(svg);
		svg.hide();
		$closeIcon.off("click");

		setTimeout(() => {
			if ($groupName.val() != $groupName.prop("defaultValue") || $newUsers.length > 0) {
				if (confirm(__groups.notificationMessages.unsavedChanges)) {
					$closeIcon.parents(".js-modal").remove();
				} else {
					$spinner.remove();
					svg.show();
					$closeIcon.click(closeIconHandler);
				}
			} else {
				$closeIcon.parents(".js-modal").remove();
			}
		}, 10);
	};
	$closeIcon.click(closeIconHandler);

	/**
	 * Group name input
	 */
	let groupNameInputHandler = function() {
		let firstLetter = "G";
		let value = this.value && this.value.trim();

		if (value && value.length > 0) {
			firstLetter = value.charAt(0).toLocaleUpperCase(System.data.Brainly.defaultConfig.user.ME.user.isoLocale);
		}

		$firstLetter.text(firstLetter);
	};
	$groupName.on("input", groupNameInputHandler);

	/**
	 * Group color picker
	 */
	let colorChangeHandler = function() {
		let color = { color: this.value };

		$firstLetter.css(color);
		$groupName.css(color);
	}
	$color.change(colorChangeHandler);

	/**
	 * User category list
	 */
	let $subActionListHole = null;
	let userCategoryListHandler = function() {
		$subActionListHole && $subActionListHole.remove();
		$subActionListHole = null;
		$findUsersList.html("");

		if (this.value == "findUsers") {
			$subActionListHole = $(`<div class="sg-actions-list__hole sg-box--full"></div>`);
			let $input = userSearch($createGroupToplayer);

			$input.appendTo($subActionListHole);
			$subActionListHole.appendTo($userCategorySelectorContainer);
			//$userCategoryList.removeClass("sg-dropdown--full-width");
		} else if (this.value == "moderatorRanks") {
			$subActionListHole = $(`<div class="sg-actions-list__hole sg-box--full"></div>`);
			let $input = rankSelector($createGroupToplayer);

			$input.appendTo($subActionListHole);
			$subActionListHole.appendTo($userCategorySelectorContainer);
			//$userCategoryList.removeClass("sg-dropdown--full-width");
		} else {
			if (this.value == "allModerators") {
				System.allModerators.list.forEach(({ id, nick, avatar, ranks_ids }) => {
					avatar = System.prepareAvatar(avatar);
					let buddyUrl = System.createBrainlyLink("profile", { nick, id });
					let ranks = [];

					ranks_ids.forEach(rankId => {
						ranks.push(System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId]);
					});

					let $li = userLi({
						id,
						nick,
						avatar,
						buddyUrl,
						ranks
					});

					$findUsersList.append($li);
				});
			}
			if (this.value == "friendsList") {
				System.friends.forEach(({ id, nick, buddyUrl, avatar, ranks }) => {
					avatar = System.prepareAvatar(avatar);

					if (ranks && ranks.names && ranks.names.length > 0) {
						ranks = ranks.names.map(rank => {
							return System.data.Brainly.defaultConfig.config.data.ranksWithName[rank];
						});
					}

					let $li = userLi({
						id,
						nick,
						avatar,
						buddyUrl,
						ranks
					});

					$findUsersList.append($li);
				});
			}
		}
	};
	$userCategoryList.on("change", userCategoryListHandler);

	/**
	 * Prepare modal for updating
	 */
	if (group) {
		let idList = group.members.map(member => ~~member.brainlyID);

		$groupName.trigger("input");
		getUserByID(idList, res => {
			if (res && res.success && res.data.length > 0) {
				res.data.forEach(({ id, nick, avatar, ranks_ids }) => {
					let buddyUrl = System.createBrainlyLink("profile", { nick, id });
					avatar = System.prepareAvatar(avatar);
					let ranks = [];

					if (ranks_ids && ranks_ids.length > 0) {
						ranks_ids.forEach(rankId => {
							ranks.push(System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId]);
						});
					}

					let $li = userLi({
						id,
						nick,
						avatar,
						buddyUrl,
						ranks
					}, true);

					$groupMembersList.append($li);
				});
			}
		});
	}
}

export default groupModal
