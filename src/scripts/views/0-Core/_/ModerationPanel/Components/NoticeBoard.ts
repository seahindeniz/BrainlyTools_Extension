/* eslint-disable no-param-reassign */
import ServerReq from "@ServerReq";
import { OverlayedBox, SpinnerContainer, Text } from "@style-guide";
import emojione from "emojione";
import MarkdownIt from "markdown-it";
import MDAbbr from "markdown-it-abbr";
import MDAnchor from "markdown-it-anchor";
import MDContainer from "markdown-it-container";
import MDEmoji from "markdown-it-emoji";
import MDHighlight from "markdown-it-highlightjs";
import MDSub from "markdown-it-sub";
import MDSup from "markdown-it-sup";
import MDTaskList from "markdown-it-task-lists";
import MDTOC from "markdown-it-toc-done-right";
import Button from "@components/Button";
import Modal from "@components/Modal";
import notification from "@components/notification2";
import Action from "@BrainlyAction";
import Components from ".";

// TODO upgrade Emojione to https://github.com/joypixels/emoji-toolkit
// @ts-expect-error
emojione.emojiSize = "64";

function FilterContent(content) {
  if (!System.checkUserP(20)) {
    if (System.checkBrainlyP(102))
      content = content.replace(/::: moderator.*?:::/gis, "");
    else content = content.replace(/::: normal.*?:::/gis, "");
  }

  return content;
}

class NoticeBoard extends Components {
  users: {
    element: JQuery<HTMLElement>;
  }[];

  noticeContent: string;
  modalSize: string;
  templateString: string;

  overlayedBox: HTMLDivElement;
  overlayedBoxOverlay: HTMLDivElement;

  $badge: JQuery<HTMLElement>;
  $md: JQuery<HTMLElement>;
  $noticeBoard: JQuery<HTMLElement>;
  $close: JQuery<HTMLElement>;
  $lastUpdate: JQuery<HTMLElement>;
  $headerActionList: JQuery<HTMLElement>;
  $usersSection: JQuery<HTMLElement>;
  $avatarContainer: JQuery<HTMLElement>;
  $editSection: JQuery<HTMLElement>;
  $editSectionContent: JQuery<HTMLElement>;
  $spinner: JQuery<HTMLElement>;
  $buttonContainer: JQuery<HTMLElement>;
  $editButton: JQuery<HTMLElement>;
  $saveButton: JQuery<HTMLElement>;

  modal: Modal;
  md: MarkdownIt;

  readedBy: number[];

  readTimeout: number;

