import template from "backtick-template";
import templateContentViewer from "./templates/ContentViewer.html";

export default class ContentViewer_Content {
	constructor(source, user) {
		this.source = source;
		this.contentData = {
			content: source.content,
			user,
			userProfileLink: System.createProfileLink(user.nick, user.id),
			avatar: System.prepareAvatar(user.avatars, { returnIcon: true })
		}

		this.CheckLatex();
		this.RenderContent();
	}
	CheckLatex() {
		if (this.contentData.content) {
			this.contentData.content = this.contentData.content.replace(/\[tex\](.*?)\[\/tex\]/gi, (_, latex) => {
				return `<img src="${System.data.Brainly.defaultConfig.config.data.config.serviceLatexUrlHttps}%5C${window.encodeURIComponent(latex)}" title="${latex}" align="absmiddle" class="latex-formula sg-box__image">`
			});
		}
	}
	RenderContent() {
		this.$ = $(template(templateContentViewer, this.contentData));
		this.$box = $("> .sg-box", this.$);
		this.$attachmentsIconContainer = $(".sg-actions-list__hole:eq(0) .sg-content-box__content", this.$);

		this.RenderBestIcon();
		this.RenderApproveIcon();
		this.RenderQuestionPoints();

		if (this.source.user_id == window.sitePassedParams[0]) {
			this.$box.addClass("sg-box--gray-secondary-lightest");
		}

		if (this.source.attachments && this.source.attachments.length > 0) {
			this.RenderAttachmentsIcon();
			this.RenderAttachments();
		}
	}
	RenderBestIcon() {
		if (this.source.best) {
			this.RenderIcon("mustard", "excellent");
		}
	}
	RenderApproveIcon() {
		if (this.source.approved && this.source.approved.date) {
			this.$approveIcon = this.RenderIcon("mint", "verified");
		}
	}
	HideApproveIcon() {
		if (this.$approveIcon) {
			this.$approveIcon.appendTo("<div />");
		}
	}
	RenderIcon(color, name) {
		let $icon = $(`
		<div class="sg-content-box__content sg-content-box__content--spaced-bottom sg-content-box__content--with-centered-text">
			<svg class="sg-icon sg-icon--x32 sg-icon--${color}">
				<use xlink:href="#icon-${name}"></use>
			</svg>
		</div>`);

		$icon.insertBefore(this.$attachmentsIconContainer);

		return $icon;
	}
	RenderQuestionPoints() {
		let points = this.source.points;

		if (points && typeof points == "object") {
			let $breadcrumb = $(".sg-breadcrumb-list", this.$);

			let $element = $(`
			<li class="sg-breadcrumb-list__element">
				<span class="sg-text sg-text--bold sg-text--small sg-text--gray" title="16 pts+8 pontos pela melhor resposta">${points.ptsForResp}+${points.ptsForBest} ${System.data.locale.common.shortPoints.toLowerCase()}</span>
			</li>`);

			$element.appendTo($breadcrumb);
		}
	}
	RenderAttachmentsIcon() {
		this.$attachmentIcon = $(`
		<span class="sg-text sg-text--link-unstyled sg-text--bold">
			<div class="sg-box sg-box--dark sg-box--no-border sg-box--xxsmall-padding sg-box--no-min-height">
				<div class="sg-box__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-label__icon">
							<div class="sg-icon sg-icon--dark sg-icon--x14">
								<svg class="sg-icon__svg">
									<use xlink:href="#icon-attachment"></use>
								</svg>
							</div>
						</div>
						<div class="sg-label__number">${this.source.attachments.length}</div>
					</div>
				</div>
			</div>
		</span>`);

		this.$attachmentIcon.appendTo(this.$attachmentsIconContainer);
		this.$attachmentIcon.click(this.ToggleAttachments.bind(this));
	}
	RenderAttachments() {
		this.$attachmentsContainer = $(`<div class="sg-content-box__actions sg-content-box__actions--spaced-top-xxlarge"><div class="sg-actions-list"></div></div>`);

		this.$attachments = $("> div", this.$attachmentsContainer);

		this.source.attachments.forEach(attachment => {
			let $hole = $(`
			<div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
				<a href="${attachment.full}" target="_blank" class="sg-link">
					<div class="sg-box sg-box--dark sg-box--image-wrapper"></div>
				</a>
			</div>`);
			let $box = $(".sg-box", $hole);

			if (attachment.thumbnail) {
				$(`<img class="sg-box__image" src="${attachment.thumbnail}">`).appendTo($box);
			} else {
				$(`
				<div class="sg-box__hole">
					<span class="sg-text sg-text--bold sg-text--bold sg-text--gray">${attachment.type}</span>
				</div>`).appendTo($box);
			}

			$hole.appendTo(this.$attachments)
		});

	}
	ToggleAttachments() {
		let target = $(".sg-actions-list__hole:eq(1) > .sg-content-box", this.$);

		if (this.$attachmentsContainer.is(":visible")) {
			target = "<div />";
		}

		this.$attachmentsContainer.appendTo(target);
	}
}
