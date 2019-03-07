import { GetUsers, PutUser, GivePrivilege, RevokePrivilege } from "../../scripts/controllers/ActionsOfServer";
import notification from "./notification";

class Users {
	constructor() {
		this.pListOrder = [
			0,
			4,
			5,
			11,
			17,
			18,
			10,
			7,
			13,
			9,
			"",
			1,
			2,
			45,
			14,
			15,
			16,
			6,
			8
		];
		return this.Render();
	}
	Render() {
		this.$layout = $(`
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
					<article class="media addNew">
						<div class="media-content field-label has-text-centered">
							<label class="label" for="changeUserPrivileges">${System.data.locale.popup.extensionManagement.users.changeUserPrivileges}</label>
						</div>
					</article>
					<article class="media addNew changeUserPrivileges">
						<div class="media-content">
							<div class="content">
								<div class="field is-grouped">
									<div class="control is-expanded">
										<div class="select">
											<select class="privileges">
												<option>${System.data.locale.common.select}</option>
											</select>
										</div>
									</div>
									<p class="control">
										<a class="button is-success give">
											${System.data.locale.popup.extensionManagement.users.give}
										</a>
									</p>
									<p class="control">
										<a class="button is-danger revoke">
											${System.data.locale.popup.extensionManagement.users.revoke}
										</a>
									</p>
								</div>
							</div>
						</div>
					</article>

					<article class="media addNew">
						<div class="media-content field-label has-text-centered">
							<label class="label" for="addNewOrEdit">${System.data.locale.popup.extensionManagement.users.addNewOrEditUser}</label>
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
										<input id="addNewOrEdit" class="input id" type="text" placeholder="${System.data.locale.common.profileID}">
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
										<label class="label">${System.data.locale.popup.extensionManagement.users.privileges}</label>
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
					</article>
					<p class="help">${System.data.locale.popup.extensionManagement.users.explainingColors.line1}</br>
					${System.data.locale.popup.extensionManagement.users.explainingColors.line2.replace(/<s>(.*)<\/s>/, '<b style="color:#f00">$1</b>')}</br>
					${System.data.locale.popup.extensionManagement.users.explainingColors.line3.replace(/<s>(.*)<\/s>/, '<b style="color:#fc0">$1</b>')}</br>
					${System.data.locale.popup.extensionManagement.users.explainingColors.line4.replace(/<s>(.*)<\/s>/, '<b style="color:#0f0">$1</b>')}</br>
					${System.data.locale.popup.extensionManagement.users.explainingColors.line5.replace(/<s>(.*)<\/s>/, '<b>$1</b>')}</p>
				</div>
			</article>
		</div>`);

		this.$avatarContainer = $(".media-left", this.$layout);
		this.$privilegesSelect = $("select.privileges", this.$layout);
		this.$privilegesContainer = $(".control.privileges", this.$layout);
		this.$permissionContainer = $(".media-content .permission", this.$layout);

		this.$link = $("a", this.$avatarContainer);
		this.$idInput = $('input.id', this.$layout);
		this.$nick = $(".nick", this.$avatarContainer);
		this.$actions = $(".media-right", this.$layout);
		this.$avatar = $("img.avatar", this.$avatarContainer);
		this.$level = $(".level > .level-left", this.$layout);
		this.$permission = $("input", this.$permissionContainer);
		this.$resetButton = $(".media-right > .reset", this.$layout);
		this.$submitButton = $(".media-right > .submit", this.$layout);
		this.$giveButton = $(".changeUserPrivileges .button.give", this.$layout);
		this.$revokeButton = $(".changeUserPrivileges .button.revoke", this.$layout);

		this.PrepareUsers();
		this.RenderPrivilegesList();
		this.BindEvents();

		return this.$layout;
	}
	async PrepareUsers() {
		let resUsers = await GetUsers();

		if (resUsers.success && resUsers.data) {
			this.RenderUserNodes(resUsers.data);
			window.popup.refreshUsersInformations();
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
			time = System.data.locale.popup.extensionManagement.users.firstUsageTimeAgoPreTitle.replace("%{time}", timeLong);

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
	RenderPrivilegesList() {
		this.pListOrder.forEach(key => {
			let element;

			if (typeof key == "string") {
				element = `<div class="is-divider" style="margin: 1em 0;"${key ? ` data-content="${key}"` : ""}></div>`;
			} else {
				let privilege = System.data.locale.popup.extensionManagement.users.privilegeList[key];

				if (privilege) {
					if (!key == 0) {
						this.$privilegesSelect.append(`<option value="${key}" title="${privilege.description}">${privilege.title}</option>`);
					}

					element = `
					<div class="field" title="${privilege.description}">
						<input class="is-checkradio is-block is-info" id="p-${key}" type="checkbox">
						<label for="p-${key}">${privilege.title}</label>
					</div>`;
				}
			}

			if (element)
				this.$privilegesContainer.append(element);
		});

		this.$privilegeInputs = $('input[type="checkbox"]', this.$privilegesContainer);
	}
	BindEvents() {
		let that = this;

		this.$level.on("click", ".level-item > a", function(e) {
			e.preventDefault();

			let id = this.dataset["userId"];

			that.$idInput.val(id).trigger("input").focus();
		});

		this.$idInput.on("input", this.UserSearch.bind(this));
		this.$resetButton.click(event => (event.preventDefault(), this.HideEditingForm(true)));
		this.$submitButton.click(event => (event.preventDefault(), this.SubmitForm()));
		this.$giveButton.click(this.GivePrivilege.bind(this));
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

		return System.ExtractId(value);
	}
	HideEditingForm(clearInput) {
		this.$link.attr("href", "");
		this.$nick.text("");
		this.$avatar.attr("src", "");
		this.$avatarContainer.addClass("is-invisible");
		this.$actions.addClass("is-invisible");
		this.$permissionContainer.addClass("is-hidden");
		this.$privilegesContainer.addClass("is-hidden");

		if (clearInput) {
			this.$idInput.val("");
		}
	}
	async FillEditingForm(user) {
		let avatar = System.prepareAvatar(user.brainlyData);
		let profileLink = System.createProfileLink(user.brainlyData.nick, user.brainlyData.id);

		this.$nick.text(user.brainlyData.nick);
		this.$avatar.attr("src", avatar);
		this.$link.attr("href", profileLink);
		this.$actions.removeClass("is-invisible");
		this.$permission.prop("checked", false)
		this.$privilegeInputs.prop("checked", false);
		this.$avatarContainer.removeClass("is-invisible");
		this.$permissionContainer.removeClass("is-hidden");
		this.$privilegesContainer.removeClass("is-hidden");

		if (user.serverData) {
			this.$permission.prop("checked", user.serverData.approved);

			if (user.serverData.privileges && user.serverData.privileges.length > 0) {
				user.serverData.privileges.forEach(type => $("#p-" + type, this.$privilegesContainer).prop("checked", true));
			}
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
			let privileges = $("input:checked", this.$privilegesContainer).map((i, input) => ~~(input.id.replace("p-", ""))).get();
			let approved = this.$permission.prop("checked");
			let resUser = await PutUser({
				id: user.brainlyData.id,
				nick: user.brainlyData.nick,
				privileges,
				approved
			});

			if (!resUser.success) {
				throw resUser.message;
			}

			notification(System.data.locale.common.allDone, "success");

			$("#" + resUser.data._id, this.$level).parent().remove();

			let $node = this.RenderUserNode(resUser.data);
			window.popup.refreshUsersInformations();

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
				let res = await GivePrivilege(privilege);

				this.PrepareUsers();
				notification(System.data.locale.popup.notificationMessages.privilegeHasGiven.replace("%{user_amount}", res.data.affected), "success");
			}
		}
	}
	async RevokePrivilege() {
		if (confirm(System.data.locale.popup.notificationMessages.doYouWannaRevokeThisPrivilege)) {
			let value = this.$privilegesSelect.val();
			let privilege = Number(value);

			if (privilege > 0) {
				let res = await RevokePrivilege(privilege);

				this.PrepareUsers();
				notification(System.data.locale.popup.notificationMessages.privilegeHasRevoked.replace("%{user_amount}", res.data.affected), "success");
			}
		}
	}
}

export default Users