  constructor(main) {
    super(main);

    this.users = [];
    this.noticeContent = "";
    /**
     * @type {"large"}
     */
    this.modalSize = "large";
    this.templateString = `# Nothing to see..\n\n### But you can add ;)`;
    this.liLinkContent = Text({
      tag: "span",
      className: "sg-text--link sg-menu-list__link",
      html: System.data.locale.core.noticeBoard.text,
    });

    this.RenderListItem();
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
      this.BindModerateHandlers();
    }
  }

  RenderLiContent() {
    this.overlayedBox = OverlayedBox({
      children: this.liLink,
    });
    this.overlayedBoxOverlay = this.overlayedBox.querySelector("div");

    this.liContent = SpinnerContainer({
      children: this.overlayedBox,
    });
  }

  RenderBadge() {
    this.$badge = $(`<div class="brn-progress-tracking__icon-dot"></div>`);

    if (System.data.Brainly.userData.extension.noticeBoard === true)
      this.ShowBadge();
  }

  ShowBadge() {
    this.$badge.appendTo(this.overlayedBoxOverlay);
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
      size: this.modalSize,
    });

    this.$md = $(".md", this.modal.$modal);
    this.$noticeBoard = $(".noticeBoard", this.modal.$modal);
    this.$close = $(".sg-toplayer__close", this.modal.$modal);
    this.$lastUpdate = $(".sg-text > span", this.modal.$modal);
    this.$headerActionList = $(
      ".sg-content-box__header > .sg-actions-list",
      this.modal.$modal,
    );
  }

  InitMarkdownRenderer() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });

    // Test this
    this.md.use(MDSup);
    this.md.use(MDSub);
    this.md.use(MDAbbr);
    this.md.use(MDEmoji);
    this.md.use(MDAnchor);
    this.md.use(MDTaskList);
    this.md.use(MDHighlight);
    // this.md.use(require("markdown-it-imsize"));
    // this.md.use(require("markdown-it-table-of-contents"));
    this.md.use(MDTOC, {
      itemClass: "sg-text sg-text--xsmall sg-text--gray",
      linkClass: "sg-text sg-text--link sg-text--blue-dark",
    });
    this.md.use(MDContainer, "spoiler", {
      validate: params => params.trim().match(/^spoiler\s+(.*)$/),
      render: (tokens, idx) => {
        const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

        if (tokens[idx].nesting === 1) {
          return `<details><summary>${m[1]}</summary>\n`;
        }
        return "</details>\n";
      },
    });
    this.md.use(MDContainer, "moderator", {
      validate: params => params.trim().match(/^moderator$/),
      render: () => "",
    });
    this.md.use(MDContainer, "normal", {
      validate: params => params.trim().match(/^normal$/),
      render: () => "",
    });

    this.md.renderer.rules.table_open = () => `<table class="table">`;
    this.md.renderer.rules.emoji = (token, idx) =>
      emojione.toImage(token[idx].content);
    this.md.renderer.rules.link_open = () =>
      `<a class="sg-text--link sg-text--bold sg-text--blue-dark">`;
    this.md.renderer.rules.hr = () =>
      `<div class="sg-horizontal-separator sg-horizontal-separator--spaced sg-horizontal-separator--gray-light"></div>`;
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
    const idList = this.readedBy.filter(id => !this.users[id]);

    if (idList.length > 0) {
      idList.forEach(id => this.RenderUserAvatar({ id }));

      const resUsers = await new Action().GetUsers(idList);

      if (resUsers && resUsers.success && resUsers.data.length > 0)
        resUsers.data.forEach(this.RenderUserAvatar.bind(this));
    }
  }

  RenderUserAvatar(user) {
    if (!user.avatar) {
      const $avatar = $(`
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
        element: $avatar,
      };

      $avatar.appendTo(this.$avatarContainer);
    } else if (this.users[user.id] && this.users[user.id].element) {
      const avatar = System.prepareAvatar(user);
      const $avatar = this.users[user.id].element;
      const $image = $("> .sg-avatar__image", $avatar);
      const profileLink = System.createProfileLink(user);

      $avatar.attr("title", user.nick);
      $image.removeClass("sg-avatar__image--icon");
      $image.html(`
			<a href="${profileLink}" target="_blank">
				<img class="sg-avatar__image" src="${avatar}">
			</a>`);
    }
  }

  BindHandlers() {
    this.$close.on("click", this.CloseModal.bind(this));
    this.li.addEventListener("click", this.OpenModal.bind(this));
  }

  CloseModal() {
    if (this.$editSection && this.$editSection.is(":visible")) {
      this.CloseEditSection();

      return;
    }

    if (this.IsEditorValSame()) {
      this.modal.Close();
      clearTimeout(this.readTimeout);
    }
  }

  IsEditorValSame() {
    return (
      !this.$editSectionContent ||
      this.$editSectionContent.val() ===
        this.$editSectionContent.prop("defaultValue") ||
      confirm(System.data.locale.core.notificationMessages.changesMayNotBeSaved)
    );
  }

  async OpenModal() {
    this.ShowLiSpinner();

    const data = await this.GetContent();
    this.readedBy = data.readedBy;
    this.noticeContent = FilterContent(data.content);
    const noticeContentInMDFormat = this.md.render(
      this.noticeContent || this.templateString,
    );

    this.$md.html(noticeContentInMDFormat);

    if (data.lastModified) this.ChangeLastUpdate(data.lastModified);

    this.modal.Open();
    this.HideElement(this.$spinner);
    this.RenderUserAvatars();

    if (System.data.Brainly.userData.extension.noticeBoard === true)
      this.readTimeout = window.setTimeout(
        this.ReadNoticeBoard.bind(this),
        2500,
      );
  }

  ShowLiSpinner() {
    this.$spinner.insertAfter(this.overlayedBox);
  }

  async GetContent() {
    const resContent = await new ServerReq().GetNoticeBoardContent();

    if (resContent.success) {
      return Promise.resolve(resContent.data);
    }
    this.HideElement(this.$spinner);
    notification({
      html:
        System.data.locale.core.notificationMessages
          .couldntAbleToGetNoticeBoardContent,
      type: "error",
    });

    return Promise.reject();
  }

  ChangeLastUpdate(lastModified?: string) {
    const date = lastModified ? new Date(lastModified) : new Date();

    const dateString = date.toLocaleDateString(
      System.data.Brainly.defaultConfig.locale.COUNTRY.replace("_", "-"),
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      },
    );

    this.$lastUpdate.text(dateString);
  }

  ReadNoticeBoard() {
    const data = System.data.Brainly.userData.extension;
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
      text: System.data.locale.common.edit,
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
      type: "solid-mint",
      text: System.data.locale.common.save,
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

  BindModerateHandlers() {
    this.$editButton.on("click", this.OpenEditSection.bind(this));
    this.$saveButton.on("click", this.SaveContent.bind(this));
    this.$editSectionContent.on("input", this.UpdateContent.bind(this));

    window.addEventListener("beforeunload", event => {
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
    const $svg = $("svg", this.$close);

    $svg.removeClass(`sg-icon--${from}`);
    $svg.addClass(`sg-icon--${to}`);

    if (to === "mint") {
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

  async ResizeEditSection() {
    await System.Delay(50);
    this.$editSectionContent.css(
      "height",
      this.$editSectionContent.prop("scrollHeight"),
    );
  }

  async SaveContent() {
    try {
      // this.ShowButtonSpinner();
      await System.Delay(50);

      if (
        confirm(
          System.data.locale.core.notificationMessages.doYouWantToContinue,
        )
      ) {
        const noticeContent = this.$editSectionContent.val() as string;

        const resUpdate = await new ServerReq().UpdateNoticeBoard(
          noticeContent,
        );

        if (!resUpdate || !resUpdate.success) {
          this.modal.notification(
            System.data.locale.common.notificationMessages.somethingWentWrong,
            "error",
          );
        } else {
          this.noticeContent = noticeContent;

          this.$editSectionContent.prop("defaultValue", noticeContent);
          this.ShowBadge();
          this.ChangeLastUpdate();
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
    const result = this.md.render(
      String(this.$editSectionContent.val()) || this.templateString,
    );

    this.$md.html(result);
    this.ResizeEditSection();
  }
}

export default NoticeBoard;
