import ServerReq from "../../../scripts/controllers/Req/Server";
import ext from "../../../scripts/utils/ext";
import notification from "../notification";
import TextEditor from "../TextEditor";
import Announcement from "./Announcement";

class Announcements {
  constructor() {
    this.editors = {
      title: null,
      content: null
    };

    this.RenderUI();
    this.RenderTextEditorForAddNewAnnouncement();
    this.PrepareAnnouncements();
    this.BindHandlers();
  }
  RenderUI() {
    let avatar = System.prepareAvatar(System.data.Brainly.userData.user);
    this.$layout = $(`
		<div id="announcements" class="column is-narrow">
			<article class="message is-info">
				<div class="message-header">
					<p>${System.data.locale.popup.extensionManagement.announcements.text}</p>
				</div>
				<div class="message-body">
					<article class="media addNew">
						<div class="media-content field-label has-text-centered">
							<label class="label">${System.data.locale.popup.extensionManagement.announcements.addNewAnnouncement}</label>
						</div>
					</article>
					<article class="media addNew announcement">
						<figure class="media-left">
							<p class="image is-32x32">
								<img src="${avatar}">
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
					</article>
				</div>
			</article>
		</div>`);

    this.$announcementsBody = $(".message-body", this.$layout);
    this.$resetButton = $(".media-right > a.reset", this.$layout);
    this.$submitButton = $(".media-right > a.submit", this.$layout);
    this.$actionsContainer = $(".addNew .media-right.is-invisible", this.$announcementsBody);
    this.$addNewTitle = $(".addNew:not(.announcement) > .media-content>label.label", this.$layout);
  }
  RenderTextEditorForAddNewAnnouncement() {
    let $announcementTitle = $(".addNew input.announcementTitle", this.$announcementsBody);
    let $announcementContent = $(".addNew textarea.announcementContent", this.$announcementsBody);

    this.editors.title = new TextEditor($announcementTitle);
    this.editors.content = new TextEditor($announcementContent);
  }
  async PrepareAnnouncements() {
    if ($("html").attr("is") != "popup") {
      let resAnnouncements = await new ServerReq().GetAnnouncements();

      if (resAnnouncements.success && resAnnouncements.data) {
        this.RenderAnnouncementNodes(resAnnouncements.data);
        window.popup.refreshUsersInformation();
      }
    }
  }
  RenderAnnouncementNodes(announcementsData) {
    if (typeof announcementsData === 'object') {
      if (announcementsData instanceof Array) {
        if (announcementsData.length > 0) {
          announcementsData.forEach(this.RenderAnnouncementNode.bind(this));
        }
      } else {
        this.RenderAnnouncementNode(announcementsData)
      }
    }
  }
  RenderAnnouncementNode(data) {
    let $announcemenet = new Announcement(data);

    this.$announcementsBody.prepend($announcemenet);
  }
  BindHandlers() {
    if ($("html").attr("is") == "popup") {
      this.$layout.click(() => {
        ext.runtime.openOptionsPage();
      });
    } else {
      this.editors.title.onChange = this.EditorOnChange.bind(this);
      this.editors.content.onChange = this.EditorOnChange.bind(this);

      this.$resetButton.click(event => {
        event.preventDefault();
        this.ClearEditors();
      });
      this.$submitButton.click(event => {
        event.preventDefault();
        let title = this.editors.title.editor.getEditorValue();
        let content = this.editors.content.editor.getEditorValue();

        this.CreateAnnouncement(title, content);
      });
    }
  }
  EditorOnChange(value) {
    if (value != "") {
      this.$actionsContainer.removeClass("is-invisible");
    } else {
      this.$actionsContainer.addClass("is-invisible");
    }
  }
  ClearEditors() {
    this.editors.title.editor.setElementValue("");
    this.editors.content.editor.setElementValue("");
  }
  async CreateAnnouncement(title, content) {

    if (!title || title == "") {
      notification("You must add a title", "danger");
    } else if (!content || content == "") {
      notification("You must add a message", "danger");
    } else {
      let data = { title, content };
      let resCreated = await new ServerReq().CreateAnnouncement(data);

      if (!resCreated || !resCreated.success) {
        notification((resCreated.message || System.data.locale.common.notificationMessages.operationError), "danger");
      } else {
        let $announcement = new Announcement(resCreated.data);

        this.$announcementsBody.prepend($announcement);
        window.popup.refreshUsersInformation();
        notification(System.data.locale.popup.notificationMessages.createdMessage);

        $('html, body').animate({
          scrollTop: $announcement.offset().top
        }, 1000);

        this.ClearEditors();
      }
    }
  }
}

export default Announcements
