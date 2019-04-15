"use strict";

import notification from "../../../../components/notification";
import Modal from "../../../../components/Modal";
import Dropdown from "../../../../components/Dropdown";
import { GetUsersByID } from "../../../../controllers/ActionsOfBrainly";
import { CreateMessageGroup, UpdateMessageGroup } from "../../../../controllers/ActionsOfServer";
import userSearch from "./userSearch";
import rankSelector from "./rankSelector";
import userLi from "./userLi";
import renderGroupLi from "./groupLi";

class GroupModal {
  constructor(group, groupLi) {
    this.locale = System.data.locale.messages.groups;
    this.group = group;
    this.groupLi = groupLi;

    this.CreateModal();
    this.BindEvents();

    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  async CreateModal() {
    //if (true) {
    this.createGroupToplayer = new Modal({
      header: `<div class="sg-actions-list sg-actions-list--no-wrap">
				<div class="sg-actions-list__hole">
					<h2 class="sg-header-secondary">${this.locale[this.group?"editGroup":"createGroup"]}</h2>
				</div>
				<div class="sg-actions-list__hole sg-actions-list__hole--to-right">
					<div class="sg-spinner-container">
						<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--alt sg-button-secondary js-save">${System.data.locale.common.save}</button>
					</div>
				</div>
			</div>`,
      content: `<div class="sg-actions-list sg-actions-list--space-between group-header sg-content-box__content--spaced-bottom">
				<div class="sg-actions-list__hole">
					<div class="sg-actions-list sg-actions-list--space-between sg-actions-list--no-wrap">
						<div class="sg-actions-list__hole">
							<label class="sg-text sg-text--xxlarge js-first-letter"${this.group?` style="color:${this.group.color};"`:""}>G</label>
						</div>
						<div class="sg-actions-list__hole">
							<div class="color-container" title="${this.locale.groupColor}">
								<datalist id="flatColors">
									<option value="#1abc9c">Turquoise</option><option value="#2ecc71">Emerland</option><option value="#3498db">Peterriver</option><option value="#9b59b6">Amethyst</option><option value="#34495e">Wetasphalt</option><option value="#16a085">Greensea</option><option value="#27ae60">Nephritis</option><option value="#2980b9">Belizehole</option><option value="#8e44ad">Wisteria</option><option value="#2c3e50">Midnightblue</option><option value="#f1c40f">Sunflower</option><option value="#e67e22">Carrot</option><option value="#e74c3c">Alizarin</option><option value="#ecf0f1">Clouds</option><option value="#95a5a6">Concrete</option><option value="#f39c12">Orange</option><option value="#d35400">Pumpkin</option><option value="#c0392b">Pomegranate</option><option value="#bdc3c7">Silver</option><option value="#7f8c8d">Asbestos</option>
								</datalist>
								<input id="colorPicker" list="flatColors" type="color" placeholder="Text input" value="${this.group?this.group.color:"#000000"}">
							</div>
						</div>
						<div class="sg-actions-list__hole">
							<input type="text" class="sg-input sg-input--light-alt sg-input--full-width sg-input--large js-group-name" placeholder="${this.locale.groupName}"${this.group?` style="color:${this.group.color};" value="${this.group.title}"`:""}>
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
							<h2 class="sg-headline sg-headline--normal sg-headline--gray sg-headline--justify">${this.locale.groupMembers}</h2>
						</div>
						<div class="sg-actions-list__hole">
							<button class="sg-button-secondary sg-button-secondary--alt">${this.locale.removeAll}</button>
						</div>
					</div>
					<ul class="sg-list sg-list--spaced-elements"></ul>
				</div>
				<div class="sg-card__hole find-users find-users-list">
					<div class="sg-actions-list sg-actions-list--space-between">
						<div class="sg-actions-list__hole">
							<h2 class="sg-headline sg-headline--normal sg-headline--gray sg-headline--justify">${this.locale.searchResults}</h2>
						</div>
						<div class="sg-actions-list__hole">
							<button class="sg-button-secondary sg-button-secondary--alt">${this.locale.addAll}</button>
						</div>
					</div>
					<ul class="sg-list sg-list--spaced-elements"></ul>
				</div>
			</div>`,
      size: "limited-width"
    });
    //}
    let $createGroupToplayer = this.createGroupToplayer.$modal;
    this.$toplayerContainer = $(`<div class="js-toplayers-container"></div>`);

    this.$toplayerContainer.insertBefore("footer.js-page-footer");
    $createGroupToplayer.appendTo(this.$toplayerContainer);

    this.$closeIcon = $(".sg-toplayer__close", $createGroupToplayer);
    this.$closeIconSVG = $("svg", this.$closeIcon);
    this.$saveButton = $("button.js-save", $createGroupToplayer);

    this.$color = $("input#colorPicker", this.$toplayerContainer);
    this.$groupName = $("input.js-group-name", $createGroupToplayer);
    this.$userCategorySelectorContainer = $(".group-header > div.sg-actions-list__hole > div.user-category-selector", $createGroupToplayer);

    this.$groupMembersList = $(".group-members-list>ul", $createGroupToplayer);
    this.$findUsersList = $(".find-users-list>ul", $createGroupToplayer);
    this.$removeAll = $(".group-members-list>.sg-actions-list button", $createGroupToplayer);
    this.$addAll = $(".find-users-list>.sg-actions-list button", $createGroupToplayer);

    this.$userCategoryList = Dropdown({
      label: this.locale.selectGroupType,
      class: "sg-dropdown--full-width",
      items: [{
          value: "findUsers",
          text: this.locale.userCategories.findUsers.text
        },
        {
          value: "moderatorRanks",
          text: this.locale.userCategories.moderatorRanks.text
        },
        {
          value: "allModerators",
          text: this.locale.userCategories.allModerators
        },
        {
          value: "friendsList",
          text: this.locale.userCategories.friendsList
        }
      ]
    });

    this.$userCategoryList.appendTo($(".sg-actions-list__hole", this.$userCategorySelectorContainer));

    /**
     * Prepare modal for updating
     */
    if (this.group) {
      let idList = this.group.members.map(member => ~~member.brainlyID);

      this.$groupName.trigger("input");
      let user = await GetUsersByID(idList);

      if (user && user.success && user.data.length > 0) {
        user.data.forEach(({ id, nick, avatar, ranks_ids }) => {
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

          this.$groupMembersList.append($li);
        });
      }
    }
  }
  BindEvents() {
    let that = this;
    /**
     * Modal close
     */
    window.onbeforeunload = () => {
      if (this.$toplayerContainer) {
        let $newUsers = $(".group-members-list>ul > li.new-user[data-user-id]", this.$toplayerContainer);

        if (this.$groupName.val() != this.$groupName.prop("defaultValue") || $newUsers.length > 0) {
          return System.data.locale.common.notificationMessages.ongoingProcess;
        }
      }
    }

    /**
     * Add and Remove all buttons
     */
    this.$addAll.click(this.AddAllUsersToGroupMembersList.bind(this));
    this.$removeAll.click(this.RemoveAllUsersToGroupMembersList.bind(this));

    /**
     * Save button
     */
    this.$saveButton.click(this.SaveGroup.bind(this));

    /**
     * Close button
     */
    this.$closeIcon.click(this.CloseModal.bind(this));

    /**
     * Bind the jQuery UI Sortable
     */
    $(".find-users-list>ul, .group-members-list>ul", this.$toplayerContainer).sortable({
      connectWith: ".sg-list",
      snap: this.$findUsersList,
      snapMode: "inner",
      revert: true,
      start: function(e, ui) {
        if ($(ui.item).parents(".group-members-list>ul").length == 0) {
          let userID = $(ui.item).attr("data-user-id");

          if ($(`.group-members-list>ul > li[data-user-id="${userID}"]`, this.$toplayerContainer).length > 0) {
            $(ui.item).remove();
            this.createGroupToplayer.notification(this.locale.notificationMessages.alreadyExist, "error");
          }
        }
      }
    }).disableSelection();

    /**
     * Group name input
     */
    let $firstLetter = $("label.js-first-letter", this.$toplayerContainer);
    let groupNameInputHandler = function() {
      let firstLetter = "G";
      let value = this.value && this.value.trim();

      if (value && value.length > 0) {
        firstLetter = value.charAt(0).toLocaleUpperCase(System.data.Brainly.defaultConfig.user.ME.user.isoLocale.replace("_", "-"));
      }

      $firstLetter.text(firstLetter);
    };
    this.$groupName.on({
      input: groupNameInputHandler,
      blur: function() {
        this.value = this.value.trim();
      }
    });

    /**
     * Group color picker
     */
    let colorChangeHandler = function() {
      let color = { color: this.value };

      $firstLetter.css(color);
      that.$groupName.css(color);
    }
    this.$color.change(colorChangeHandler);

    /**
     * User category list
     */
    let $subActionListHole;
    let userCategoryListHandler = function() {
      if ($subActionListHole) {
        $subActionListHole.remove();

        $subActionListHole = undefined;
      }

      that.$findUsersList.html("");

      if (this.value == "findUsers") {
        $subActionListHole = $(`<div class="sg-actions-list__hole sg-box--full"></div>`);
        let $input = userSearch(that.$toplayerContainer);

        $input.appendTo($subActionListHole);
        $subActionListHole.appendTo(that.$userCategorySelectorContainer);
        //$userCategoryList.removeClass("sg-dropdown--full-width");
      } else if (this.value == "moderatorRanks") {
        $subActionListHole = $(`<div class="sg-actions-list__hole sg-box--full"></div>`);
        let $input = rankSelector(that.$toplayerContainer);

        $input.appendTo($subActionListHole);
        $subActionListHole.appendTo(that.$userCategorySelectorContainer);
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

            that.$findUsersList.append($li);
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

            that.$findUsersList.append($li);
          });
        }
      }
    };

    this.$userCategoryList.on("change", userCategoryListHandler);

  }
  AddAllUsersToGroupMembersList() {
    let $users = $(">li", this.$findUsersList);

    $users.each((i, userLi) => {
      if ($(`li[data-user-id="${userLi.dataset.userId}"]`, this.$groupMembersList).length == 0) {
        $(userLi).appendTo(this.$groupMembersList);
      } else {
        userLi.remove();
      }
    });
  }
  RemoveAllUsersToGroupMembersList() {
    let $users = $(">li", this.$groupMembersList);

    if ($users.length > 0 && confirm(this.locale.notificationMessages.doYouWantToRemoveMembers)) {
      this.$findUsersList.html("");

      $users.appendTo(this.$findUsersList);
    }
  }
  SaveGroup() {
    let $groupMembersLi = $(".group-members-list>ul > li[data-user-id]", this.$toplayerContainer);
    this.$newGroupMembersLi = $(".group-members-list>ul > li.new-user[data-user-id]", this.$toplayerContainer);
    this.$spinnerSaveButton = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`);
    let groupData = {
      color: this.$color.val(),
      title: this.$groupName.val().trim(),
      members: []
    };

    this.$spinnerSaveButton.insertAfter(this.$saveButton);
    this.$saveButton.off("click");
    this.$closeIcon.off("click");

    if (this.group) {
      if ($groupMembersLi.length == 0) {
        notification(this.locale.notificationMessages.youNeedToAddMembers, "info");
      } else {

        console.log(this.group);
        $groupMembersLi.each((i, li) => {
          let brainlyID = li.dataset.userId;
          let member = this.group.members.find(member => member.brainlyID == brainlyID);

          if (member) {
            console.log("checkAddedDateofConversationId:", member);
            groupData.members.push(member);
          } else {
            groupData.members.push({
              brainlyID
            });
          }
        });

        this.group.title = groupData.title;
        this.group.members = groupData.members;
        this.group.color = groupData.color;
        this.UpdateGroup(groupData);
      }
    } else if ((this.$newGroupMembersLi.length > 0)) {
      this.$newGroupMembersLi.each(function(i, li) {
        let brainlyID = li.dataset.userId;

        groupData.members.push({
          brainlyID
        });
      });
      this.CreateGroup(groupData);
    } else {
      this.createGroupToplayer.notification(this.locale.notificationMessages.youNeedToAddMembers, "info");
      this.$spinnerSaveButton.remove();
      this.$saveButton.on("click", this.SaveGroup.bind(this));
      this.$closeIcon.click(this.CloseModal.bind(this));
    }
  }
  async CreateGroup(groupData) {

    let resCreatedGroup = await CreateMessageGroup(groupData);

    if (!resCreatedGroup || !resCreatedGroup.success) {
      this.$spinnerSaveButton.remove();
      this.$closeIcon.click(this.CloseModal.bind(this));
      this.$saveButton.click(this.SaveGroup.bind(this));
      this.createGroupToplayer.notification(this.locale.notificationMessages.cantCreate, "error");
      this.reject("Can't create group");
    } else {
      groupData.time = Date();
      groupData.pinned = false;
      groupData._id = resCreatedGroup.data._id;

      this.resolve(groupData);
      this.CloseModal(true);
      notification(this.locale.notificationMessages.groupCreated.replace("%{groupName}", ` ${groupData.title} `), "success");
    }
  }
  async UpdateGroup(groupData) {
    let resUpdatedGroup = await UpdateMessageGroup(this.group._id, groupData);

    if (!resUpdatedGroup || !resUpdatedGroup.success) {
      this.createGroupToplayer.notification(this.locale.notificationMessages.cantCreate, "error");
    } else {
      let $groupLi = renderGroupLi(this.group);

      $groupLi.insertAfter(this.groupLi);
      this.groupLi.remove();

      this.$groupName.prop("defaultValue", groupData.title);

      this.createGroupToplayer.notification(this.locale.notificationMessages.groupUpdated.replace("%{groupName}", ` ${groupData.title} `), "success");
    }

    this.$spinnerSaveButton.remove();
    this.$saveButton.on("click", this.SaveGroup.bind(this));
    this.$closeIcon.click(this.CloseModal.bind(this));
    this.$newGroupMembersLi.removeClass("new-user");
  }
  async CloseModal(forceClose) {
    let $newUsers = $(".group-members-list>ul > li.new-user[data-user-id]", this.$toplayerContainer);
    let $spinner = $(`<div class="sg-spinner sg-spinner--xxsmall"></div>`);

    $spinner.insertBefore(this.$closeIconSVG);
    this.$closeIconSVG.hide();
    this.$closeIcon.off("click");

    /**
     * Adding a delayer for avoiding from having no icon animation because of the confirm dialog
     */
    await System.Delay(50);

    if (
      forceClose == true ||
      (
        (
          this.$groupName.val() == this.$groupName.prop("defaultValue") && $newUsers.length == 0
        ) ||
        confirm(System.data.locale.common.notificationMessages.unsavedChanges)
      )
    ) {
      this.reject();
      this.$toplayerContainer.remove();

      this.$toplayerContainer = undefined;
    } else {
      $spinner.remove();
      this.$closeIconSVG.show();
      this.$closeIcon.click(this.CloseModal.bind(this));
    }
  }
}
export default GroupModal
