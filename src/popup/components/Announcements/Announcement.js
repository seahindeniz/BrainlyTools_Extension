import { UpdateAnnouncement, RemoveAnnouncement } from "../../../scripts/controllers/ActionsOfServer";
import notification from "../notification";
import TextEditor from "../TextEditor";

class Announcement {
	constructor(data) {
		this.data = data;
		this.editors = {
			title: null,
			content: null
		};

		window.popup.ReserveAUser(data.user.brainlyID);

		this.Render();
		this.BindEvents();

		return this.$node;
	}
	Render() {
		let timeLong = window.moment(this.data.time).fromNow();
		let timeShort = window.moment(this.data.time).fromNow(true);
		let profileLink = System.createProfileLink(this.data.user.nick, this.data.user.brainlyID);

		this.$node = $(`
		<article class="media">
			<figure class="media-left">
				<p class="image is-32x32">
					<a href="#" data-user-id="${this.data.user.brainlyID}" target="_blank">
						<img class="avatar is-rounded" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
					</a>
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<span class="announcementTitle">${this.data.title}</span></span>
					<a href="${profileLink}" target="_blank"><small>@${this.data.user.nick}</small></a>
					<small title="${timeLong}" data-time="${this.data.time}">${timeShort}</small>
					<i class="fas fa-eye${this.data.published?"":"-slash"}" title="${System.data.locale.popup.notificationMessages[this.data.published ? "published" : "unpublished"]}"></i>
					<br>
					<div class="announcementContent">${this.data.content}</div>
				</div>
				<nav class="level">
					<div class="level-left readers"></div>
				</nav>
			</div>
			<div class="media-right">
				<a href="#" class="icon has-text-danger remove" title="${System.data.locale.common.delete}">
					<i class="fas fa-lg fa-times"></i>
				</a><br>
				<a href="#" class="icon has-text-info edit" title="${System.data.locale.common.edit}">
					<i class="fas fa-pencil-alt"></i>
				</a><br>
				<a href="#" class="icon has-text-success publish" title="${System.data.locale.popup.extensionManagement.announcements[this.data.published ? "unpublish" : "publish"]}">
					<i class="fas fa-eye${this.data.published?"-slash":""}"></i>
				</a>
			</div>
		</article>`);

		this.$editButton = $("a.edit", this.$node);
		this.$removeButton = $("a.remove", this.$node);
		this.$publishButton = $("a.publish", this.$node);
		this.$announcementTitle = $("span.announcementTitle", this.$node);
		this.$announcementContent = $("div.announcementContent", this.$node);

		this.RenderUsersWhoReadsThisAnnouncement();

		return this.$node;
	}
	RenderUsersWhoReadsThisAnnouncement() {
		let $container = $(".readers", this.$node);
		let readed_by = this.data.readed_by;

		if (readed_by instanceof Array && readed_by.length > 0) {
			readed_by.forEach(reading => {
				let user = this.data.readers.find(user => user._id == reading.user_id);
				let time = window.moment(reading.time).format('LLLL');
				let readedOn = System.data.locale.popup.extensionManagement.announcements.readedOn.replace(" %{date} ", time);

				window.popup.ReserveAUser(user.brainlyID);

				$container.append(`
				<a class="level-item is-inline-block" data-user-id="${user.brainlyID}" title="${user.nick}\n${readedOn}" target="_blank">
					<figure class="image is-24x24">
						<img class="avatar is-rounded" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
					</figure>
				</a>`);
			});
		}
	}
	BindEvents() {

		this.$editButton.click(this.Edit.bind(this));
		this.$removeButton.click(this.Remove.bind(this));
		this.$publishButton.click(this.Publish.bind(this));
	}
	Edit(event) {
		if (event) {
			event.preventDefault();
		}

		let $editorContent = $(".media-content.editor", this.$node);

		this.$node.toggleClass("is-editing");

		if ($editorContent.length == 0) {
			this.CreateEditor();
		}
	}
	CreateEditor() {
		let $announcementContainer = $(".media-content", this.$node);
		let $inputArea = $(`
		<div class="media-content editor">
			<div class="content">
				<input class="input announcementTitle" type="text">
				<br>
				<textarea class="announcementContent" name="editor"></textarea>
			</div>
		</div>

		<div class="media-right editing">
			<a href="#" class="icon has-text-danger close" title="${System.data.locale.popup.extensionManagement.announcements.cancelEdit}">
				<i class="fas fa-lg fa-times-circle"></i>
			</a><br>
			<a href="#" class="icon has-text-success update" title="${System.data.locale.popup.extensionManagement.announcements.update}">
				<i class="fas fa-check"></i>
			</a>
		</div>`).insertAfter($announcementContainer);

		let $closeButton = $("a.close", $inputArea);
		let $updateButton = $("a.update", $inputArea);
		let $titleInput = $("input.announcementTitle", $inputArea);
		let $contentInput = $("textarea.announcementContent", $inputArea);

		$closeButton.click(this.Edit.bind(this));
		$updateButton.click(this.Update.bind(this));

		this.editors.title = new TextEditor($titleInput, this.data.title);
		this.editors.content = new TextEditor($contentInput, this.data.content);
	}
	async Remove(event) {
		event.preventDefault();

		if (confirm(System.data.locale.common.notificationMessages.areYouSure)) {
			let resRemoved = await RemoveAnnouncement(this.data._id);

			if (!resRemoved) {
				notification(System.data.locale.common.notificationMessages.operationError, "danger");
			} else {
				if (!resRemoved.success) {
					notification((resRemoved.message || System.data.locale.common.notificationMessages.operationError), "danger");
				} else {
					notification(System.data.locale.popup.notificationMessages.removedMessage);
					this.$node.slideUp("normal", () => this.$node.remove());
				}
			}
		}
	}
	async Publish(event) {
		event.preventDefault();

		let status = this.data.published;
		let resUpdated = await UpdateAnnouncement({ id: this.data._id, publish: !status });

		if (!resUpdated) {
			notification(System.data.locale.common.notificationMessages.operationError, "danger");
		} else {
			if (!resUpdated.success) {
				notification((resUpdated.message || System.data.locale.common.notificationMessages.operationError), "danger");
			} else {
				this.data.published = !status;

				notification(System.data.locale.popup.notificationMessages.updatedMessage);
				this.$publishButton.attr({
					title: System.data.locale.popup.extensionManagement.announcements[!status ? "unpublish" : "publish"]
				});
				$("[data-fa-i2svg]", this.$publishButton).toggleClass('fa-eye').toggleClass('fa-eye-slash');
				$(".media-content > .content > [data-fa-i2svg]", this.$node).toggleClass('fa-eye').toggleClass('fa-eye-slash');
			}
		}
	}
	async Update(event) {
		event.preventDefault();

		let titleValue = this.editors.title.editor.getEditorValue();
		let contentValue = this.editors.content.editor.getEditorValue();

		if (!titleValue || titleValue == "") {
			notification("You must add an announcement title", "danger");
		} else if (!contentValue || contentValue == "") {
			notification("You must add an announcement text", "danger");
		} else {
			let data = {
				id: this.data._id,
				title: titleValue,
				content: contentValue
			};
			//data.id = that.parents("article.media").attr("id");
			let resUpdated = await UpdateAnnouncement(data);

			if (!resUpdated || !resUpdated.success) {
				notification((resUpdated.message || System.data.locale.common.notificationMessages.operationError), "danger");
			} else {
				this.data.title = titleValue;
				this.data.content = contentValue;

				this.Edit();
				this.$announcementTitle.html(titleValue);
				this.$announcementContent.html(contentValue);
				notification(System.data.locale.popup.notificationMessages.updatedMessage);
			}
		}
	}
}

export default Announcement;
