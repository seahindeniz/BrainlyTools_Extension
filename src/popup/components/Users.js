import { GetUsers, PutUser } from "../../scripts/controllers/ActionsOfServer";
import { getUserByID2 } from "../../scripts/controllers/ActionsOfBrainly";
import notification from "./notification";

class Users {
	constructor() {
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
										<input class="input" type="text" placeholder="${System.data.locale.common.profileID}">
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
					<p class="help">${System.data.locale.popup.extensionManagement.users.explainingColors.line1}</br></br>
					${System.data.locale.popup.extensionManagement.users.explainingColors.line2.replace(/<s>(.*)<\/s>/, '<b style="color:#f00">$1</b>')}</br>
					${System.data.locale.popup.extensionManagement.users.explainingColors.line3.replace(/<s>(.*)<\/s>/, '<b style="color:#fc0">$1</b>')}</br>
					${System.data.locale.popup.extensionManagement.users.explainingColors.line4.replace(/<s>(.*)<\/s>/, '<b style="color:#0f0">$1</b>')}</br>
					${System.data.locale.popup.extensionManagement.users.explainingColors.line5.replace(/<s>(.*)<\/s>/, '<b>$1</b>')}</p>
				</div>
			</article>
		</div>`);

		this.$level = $(".level > .level-left", this.$layout);
		this.$privilegesContainer = $(".control.privileges", this.$layout);
		this.$idInput = $('input[type="text"]', $addNewBox);

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
			if (usersData instanceof Array) {
				if (usersData.length > 0) {
					usersData.forEach(this.RenderUserNode.bind(this));
				}
			} else {
				this.RenderUserNode(usersData);
			}
		}
	}
	RenderUserNode(user) {
		let time = "";
		let userStatus = "";

		if (user.approved) {
			userStatus += " approved";
		}

		if (!user.checkInTime) {
			time = System.data.locale.popup.extensionManagement.users.hasntUsed;
		} else {
			let timeLong = moment(user.checkInTime).fromNow();
			time = System.data.locale.popup.extensionManagement.users.firstUsageTimeAgoPreTitle.replace("%{time}", timeLong);

			if (user.approved) {
				userStatus += " active";
			} else {
				userStatus += " banned";
			}
		}

		window.popup.ReserveAUser(user.brainlyID, user);

		let $node = $(`
		<div class="level-item is-inline-block has-text-centered">
			<a data-user-id="${user.brainlyID}" id="${user._id}" title="${time}" target="_blank">
				<figure class="image is-48x48${userStatus}">
					<img class="avatar is-rounded" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
				</figure>
				<p class="nick">${user.nick}</p>
			</a>
		</div>`);

		this.$level.append($node);
	}
	RenderPrivilegesList() {
		System.data.locale.popup.extensionManagement.users.privilegeListOrder.forEach(key => {
			let privilege = System.data.locale.popup.extensionManagement.users.privilegeList[key];

			this.$privilegesContainer.append(`
			<div class="field" title="${privilege.description}">
				<input class="is-checkradio is-block is-info" id="p-${privilege.type}" type="checkbox">
				<label for="p-${key}">${privilege.title}</label>
			</div>`);
		});
	}
	BindEvents() {
		let that = this;

		this.$level.on("click", ".level-item > a", function(e) {
			e.preventDefault();

			let id = this.dataset["userId"];

			that.$idInput.val(id).trigger("input").focus();
		});
	}
}

export default Users
