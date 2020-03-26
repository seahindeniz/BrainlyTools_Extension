import ServerReq from "@ServerReq";
import notification from "../notification";
import PrivilegeCategory from "./_/PrivilegeCategory";
import moment from "moment";

class Users {
  constructor() {
    /**
     * @type {Object<string, {title: string, privileges: (number|number[])[]}>}
     */
    this.privilegeListOrder = {
      veryImportant: {
        title: System.data.locale.popup.extensionManagement.users.veryImportant,
        privileges: [
          0,
          29,
          [
            27,
            30,
            31,
            32,
            33,
          ],
        ]
      },
      important: {
        title: System.data.locale.popup.extensionManagement.users.important,
        privileges: [
          /* 4, */
          [
            5,
            22,
            23,
            24,
            25,
          ],
          7,
          17,
          18,
          13,
          9,
        ]
      },
      lessImportant: {
        title: System.data.locale.popup.extensionManagement.users.lessImportant,
        privileges: [
          21,
          20,
          11,
          10,
          14,
          26,
          15,
          6,
          //34,
        ]
      },
      harmless: {
        title: System.data.locale.popup.extensionManagement.users.harmless,
        privileges: [
          12,
          8,
          28,
          1,
          2,
          45,
          16,
          19,
          36,
        ]
      }
    };

    this.Render();

    if (System.checkUserP(0))
      this.RenderEditAllUsersPrivilegesSection();

    this.RenderEditUserSection();

    if (System.checkUserP([5, 22]))
      this.RenderPermissionContainer();

    if (System.checkUserP([5, 23, 24, 25])) {
      this.RenderPrivilegesContainer();

      if (System.checkUserP([0])) {
        new PrivilegeCategory(this, "veryImportant");
      }
      if (System.checkUserP([5, 23])) {
        new PrivilegeCategory(this, "important");
      }
      if (System.checkUserP([5, 24])) {
        new PrivilegeCategory(this, "lessImportant");
      }
      if (System.checkUserP([5, 25])) {
        new PrivilegeCategory(this, "harmless");
      }
    }

    this.PrepareUsers();
    this.BindHandlers();
  }
  Render() {
    this.$layout = $(`
		<div id="users" class="column is-narrow">
			<article class="message is-warning">
				<div class="message-header" title="${System.data.locale.popup.extensionManagement.users.title}">
					<p>${System.data.locale.popup.extensionManagement.users.text}</p>
				</div>
        <div class="message-body">
          <div>
            <article class="media">
              <nav class="level is-block">
                <div class="level-left is-block"></div>
              </nav>
            </article>
          </div>
          <p class="help">${System.data.locale.popup.extensionManagement.users.explainingColors.line1}</br>
          ${System.data.locale.popup.extensionManagement.users.explainingColors.line2.replace(/<s>(.*)<\/s>/, '<b style="color:#f00">$1</b>')}</br>
          ${System.data.locale.popup.extensionManagement.users.explainingColors.line3.replace(/<s>(.*)<\/s>/, '<b style="color:#fc0">$1</b>')}</br>
          ${System.data.locale.popup.extensionManagement.users.explainingColors.line4.replace(/<s>(.*)<\/s>/, '<b style="color:#0f0">$1</b>')}</br>
          ${System.data.locale.popup.extensionManagement.users.explainingColors.line5.replace(/<s>(.*)<\/s>/, '<b>$1</b>')}</p>
				</div>
			</article>
		</div>`);

    this.$level = $(".level > .level-left", this.$layout);
    this.$headerP = $("> article > .message-header > p", this.$layout);
    this.$editSectionContainer = $("> article > .message-body > div", this.$layout);
  }
  RenderEditAllUsersPrivilegesSection() {
    this.$editAllUsersPrivilegesSection = $(`
      <div class="columns">
        <div class="column">
          <div class="columns">
            <div class="column">
              <div class="media-content has-text-centered">
                <label class="label" for="changeUserPrivileges">${System.data.locale.popup.extensionManagement.users.changeUserPrivileges}</label>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="media-content">
                <div class="content">
                  <div class="field is-grouped">
                    <div class="control is-expanded">
                      <div class="select is-fullwidth">
                        <select class="privileges" id="changeUserPrivileges">
                          <option>${System.data.locale.common.select}</option>
                        </select>
                      </div>
                    </div>
                    <p class="control">
                      <a class="button is-success">
                        ${System.data.locale.popup.extensionManagement.users.give}
                      </a>
                    </p>
                    <p class="control">
                      <a class="button is-danger">
                        ${System.data.locale.popup.extensionManagement.users.revoke}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`);

    this.$privilegesSelect = $("select", this.$editAllUsersPrivilegesSection);
    this.$giveButton = $(".button.is-success", this.$editAllUsersPrivilegesSection);
    this.$revokeButton = $(".button.is-danger", this.$editAllUsersPrivilegesSection);

    this.$editAllUsersPrivilegesSection.appendTo(this.$editSectionContainer);
  }
  RenderEditUserSection() {
    this.$editUserSectionContainer = $(`
    <div>
      <article class="media addNew">
        <div class="media-content field-label has-text-centered">
          <label class="label" for="addNewOrEdit">${System.data.locale.popup.extensionManagement.users.addNewOrEditUser}</label>
        </div>
      </article>
      <article class="media addNew user">
        <div class="media-left is-invisible has-text-centered">
          <a target="_blank">
            <figure class="image is-48x48">
              <img class="avatar is-rounded" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
            </figure>
            <div>
              <p id="nick"></p>
            </div>
          </a>
        </div>
        <div class="media-content">
          <div class="content">
            <div class="field">
              <div class="control is-expanded has-icons-left">
                <input id="addNewOrEdit" class="input id" type="text" placeholder="${System.data.locale.common.profileID}">
                <span class="icon is-left">
                  <i class="fas fa-user"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="media-right is-invisible">
          <a href="#" class="icon has-text-success" title="${System.data.locale.common.save}">
            <i class="fas fa-check"></i>
          </a>
          <br>
          <a href="#" class="icon has-text-danger" title="${System.data.locale.common.clearInputs}">
            <i class="fas fa-undo"></i>
          </a>
        </div>
      </article>
    </div>`);

    this.$settingsContainer = $(".media-content > .content > .field", this.$editUserSectionContainer);
    this.$idInput = $('input', this.$editUserSectionContainer);
    this.$avatarContainer = $(".media-left", this.$editUserSectionContainer);
    this.$link = $("a", this.$avatarContainer);
    this.$nick = $("#nick", this.$link);
    this.$avatar = $("img.avatar", this.$link);
    this.$actions = $(".media-right", this.$editUserSectionContainer);
    this.$resetButton = $(".has-text-danger", this.$actions);
    this.$submitButton = $(".has-text-success", this.$actions);

    this.$editUserSectionContainer.appendTo(this.$editSectionContainer);
  }
  async PrepareUsers() {
    let resUsers = await new ServerReq().GetUsers();

    if (resUsers.success && resUsers.data) {
      this.RenderUserNodes(resUsers.data);
      window.popup.refreshUsersInformation();
      this.FocusOnUser();
    }
  }
  RenderUserNodes(usersData) {
    if (typeof usersData === 'object') {
      this.$level.html("");
      this.HideEditingForm(true);

      if (usersData instanceof Array) {
        if (usersData.length > 0) {
          usersData.forEach(this.RenderUserNode.bind(this));
        }
      } else {
        this.RenderUserNode(usersData);
      }
    }
  }
  RenderUserNode(serverData) {
    let time = "";
    let userStatus = "";

    window.popup.ReserveAUser(serverData.brainlyID, { serverData });

    if (serverData.approved) {
      userStatus += " approved";
    }

    if (!serverData.checkInTime) {
      time = System.data.locale.popup.extensionManagement.users.hasntUsed;
    } else {
      let timeLong = moment(serverData.checkInTime).fromNow();
      time = System.data.locale.popup.extensionManagement.users.firstUsageTimeAgoPreTitle.replace("%{time}", ` ${timeLong} `);

      if (serverData.approved) {
        userStatus += " active";
      } else {
        userStatus += " banned";
      }
    }

    let $node = $(`
		<div class="level-item is-inline-block has-text-centered">
			<a data-user-id="${serverData.brainlyID}" id="${serverData._id}" title="${time}" target="_blank">
				<figure class="image is-48x48${userStatus}">
					<img class="avatar is-rounded" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
				</figure>
				<p class="nick">${serverData.nick}</p>
			</a>
		</div>`);

    this.$level.append($node);

    return $node;
  }
  RenderPermissionContainer() {
    this.$permissionContainer = $(`
    <div class="control permission marginTop20 is-hidden">
      <div class="field">
        <input id="switchPermission" type="checkbox" class="switch is-rtls" checked="checked">
        <label for="switchPermission">${System.data.locale.popup.extensionManagement.users.permission}</label>
      </div>
    </div>`);

    this.$permission = $("input", this.$permissionContainer);

    this.$permissionContainer.appendTo(this.$settingsContainer);
  }
  RenderPrivilegesContainer() {
    this.$privilegesContainer = $(`
    <div class="control privileges marginTop20 is-hidden">
      <label class="label">${System.data.locale.popup.extensionManagement.users.privileges}</label>
    </div>`);

    this.$privilegesContainer.appendTo(this.$settingsContainer);
  }
  RenderDivider(title) {
    let $divider = $(`<div class="is-divider"${title ? ` data-content="${title}"` : ""}></div>`);

    this.$privilegesContainer.append($divider);
  }
  BindHandlers() {
    let that = this;

    this.$level.on("click", ".level-item > a", function(e) {
      e.preventDefault();

      let id = this.dataset["userId"];

      that.$idInput.val(id).trigger("input").focus();
    });

    this.$idInput.on("input", this.UserSearch.bind(this));
    this.$resetButton.click(event => (event.preventDefault(), this.HideEditingForm(true)));
    this.$submitButton.click(event => (event.preventDefault(), this.SubmitForm()));

    if (this.$giveButton)
      this.$giveButton.click(this.GivePrivilege.bind(this));

    if (this.$revokeButton)
      this.$revokeButton.click(this.RevokePrivilege.bind(this));
  }
  async UserSearch() {
    let id = this.GetIdFromInput();

    if (id == 0) {
      this.HideEditingForm();
    } else {
      try {
        let user = await window.popup.GetStoredUser(id);

        this.FillEditingForm(user);
      } catch (error) {
        notification(System.data.locale.popup.notificationMessages.cannotFindUser, "danger");
        this.HideEditingForm();
      }
    }
  }
  GetIdFromInput() {
    let value = this.$idInput.val();

    return System.ExtractId(String(value));
  }
  HideEditingForm(clearInput) {
    this.$link.attr("href", "");
    this.$nick.text("");
    this.$avatar.attr("src", "");
    this.$avatarContainer.addClass("is-invisible");
    this.$actions.addClass("is-invisible");

    if (this.$permissionContainer)
      this.$permissionContainer.addClass("is-hidden");

    if (this.$privilegesContainer)
      this.$privilegesContainer.addClass("is-hidden");

    if (clearInput) {
      this.$idInput.val("");
    }
  }
  async FillEditingForm(user) {
    let avatar = System.prepareAvatar(user.brainlyData);
    let profileLink = System.createProfileLink(user.brainlyData);
    /**
     * @type {JQuery<HTMLInputElement>}
     */
    this.$privilegeInputs = $('input[type="checkbox"]', this.$privilegesContainer);

    this.$nick.text(user.brainlyData.nick);
    this.$avatar.attr("src", avatar);
    this.$link.attr("href", profileLink);
    this.$actions.removeClass("is-invisible");
    this.$permission.prop("checked", false);
    this.$privilegeInputs.prop("checked", false);
    this.$avatarContainer.removeClass("is-invisible");

    if (this.$permissionContainer)
      this.$permissionContainer.removeClass("is-hidden");

    if (this.$privilegesContainer)
      this.$privilegesContainer.removeClass("is-hidden");

    if (user.serverData) {
      this.$permission.prop("checked", user.serverData.approved);

      if (user.serverData.privileges && user.serverData.privileges.length > 0)
        this.$privilegeInputs.each((i, input) => {
          if (user.serverData.privileges.includes(input.key))
            input.checked = true;
        });
    }
  }
  async SubmitForm() {
    let id = this.GetIdFromInput();

    if (isNaN(id)) {
      notification(System.data.locale.popup.notificationMessages.idNumberRequired, "danger");
    } else if (id <= 0) {
      notification(System.data.locale.popup.notificationMessages.invalidId, "danger");
    } else {
      try {
        let user = await window.popup.GetStoredUser(id);

        this.SaveUser(user);
      } catch (error) {
        console.error(error);
        notification(System.data.locale.popup.notificationMessages.cannotFindUser, "danger");
      }
    }
  }
  async SaveUser(user) {
    try {
      let privileges = $("input:checked", this.$privilegesContainer).map((i, input) => typeof input.key == "number" && input.key).get();
      let approved = this.$permission.prop("checked");
      let resUser = await new ServerReq().PutUser({
        id: user.brainlyData.id,
        nick: user.brainlyData.nick,
        privileges,
        approved
      });

      if (!resUser.success)
        throw resUser.message;

      notification(System.data.locale.common.allDone, "success");

      $("#" + resUser.data._id, this.$level).parent().remove();

      let $node = this.RenderUserNode(resUser.data);
      window.popup.refreshUsersInformation();

      $('html, body').animate({
        scrollTop: $node.offset().top
      }, 1000);

      this.HideEditingForm(true);
    } catch (error) {
      console.error(error);
      notification(typeof error == "string" && error || System.data.locale.common.notificationMessages.operationError, "danger");
    }
  }
  async GivePrivilege() {
    if (confirm(System.data.locale.popup.notificationMessages.doYouWannaGiveThisPrivilege)) {
      let value = this.$privilegesSelect.val();
      let privilege = Number(value);

      if (privilege > 0) {
        let res = await new ServerReq().GivePrivilege(privilege);

        this.PrepareUsers();
        notification(System.data.locale.popup.notificationMessages.privilegeHasGiven.replace("%{user_amount}", ` ${res.data.affected} `), "success");
      }
    }
  }
  async RevokePrivilege() {
    if (confirm(System.data.locale.popup.notificationMessages.doYouWannaRevokeThisPrivilege)) {
      let value = this.$privilegesSelect.val();
      let privilege = Number(value);

      if (privilege > 0) {
        let res = await new ServerReq().RevokePrivilege(privilege);

        this.PrepareUsers();
        notification(System.data.locale.popup.notificationMessages.privilegeHasRevoked.replace("%{user_amount}", ` ${res.data.affected} `), "success");
      }
    }
  }
  FocusOnUser() {
    let id = window.popup.parameters.editUser;

    if (id) {
      this.$headerP.click();
      this.$idInput.val(id).trigger("input").focus();
    }
  }
}

export default Users
