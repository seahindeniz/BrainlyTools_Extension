import mime from "mime-types";
import Button from "../../../components/Button";
import DeleteSection from "../../../components/DeleteSection";
import Modal from "../../../components/Modal";
import notification from "../../../components/notification";
import Action from "../../../controllers/Req/Brainly/Action";
import secondsToTime from "../../../helpers/secondsToTime";
import QuickDeleteButtons from "./QuickDeleteButtons";

class ModeratingPanel {
  /**
   * @param {QuickDeleteButtons} main
   */
  constructor(main) {
    this.main = main;

    try {
      this.Init();
    } catch (error) {
      console.error(error);
    }
  }
  async Init() {
    this.ticket = await this.OpenTicket();

    this.RenderModal();
    this.RenderDeleteButton();
    this.RenderSpinner();
    this.StartCounter();
    this.RenderAttachments();
    this.RenderDeleteSection();
    this.CheckContentAndExpand();
    this.BindHandlers();
  }
  OpenTicket() {
    return new Promise(async (resolve, reject) => {
      let resTicket = await new Action().OpenModerationTicket(this.main.questionId);

      if (!resTicket) {
        notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
        reject("Server didn't respond");
      } else if (!resTicket.success) {
        resTicket.message && notification(resTicket.message, "error");
        reject(resTicket.message || "Server didn't accepted");
      } else {
        resolve(resTicket);
      }
    });
  }
  RenderModal() {
    let questionLink = System.createBrainlyLink("question", { id: this.ticket.data.task.id });
    let questionOwner = this.ticket.users_data.find(user => user.id == this.ticket.data.task.user.id);
    let ownerProfileLink = System.createBrainlyLink("profile", { nick: questionOwner.nick, id: questionOwner.id });

    let avatar = `<div class="sg-avatar__image sg-avatar__image--icon"><svg class="sg-icon sg-icon--gray sg-icon--x32"><use xlink:href="#icon-profile"></use></svg></div>`;
    if (questionOwner.avatar) {
      avatar = `<img class="sg-avatar__image" src="${System.prepareAvatar(questionOwner)}">`;
    }

    this.modal = new Modal({
      header: `
			<div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-text sg-text--peach">${System.data.locale.common.moderating.editInPanel}</div>
					</div>
				</div>
				<div class="sg-actions-list__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-label__icon">
							<svg class="sg-icon sg-icon--gray-secondary sg-icon--x14">
								<use xlink:href="#icon-counter"></use>
							</svg>
						</div>
						<div class="sg-text sg-text--xsmall sg-text--gray-secondary sg-text--emphasised js-counter">---</div>
					</div>
				</div>
			</div>`,

      content: `
			<div class="sg-content-box">
				<div class="question-header sg-content-box__title sg-content-box__title--spaced-bottom">
					<div class="sg-actions-list sg-actions-list--space-between sg-actions-list--no-wrap">
						<div class="sg-actions-list__hole">
							<div class="sg-actions-list">
								<div class="sg-actions-list__hole">
									<div class="js-asker-avatar question-header__avatar-wrapper sg-hide-for-small-only">
										<div class="user-fiche-wrapper">
											<div class="sg-avatar">
												<a href="${ownerProfileLink}" title="${questionOwner.nick}" target="_blank">${avatar}</a>
											</div>
										</div>
									</div>
								</div>
								<div class="sg-actions-list__hole">
									<ul class="sg-breadcrumb-list">
										<li class="sg-breadcrumb-list__element">
											<a href="${ownerProfileLink}" class="sg-text sg-text--small sg-text--link sg-text--bold sg-text--gray" title="${questionOwner.nick}" target="_blank">
												<span>${questionOwner.nick}</span>
											</a>
										</li>
										<li class="sg-breadcrumb-list__element">
											<span class="sg-text sg-text--small sg-text--gray sg-text--bold">${this.ticket.data.task.points.ptsForResp}+${this.ticket.data.task.points.ptsForBest} ${System.data.locale.common.moderating.point}</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="sg-actions-list__hole">
							<div class="sg-actions-list sg-actions-list--to-right sg-actions-list--no-wrap">
                <div class="sg-actions-list__hole">
                  <a class="sg-text sg-text--small sg-text--link sg-text--bold sg-text--gray" href="${questionLink}" target="_blank">${this.ticket.data.task.id}</a>
                </div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="sg-content-box js-question-wrapper">
				<div class="sg-content-box__content taskContent js-shrink">
					<h1 class="sg-text sg-text--regular sg-text--headline">${this.ticket.data.task.content}</h1>
					<span class="sg-text sg-text--small sg-text--link-underlined sg-text--bold sg-text--blue-dark">${System.data.locale.common.showMore}</span>
				</div>
			</div>
			<div class="sg-content-box sg-content-box--spaced-top-large sg-content-box--spaced-bottom sg-content-box--spaced-bottom-xxlarge">
				<div class="sg-actions-list attachments"></div>
			</div>`,

      actions: `<div class="sg-spinner-container"></div>`
    });

    this.$counter = $(".js-counter", this.modal.$modal);
    this.$deleteButtonSpinnerContainer = $('> .sg-spinner-container', this.modal.$actions);

    this.modal.Open();
  }
  RenderDeleteButton() {
    this.$deleteButton = Button({
      type: "solid-peach",
      text: System.data.locale.common.delete
    });

    this.$deleteButton.prependTo(this.$deleteButtonSpinnerContainer);
  }
  RenderSpinner() {
    this.$spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`);
  }
  StartCounter() {
    this.UpdateCounter();
    this._loop_counter = window.setInterval(this.UpdateCounter.bind(this), 1000);
  }
  StopCounter() {
    window.clearInterval(this._loop_counter);
  }
  UpdateCounter() {
    let time = secondsToTime(--this.ticket.data.ticket.time_left);

    if (time.m == 0 && time.s == 0) {
      this.ClosePanel();
    }

    this.$counter.html(`${(time.m+"").padStart(2, '0')}:${(time.s+"").padStart(2, '0')}`);
  }
  RenderAttachments() {
    let $attachments = $(".attachments", this.modal.$modal);

    if (this.ticket.data.task.attachments && this.ticket.data.task.attachments.length > 0) {
      this.ticket.data.task.attachments.forEach((attachment) => {
        let content = "";

        if (attachment.thumbnail) {
          content = `
					<div class="sg-box sg-box--image-wrapper">
						<a href="${attachment.full}" target="_blank">
							<img class="sg-box__image" src="${attachment.thumbnail}">
						</a>
					</div>`;
        } else {
          content = `
          <a class="sg-text sg-text--small sg-text--link sg-text--bold sg-text--gray" href="${attachment.full}" target="_blank">
            <div class="sg-box sg-box--dark sg-box--no-border sg-box--image-wrapper">
              <div class="sg-box__hole">${(mime.extension(attachment.type) || attachment.type).toLocaleUpperCase()}</div>
            </div>
          </a>`
        }

        $attachments.append(`
				<div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
					<div class="brn-attachments__attachment">${content}</div>
				</div>`);
      });
    }
  }
  RenderDeleteSection() {
    this.deleteSection = new DeleteSection({ type: "question", reasons: this.ticket.data.delete_reasons.task });
    let $toplayerContentBox = $(".sg-toplayer__wrapper > .sg-content-box > div:nth-child(2)", this.modal.$modal);

    this.deleteSection.$.appendTo($toplayerContentBox);
  }
  CheckContentAndExpand() {
    this.$taskContent = $(".taskContent", this.modal.$modal);
    this.$showMoreLink = $("> span", this.$taskContent);
    let questionFilteredContent = $("> h1", this.$taskContent).text();
    let matchNewLines = this.ticket.data.task.content.match(/<br\s*\/?>/gmi);

    if (
      !(
        (
          matchNewLines &&
          matchNewLines.length > 6
        ) ||
        questionFilteredContent.length > 255
      )
    ) {
      this.ExpandContentContainer();
    }
  }
  BindHandlers() {
    this.modal.$close.click(this.ClosePanel.bind(this));
    this.$showMoreLink.click(this.ExpandContentContainer.bind(this));
    this.$deleteButton.click(this.DeleteQuestion.bind(this));
  }
  async ClosePanel(ignoreTicket) {
    this.modal.ShowCloseSpinner();
    this.modal.$close.off("click");

    if (ignoreTicket !== true) {
      let closedTicket = await new Action().CloseModerationTicket(this.main.questionId);

      notification(closedTicket.message, closedTicket.success ? "info" : "error");
    }

    this.StopCounter();
    this.modal.Close();
    this.main.HideSpinner();
  }
  ExpandContentContainer() {
    this.$taskContent.removeClass("js-shrink")
  }
  async DeleteQuestion() {
    if (this.deleteSection.selectedReason) {
      let taskData = {
        model_id: this.ticket.data.task.id,
        reason: this.deleteSection.reasonText,
        reason_id: this.deleteSection.selectedReason.id,
        reason_title: this.deleteSection.selectedReason.title,
        give_warning: this.deleteSection.giveWarning,
        take_points: this.deleteSection.takePoints,
        return_points: this.deleteSection.returnPoints
      };

      this.ShowSpinner();

      let resRemove = await new Action().RemoveQuestion(taskData);

      if (!resRemove || !resRemove.success) {
        this.HideSpinner();
        this.modal.$overlay.scrollTop(0);

        return this.modal.notification(resRemove.message || System.data.locale.common.notificationMessages.somethingWentWrong, "error");
      }

      this.main.target.classList.add("deleted");
      this.ClosePanel(true);
    }
  }
  ShowSpinner() {
    this.$spinner.appendTo(this.$deleteButtonSpinnerContainer);
  }
  HideSpinner() {
    this.HideElement(this.$spinner);
  }
  /**
   * @param {JQuery<HTMLElement>} $element
   */
  HideElement($element) {
    $element.appendTo("<div/>");
  }
}

export default ModeratingPanel
