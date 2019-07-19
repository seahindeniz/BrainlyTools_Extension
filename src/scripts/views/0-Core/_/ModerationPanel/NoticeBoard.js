import emojione from "emojione";
import MarkdownIt from "markdown-it";
import MarkdownItContainer from "markdown-it-container";
import Modal from "../../../../components/Modal";
import notification from "../../../../components/notification";
import Action from "../../../../controllers/Req/Brainly/Action";
import ServerReq from "../../../../controllers/Req/Server";
import Button from "../../../../components/Button";

let System = require("../../../../helpers/System");

emojione.emojiSize = "64";

class NoticeBoard {
  constructor() {
    this.users = [];
    this.noticeContent = "";
    this.modalSize = "large";
    this.templateString = `# Nothing to see..\n\n### But you can add ;)`;

    if (typeof System == "function")
      System = System();

    this.Init();
  }
  Init() {
    this.RenderLi();
    this.RenderBadge();
    this.RenderModal();
    this.RenderSpinner();
    this.InitMarkdownRenderer();
    this.RenderUsersSection();
    this.BindHandlers();

    if (System.checkUserP(20)) {
      this.RenderEditButton();
      this.RenderSaveButton();
      this.RenderEditSection();
      this.BindModerateEvents();
    }
  }
  RenderLi() {
    this.$li = $(`
		<li class="sg-menu-list__element" style="display: table; width: 100%;">
			<div class="sg-spinner-container">
				<div class="sg-overlayed-box">
					<div class="sg-actions-list sg-bubble--full">
						<div class="sg-actions-list__hole sg-actions-list__hole--spaced-xsmall">
							<span class="sg-text sg-menu-list__link sg-text--link">${System.data.locale.core.noticeBoard.text}</span>
						</div>
					</div>
				</div>
			</div>
		</li>`);

    this.$overlayedBox = $(".sg-overlayed-box", this.$li);
  }
  RenderBadge() {
    this.$badge = $(`
		<div class="sg-overlayed-box__overlay">
			<div class="brn-progress-tracking__icon-dot"></div>
		</div>`);

    if (System.data.Brainly.userData.extension.noticeBoard === true) {
      this.ShowBadge();
    }
  }
  ShowBadge() {
    this.$badge.appendTo(this.$overlayedBox);
  }
  RenderModal() {
    this.modal = new Modal({
      header: `
			<div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-label">
						<div class="sg-text sg-text--peach">${System.data.locale.core.noticeBoard.text}</div>
					</div>
					<div class="sg-label">
						<div class="sg-text sg-text--xsmall sg-text--gray-secondary">${System.data.locale.core.noticeBoard.lastChanges}: <span></span></div>
					</div>
				</div>
			</div>`,
      content: `
			<div class="sg-actions-list sg-actions-list--no-wrap sg-actions-list--to-top noticeBoard">
				<div class="sg-actions-list__hole sg-actions-list__hole--equal-width">
					<div class="sg-content-box">
						<div class="sg-content-box__content md"></div>
					</div>
				</div>
			</div>`,
      size: this.modalSize
    });

    this.$md = $(".md", this.modal.$modal);
    this.$noticeBoard = $(".noticeBoard", this.modal.$modal);
    this.$close = $(".sg-toplayer__close", this.modal.$modal);
    this.$lastUpdate = $(".sg-text > span", this.modal.$modal);
    this.$headerActionList = $(".sg-content-box__header > .sg-actions-list", this.modal.$modal);
  }
  InitMarkdownRenderer() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    });

    this.md.use(require('markdown-it-sup'));
    this.md.use(require('markdown-it-sub'));
    this.md.use(require('markdown-it-abbr'));
    this.md.use(require("markdown-it-emoji"));
    this.md.use(require("markdown-it-anchor"));
    this.md.use(require('markdown-it-task-lists'));
    this.md.use(require("markdown-it-highlightjs"));
    //this.md.use(require("markdown-it-imsize"));
    //this.md.use(require("markdown-it-table-of-contents"));
    this.md.use(require("markdown-it-toc-done-right"), {
      itemClass: "sg-text sg-text--xsmall sg-text--gray",
      linkClass: "sg-text sg-text--link sg-text--blue-dark"
    })
    this.md.use(MarkdownItContainer, 'spoiler', {
      validate: params => params.trim().match(/^spoiler\s+(.*)$/),
      render: (tokens, idx) => {
        let m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

        if (tokens[idx].nesting === 1) {
          return '<details><summary>' + m[1] + '</summary>\n';

        } else {
          return '</details>\n';
        }
      }
    });
    this.md.use(MarkdownItContainer, 'moderator', {
      validate: params => params.trim().match(/^moderator$/),
      render: () => ""
    });
    this.md.use(MarkdownItContainer, 'normal', {
      validate: params => params.trim().match(/^normal$/),
      render: () => ""
    });

    this.md.renderer.rules.table_open = () => `<table class="table">`;
    this.md.renderer.rules.emoji = (token, idx) => emojione.toImage(token[idx].content);
    this.md.renderer.rules.link_open = () => `<a class="sg-text--link sg-text--bold sg-text--blue-dark">`;
    this.md.renderer.rules.hr = () => `<div class="sg-horizontal-separator sg-horizontal-separator--spaced sg-horizontal-separator--gray-light"></div>`;
  }
  RenderUsersSection() {
    this.$usersSection = $(`
		<div class="sg-horizontal-separator sg-horizontal-separator--spaced"></div>
		<div class="sg-content-box">
			<div class="sg-content-box__content">
				<h2 class="sg-headline sg-headline--lavender-dark sg-headline--xsmall">${System.data.locale.core.noticeBoard.readBy}:</h2>
			</div>
			<div class="sg-content-box__actions"></div>
		</div>`);

    this.$avatarContainer = $(".sg-content-box__actions", this.$usersSection);

    this.$usersSection.appendTo(this.modal.$actions);
  }
  async RenderUserAvatars() {
    let idList = this.readedBy.filter(id => !this.users[id]);

    if (idList.length > 0) {
      idList.forEach(id => this.RenderUserAvatar({ id }));

      let resUsers = await new Action().GetUsers(idList);

      if (resUsers && resUsers.success && resUsers.data.length > 0)
        resUsers.data.forEach(this.RenderUserAvatar.bind(this));
    }
  }
  RenderUserAvatar(user) {
    if (!user.avatar) {
      let $avatar = $(`
			<div class="sg-avatar sg-avatar--small sg-avatar--spaced">
				<div class="sg-avatar__image sg-avatar__image--icon">
					<div class="sg-icon sg-icon--gray-secondary sg-icon--x24">
						<svg class="sg-icon__svg">
							<use xlink:href="#icon-profile"></use>
						</svg>
					</div>
				</div>
			</div>`);
      this.users[user.id] = {
        element: $avatar
      }

      $avatar.appendTo(this.$avatarContainer);
    } else {
      if (this.users[user.id] && this.users[user.id].element) {
        let avatar = System.prepareAvatar(user);
        let $avatar = this.users[user.id].element;
        let $image = $("> .sg-avatar__image", $avatar);
        let profileLink = System.createProfileLink(user);

        $avatar.attr("title", user.nick);
        $image.removeClass("sg-avatar__image--icon");
        $image.html(`
			<a href="${profileLink}" target="_blank">
				<img class="sg-avatar__image" src="${avatar}">
			</a>`);
      }
    }
  }
  BindHandlers() {
    this.$close.click(this.CloseModal.bind(this));
    this.$li.on("click", "span", this.OpenModal.bind(this));
  }
  CloseModal() {
    if (this.$editSection && this.$editSection.is(":visible")) {
      return this.CloseEditSection();
    }

    if (this.IsEditorValSame()) {
      this.modal.Close();
      clearTimeout(this.readTimeout);
    }
  }
  IsEditorValSame() {
    return (
      !this.$editSectionContent ||
      (
        this.$editSectionContent.val() == this.$editSectionContent.prop("defaultValue") ||
        confirm(System.data.locale.core.notificationMessages.changesMayNotBeSaved)
      )
    )
  }
  async OpenModal() {
    this.ShowLiSpinner();

    let data = await this.GetContent();
    this.readedBy = data.readedBy;
    this.noticeContent = this.FilterContent(data.content);
    let markdowned_noticeContent = this.md.render(this.noticeContent || this.templateString);

    this.$md.html(markdowned_noticeContent);
    data.lastModified && this.ChangeLastUpdate(data.lastModified);
    this.modal.Open();
    this.HideElement(this.$spinner);
    this.RenderUserAvatars();

    if (System.data.Brainly.userData.extension.noticeBoard === true)
      this.readTimeout = setTimeout(this.ReadNoticeBoard.bind(this), 2500);
  }
  ShowLiSpinner() {
    this.$spinner.insertAfter(this.$overlayedBox);
  }
  async GetContent() {
    let resContent = await new ServerReq().GetNoticeBoardContent();

    if (resContent.success) {
      return Promise.resolve(resContent.data);
    } else {
      this.HideElement(this.$spinner);
      notification(System.data.locale.core.notificationMessages.couldntAbleToGetNoticeBoardContent, "error");

      return Promise.reject();
    }
  }
  FilterContent(content) {
    if (!System.checkUserP(20)) {
      if (System.checkBrainlyP(102))
        content = content.replace(/\:\:\: moderator.*?\:\:\:/gsi, "");
      else
        content = content.replace(/\:\:\: normal.*?\:\:\:/gsi, "");
    }

    return content;
  }
  ChangeLastUpdate(date) {
    date = date ? new Date(date) : new Date();

    date = date.toLocaleDateString(System.data.Brainly.defaultConfig.locale.LANGUAGE.replace("_", "-"), {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });

    this.$lastUpdate.text(date);
  }
  ReadNoticeBoard() {
    let data = System.data.Brainly.userData.extension;
    data.noticeBoard = false;

    new ServerReq().ReadNoticeBoard();
    System.SetUserData(data);
    this.HideElement(this.$badge);
  }
  RenderEditButton() {
    this.$buttonContainer = $(`
		<div class="sg-actions-list__hole">
			<div class="sg-spinner-container"></div>
		</div>`);
    this.$editButton = Button({
      text: System.data.locale.common.edit
    });

    this.$buttonContainer.appendTo(this.$headerActionList);
    this.$editButton.appendTo($(">div", this.$buttonContainer));
  }
  RenderSpinner() {
    this.$spinner = $(`
		<div class="sg-spinner-container__overlay">
			<div class="sg-spinner"></div>
		</div>`);
  }
  RenderSaveButton() {
    this.$saveButton = Button({
      type: "primary-mint",
      text: System.data.locale.common.save
    });
  }
  RenderEditSection() {
    this.$editSection = $(`
		<div class="sg-actions-list__hole sg-actions-list__hole--equal-width">
			<div class="sg-content-box sg-content-box--full">
				<div class="sg-content-box__content sg-content-box__content--spaced-bottom-large">
					<textarea class="sg-textarea sg-textarea--full-width" placeholder="${System.data.locale.common.writeSomething}.."></textarea>
				</div>
				<div class="sg-content-box__actions">
					<a href="https://www.markdowntutorial.com/" class="sg-text sg-text--link sg-text--bold sg-text--blue-dark">How to use Markdown?</a>
				</div>
				<div class="sg-content-box__content">
					<a href="https://www.markdownguide.org/cheat-sheet" class="sg-text sg-text--link sg-text--bold sg-text--blue-dark">Markdown Guide - Cheat Sheet</a>
				</div>
			</div>
		</div>`);

    this.$editSectionContent = $("textarea", this.$editSection);
  }
  BindModerateEvents() {
    this.$editButton.click(this.OpenEditSection.bind(this));
    this.$saveButton.click(this.SaveContent.bind(this));
    this.$editSectionContent.on("input", this.UpdateContent.bind(this));

    window.addEventListener("beforeunload", () => {
      if (!this.IsEditorValSame()) {
        event.returnValue = "";

        event.preventDefault();
      }
    });
  }
  OpenEditSection() {
    this.$editSectionContent.text(this.noticeContent);
    this.$editSection.prependTo(this.$noticeBoard);
    this.ShowSaveButton();
    this.ResizeEditSection();
    this.modal.ChangeSize("full");
    this.ChangeColorCloseButton("gray-secondary", "mint");
  }
  ChangeColorCloseButton(from, to) {
    let $svg = $("svg", this.$close);

    $svg.removeClass(`sg-icon--${from}`);
    $svg.addClass(`sg-icon--${to}`);

    if (to == "mint") {
      $svg.attr("style", "outline: 1px solid #60d399;outline-offset: 3px;");
    } else {
      $svg.removeAttr("style");
    }
  }
  CloseEditSection() {
    this.HideElement(this.$editSection);
    this.modal.ChangeSize(this.modalSize);
    this.ShowEditButton();
    this.ChangeColorCloseButton("mint", "gray-secondary");
  }
  ShowSaveButton() {
    this.$saveButton.insertBefore(this.$editButton);
    this.HideElement(this.$editButton);
  }
  ShowEditButton() {
    this.$editButton.insertBefore(this.$saveButton);
    this.HideElement(this.$saveButton);
  }
  HideElement($element) {
    $element.appendTo("<div />");
  }
  async ResizeEditSection() {
    await System.Delay(50);
    this.$editSectionContent.css("height", this.$editSectionContent.prop("scrollHeight"));
  }
  async SaveContent() {
    try {
      //this.ShowButtonSpinner();
      await System.Delay(50);

      if (confirm(System.data.locale.core.notificationMessages.doYouWantToContinue)) {
        let noticeContent = this.$editSectionContent.val();

        let resUpdate = await new ServerReq().UpdateNoticeBoard(noticeContent);

        if (!resUpdate || !resUpdate.success) {
          this.modal.notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
        } else {
          this.noticeContent = noticeContent;

          this.$editSectionContent.prop("defaultValue", noticeContent);
          this.ShowBadge();
          this.ChangeLastUpdate()
          this.CloseEditSection();
          System.data.Brainly.userData.extension.noticeBoard = true;
        }
      }

      this.HideElement(this.$spinner);
    } catch (error) {
      console.error();
    }
  }
  ShowButtonSpinner() {
    this.$spinner.insertAfter(this.$saveButton);
  }
  UpdateContent() {
    let result = this.md.render(this.$editSectionContent.val() || this.templateString);

    this.$md.html(result);
    this.ResizeEditSection();
  }
}

export default NoticeBoard
