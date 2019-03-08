import moment from "moment-timezone";
import notification from "../../../components/notification";
import Content from "./Content";
import ContentViewer_Content from "./ContentViewer_Content";
import SelectCheckbox from "./SelectCheckbox";
import UserContent from "./UserContent";
import { GetQuestionContent } from "../../../controllers/ActionsOfBrainly";

export default class UserContentRow {
	/**
	 * @param {UserContent} main
	 * @param {number} id
	 * @param {HTMLTableRowElement} element
	 */
	constructor(main, id, element) {
		this.main = main;
		this.id = id;
		this.element = element;
		this.isBusy = false;
		this.deleted = false;
		this.contents = {
			question: null,
			answers: {}
		}

		$(element).prop("that", this);

		this.AttachID();
		this.RenderCheckbox();
		this.FetchContentWithPromise();
		this.RenderAfterResolve();
		this.RenderContentViewer();
		this.BindEvents();
	}
	AttachID() {
		this.$questionLink = $("a[href]", this.element);
		let URL = this.$questionLink.attr("href");
		this.element.questionID = System.ExtractId(URL);
	}
	RenderCheckbox() {
		this.checkbox = new SelectCheckbox(this.element, this.id);

		this.isBusy = true;
		this.checkbox.ShowSpinner();
		//this.main.checkboxes.elements.push(checkbox);
	}
	async FetchContentWithPromise(refreshContent) {
		if (refreshContent || !this.resPromise) {
			/* this.content = this.main.questions[this.element.questionID] = new Content(this.element.questionID);
			this.content.resPromise = this.content.Fetch(); */
			if (!this.main.questions[this.element.questionID] || !this.main.questions[this.element.questionID].resPromise) {
				if (!this.main.questions[this.element.questionID])
					this.main.questions[this.element.questionID] = {};

				this.main.questions[this.element.questionID].resPromise = this.resPromise = GetQuestionContent(this.element.questionID);
			} else {
				this.resPromise = this.main.questions[this.element.questionID].resPromise;
			}

			//return this.CheckContentPromise();
		}
	}
	async RenderAfterResolve() {
		await this.SetContentAfterResolve();

		this.RenderQuestionContent();
		this.RenderAnswers();

		if (this.main.caller == "Questions" || this.main.caller == "Answers") {
			this.isBusy = false;
			this.checkbox.HideSpinner();
		}
	}
	async SetContentAfterResolve() {
		this.res = await this.resPromise;

		return Promise.resolve();
	}
	RenderContentViewer() {
		this.$viewer = $(`
		<div class="sg-content-box sg-content-box--spaced-top sg-content-box--spaced-bottom-large">
			<div class="sg-box sg-box--no-border" style="width: 52em"></div>
		</div>`);
		this.$contentContainer = $(".sg-box", this.$viewer);
	}
	RenderQuestionContent() {
		let user = this.res.users_data.find(user => user.id == this.res.data.task.user_id);
		let content = new ContentViewer_Content(this.res.data.task, user);
		this.contents.question = content;

		content.$.appendTo(this.$contentContainer);
		this.RenderAttachmentsIcon(content.source);

		/* let question = this.content.res.data.task;
		let user = this.content.res.users_data.find(user => user.id == question.user_id);
		let contentData = {
			content: question.content,
			user,
			userProfileLink: System.createProfileLink(user.nick, user.id),
			avatar: System.prepareAvatar(user.avatars, { returnIcon: true })
		}

		this.contentViewer_Contents.question = new ContentViewer_Content(contentData, question);

		this.contentViewer_Contents.question.$.appendTo(this.$contentContainer);

		this.RenderAttachmentsIcon(question); */
	}
	RenderAnswers() {
		if (this.res.data.responses && this.res.data.responses.length > 0) {
			this.res.data.responses.forEach(this.RenderAnswer.bind(this));
		}
	}
	RenderAnswer(answer) {
		let user = this.res.users_data.find(user => user.id == answer.user_id);
		let content = new ContentViewer_Content(answer, user);
		this.contents.answers[answer.id] = content;

		this.RenderAnswerSeperator();
		content.$.appendTo(this.$contentContainer);

		if (answer.user_id == window.sitePassedParams[0] && this.main.caller == "Answers") {
			this.AttachAnswerID(answer);
			this.RenderBestIcon(answer);
			this.RenderApproveIcon(answer);
		}

		/* let user = this.content.res.users_data.find(user => user.id == answer.user_id);
		let contentData = {
			content: answer.content,
			user,
			userProfileLink: System.createProfileLink(user.nick, user.id),
			avatar: System.prepareAvatar(user.avatars, { returnIcon: true })
		}
		let content = new ContentViewer_Content(contentData, answer);

		this.RenderAnswerSeperator();
		content.$.appendTo(this.$contentContainer);
		this.contentViewer_Contents.answers[answer.id] = content;

		if (answer.user_id == window.sitePassedParams[0] && this.main.caller == "Answers") {
			this.AttachAnswer(answer);
			console.log(this);

			this.RenderBestIcon(answer);
			this.RenderApproveIcon(answer);
		} */
	}
	RenderAnswerSeperator() {
		let $seperator = $(`<div class="sg-horizontal-separator sg-horizontal-separator--spaced"></div>`);

		$seperator.appendTo(this.$contentContainer);
	}
	AttachAnswerID(answer) {
		let $dateCell = $("td:last", this.element);
		let date = $dateCell.text().trim();

		if (date) {
			let date2 = moment(answer.created);
			date2 = date2.tz(System.data.Brainly.defaultConfig.locale.TIMEZONE);

			if (date == date2.format("YYYY-MM-DD HH:mm:ss")) {
				this.answerID = answer.id;
			}
		}
	}
	RenderBestIcon(answer) {
		if (answer.best) {
			this.RenderIcon("mustard", "excellent");
		}
	}
	RenderApproveIcon(answer) {
		if ((this.approved || (answer.approved && answer.approved.date)) && !this.$approveIcon) {
			this.$approveIcon = this.RenderIcon("mint", "verified");
		}
	}
	HideApproveIcon() {
		if (this.$approveIcon) {
			this.$approveIcon.appendTo("<div />");
		}
	}
	RenderAttachmentsIcon(content) {
		if (content.attachments && content.attachments.length > 0) {
			this.RenderIcon("dark", "attachment");
		}
	}
	RenderIcon(color, name) {
		let $icon = $(`
		<button role="button" class="sg-icon-as-button sg-icon-as-button--${color} sg-icon-as-button--xxsmall sg-icon-as-button--action sg-icon-as-button--action-active sg-link--disabled sg-list__icon--spacing-right-small">
			<div class="sg-icon-as-button__hole">
				<div class="sg-icon sg-icon--adaptive sg-icon--x10">
					<svg class="sg-icon__svg">
						<use xlink:href="#icon-${name}"></use>
					</svg>
				</div>
			</div>
		</button>`);

		$icon.insertBefore(this.$questionLink);

		return $icon;
	}
	BindEvents() {
		this.$questionLink.click(this.ToggleContentViewer.bind(this));
		this.checkbox.onchange = this.main.HideSelectContentWarning.bind(this.main);
	}
	/**
	 * @param {Event} event
	 */
	async ToggleContentViewer(event) {
		event && event.preventDefault();

		if (this.$contentContainer.children().length == 0) {
			this.RenderQuestionContent();
			this.RenderAnswers();
		}

		if (this.$viewer.is(":visible")) {
			this.$viewer.appendTo("<div />");
		} else {
			this.$viewer.insertAfter(this.$questionLink);
		}
	}
	Deleted() {
		this.deleted = true;

		this.checkbox.Disable();
		this.element.classList.add("removed");
	}
	IsNotApproved() {
		/* if (this.approved || (this.contents.answers[this.answerID].source.approved && this.contents.answers[this.answerID].source.approved.date)) {
			this.Approved();
		}

		return !(this.approved || (this.contents.answers[this.answerID].source.approved && this.contents.answers[this.answerID].source.approved.date)) */
	}
	IsApproved() {
		return (
			this.approved ||
			(
				this.contents.answers[this.answerID].source.approved &&
				this.contents.answers[this.answerID].source.approved.date
			)
		);
	}
	Approved(already) {
		this.approved = true;

		this.RenderApproveIcon();
		this.element.classList.add("approved");
		this.element.classList.remove("unapproved", "already");

		if (already)
			this.element.classList.add("already");
	}
	Unapproved(already) {
		this.approved = false;

		this.HideApproveIcon();
		this.element.classList.add("unapproved");
		this.element.classList.remove("approved", "already");

		if (already)
			this.element.classList.add("already");
	}
	RowNumber() {
		return Number(this.element.children && this.element.children.length > 1 ? this.element.children[1].innerText : 0);
	}
	CheckDeleteResponse(resRemove) {
		let rowNumber = this.RowNumber();

		this.checkbox.HideSpinner();

		if (!resRemove || (!resRemove.success && !resRemove.message)) {
			notification(`#${rowNumber} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`, "error");
		} else {
			this.Deleted();

			if (!resRemove.success && resRemove.message) {
				this.element.classList.add("already");
				notification(`#${rowNumber} > ${resRemove.message}`, "error");
			}
		}
	}
	async CheckApproveResponse(resApprove) {
		let rowNumber = this.RowNumber();

		this.checkbox.HideSpinner();

		if (!resApprove) {
			notification(`#${rowNumber} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`, "error");
		} else if (!resApprove.success && resApprove.message) {
			notification(`#${rowNumber} > ${resApprove.message}`, "error");
		} else {
			this.FetchContentWithPromise(true);
			await this.SetContentAfterResolve();
			this.UpdateAnswerContent();
			this.Approved();
			this.contents.answers[this.answerID].RenderApproveIcon();

			if (!resApprove.success && !resApprove.message) {
				this.element.classList.add("already");
				let message = System.data.locale.userContent.notificationMessages.xIsAlreayApproved.replace("%{row_id}", `#${rowNumber} `);
				notification(`${message}`, "info");
			}
		}
	}
	UpdateAnswerContent() {
		let answer = this.res.data.responses.find(response => response.id == this.answerID);
		this.contents.answers[this.answerID].source = answer;
	}
	async CheckUnapproveResponse(resUnapprove) {
		let rowNumber = this.RowNumber();

		this.checkbox.HideSpinner();

		if (!resUnapprove) {
			notification(`#${rowNumber} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`, "error");
		} else if (!resUnapprove.success && resUnapprove.message) {
			notification(`#${rowNumber} > ${resUnapprove.message}`, "error");
		} else {
			this.FetchContentWithPromise(true);
			await this.SetContentAfterResolve();
			this.UpdateAnswerContent();
			this.Unapproved();
			this.contents.answers[this.answerID].HideApproveIcon();

			if (!resUnapprove.success && !resUnapprove.message) {
				this.element.classList.add("already");
				let message = System.data.locale.userContent.notificationMessages.xIsAlreayUnapproved.replace("%{row_id}", `#${rowNumber} `);
				notification(`${message}`, "info");
			}
		}
	}
}
