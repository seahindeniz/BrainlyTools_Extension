import DeleteSection from "../../../../components/DeleteSection";
import Modal from "../../../../components/Toplayer/Modal";
import { RemoveQuestion } from "../../../../controllers/ActionsOfBrainly";
import debounce from "debounce"

class MassQuestionDeleter {
	constructor() {
		this.deletedQuestions = {};
		this.questionsToDelete = [];
		this.deletedQuestionCount = 0;

		this.Init();
	}
	Init() {
		this.RenderLi();
		this.RenderModal();
		this.RenderButtonSpinner();
		this.RenderTextareaSpinner();
		this.RenderDeleteSection();
		this.RenderTextareaWarning();
		this.BindEvents();
	}
	RenderLi() {
		this.$li = $(`
		<li class="sg-menu-list__element" style="display: table; width: 100%;">
			<span class="sg-text sg-text--link sg-text--blue sg-text--small">${System.data.locale.core.TaskDeleter.text}</span>
		</li>`);
	}
	RenderModal() {
		let nQuestions = System.data.locale.core.TaskDeleter.nQuestions.replace("%{n}", `<span>0</span>`);
		let nQuestionsToDeleted = System.data.locale.core.TaskDeleter.nQuestionsToDeleted.replace("%{n}", `<span>0</span>`);
		let nHasBeenDeleted = System.data.locale.core.TaskDeleter.nHasBeenDeleted.replace("%{n}", `<b>0</b>`);
		this.modal = new Modal({
			header: `
			<div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-text sg-text--peach">${System.data.locale.core.TaskDeleter.text}</div>
					</div>
				</div>
			</div>`,
			content: `
			<div class="sg-content-box">
				<div class="sg-spinner-container sg-content-box--full js-inputs">
					<div class="sg-content-box__actions">
						<div class="sg-textarea sg-textarea--full-width back" style="color: transparent;"></div>
						<div class="sg-textarea sg-textarea--full-width sg-textarea--resizable-vertical" contenteditable="true" style="position: absolute; background: transparent;" placeholder="${System.data.locale.core.TaskDeleter.questionsLinksOrIDs}"></div>
					</div>
				</div>
				<div class="sg-content-box__actions js-labels">
					<div class="sg-actions-list sg-actions-list--no-wrap">
						<div class="sg-actions-list__hole">
							<div class="sg-content-box">
                <div class="sg-content-box__content">
									<p class="sg-text">${nQuestions}</p>
								</div>
                <div class="sg-content-box__content">
									<p class="sg-text">${nQuestionsToDeleted}</p>
								</div>
              </div>
						</div>
						<div class="sg-actions-list__hole sg-actions-list__hole--to-right js-hidden">
							<p class="sg-text">${nHasBeenDeleted}</p>
						</div>
					</div>
				</div>
				<div class="sg-content-box__content">
					<blockquote class="sg-text sg-text--small">${System.data.locale.core.TaskDeleter.containerExplanation}<br>${System.createBrainlyLink("task", { id: 1234567 })}<br>${System.createBrainlyLink("task", { id: 2345678 })}<br>1234567<br>2345678</blockquote>
				</div>
				<div class="sg-content-box__actions deleteSection"></div>
			</div>`,
			actions: `
			<div class="sg-spinner-container">
				<button class="sg-button-primary sg-button-primary--peach js-delete">${System.data.locale.common.delete}</button>
			</div>`
		});
		this.$modal = this.modal.$modal;
		this.$deleteButton = $(".js-delete", this.$modal);
		this.$textareaSpinnerContainer = $(".js-inputs", this.$modal);
		this.$textareaBack = $(".sg-textarea.back", this.$textareaSpinnerContainer);
		this.$textarea = $(".sg-textarea:not(.back)", this.$textareaSpinnerContainer);
		this.$nHasBeenDeleted = $(".js-labels .sg-text > b", this.$modal);
		this.$questionsCount = $(".js-labels .sg-content-box__content:eq(0) .sg-text > span", this.$modal);
		this.$nQuestionsToDelete = $(".js-labels .sg-content-box__content:eq(1) .sg-text > span", this.$modal);

	}
	RenderButtonSpinner() {
		this.$buttonSpinner = this.RenderSpinner();
	}
	RenderTextareaSpinner() {
		this.$textareaSpinner = this.RenderSpinner();
	}
	RenderSpinner() {
		return $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`);
	}
	RenderDeleteSection() {
		this.deleteSection = new DeleteSection(System.data.Brainly.deleteReasons.task, "task");

		this.deleteSection.$.appendTo($(".deleteSection", this.$modal));
	}
	RenderTextareaWarning() {
		this.$textareaWarning = $(`<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--light enterIdWarn">${System.data.locale.core.notificationMessages.enterIdWarn}</div>`);
	}
	BindEvents() {
		this.$li.on("click", "span", this.OpenModal.bind(this));
		this.$deleteButton.click(this.StartDeleting.bind(this));
		this.modal.$close.click(this.modal.Close.bind(this.modal));

		this.$textarea.on({
			paste: this.PasteHandler.bind(this),
			scroll: this.UpdateTextareaBackScroll.bind(this),
			input: debounce(() => this.UpdateTextareaBackContent(), 5)
		});

		new window.ResizeObserver(this.UpdateTextAreaBackResize.bind(this)).observe(this.$textarea[0]);
	}
	OpenModal() {
		this.modal.Open();
		this.UpdateTextAreaBackResize();
	}
	UpdateTextAreaBackResize() {
		this.$textareaBack.css({
			width: this.$textarea.outerWidth(),
			height: this.$textarea.outerHeight()
		});
	}
	async PasteHandler(event) {
		event.preventDefault();
		this.ShowTextareaSpinner();

		let text = (event.originalEvent || event).clipboardData.getData("text/plain");

		await System.Delay(50);
		document.execCommand("insertText", false, text);
	}
	ShowTextareaSpinner() {
		this.$textareaSpinner.appendTo(this.$textareaSpinnerContainer);
	}
	HideTextareaSpinner() {
		this.HideElement(this.$textareaSpinner);
	}
	/**
	 * @param {jQuery} $element
	 */
	HideElement($element) {
		$element.appendTo("<div />");
	}
	UpdateTextareaBackScroll() {
		this.$textareaBack.scrollTop(this.$textarea.scrollTop());
	}
	UpdateTextareaBackContent() {
		let idList = this.ParseIDs();
		this.questionsToDelete = [];

		this.$questionsCount.text(idList.length);

		let temp = this.$textarea.html();

		idList.forEach(id => {
			let status = "toDelete";

			if (this.deletedQuestions[id])
				status = this.deletedQuestions[id].isDeleted ? "deleted" : "error";
			else
				this.questionsToDelete.push(id);

			temp = temp.replace(new RegExp(`((?:\\b|pt)+${id}\\b)`), `<span class="${status}">$1</span>`);
		});

		this.$nQuestionsToDelete.text(this.questionsToDelete.length);
		this.$textareaBack.html(temp);
		this.HideTextareaWarning();
		this.HideTextareaSpinner();
		this.UpdateTextareaBackScroll();
	}
	/**
	 * @returns {number[]}
	 */
	ParseIDs() {
		let idList;
		let values = this.$textarea.prop("innerText");

		if (values) {
			idList = System.ExtractIds(values);

			if (idList && idList.length > 0) {
				idList = Array.from(new Set(idList));
			}
		}
		return idList;
	}
	async StartDeleting() {
		if (!this.IsDataClear())
			return false;

		this.openedConnections = 0;
		window.isPageProcessing = true;
		let questionsToDelete = [...this.questionsToDelete];

		this.PrepareData();
		this.ShowButtonSpinner();
		this.ShowTextareaSpinner();
		this.ShowHasBeenDeletedLabel();
		this.DeleteQuestions(questionsToDelete);
		this._loop_deleter = setInterval(() => this.DeleteQuestions(questionsToDelete), 1000);
		System.log(5, { user: System.data.Brainly.userData.user, data: this.questionsToDelete });
	}
	IsDataClear() {
		if (!this.questionsToDelete || this.questionsToDelete.length == 0) {
			this.ShowTextareaWarning();
		} else if (!this.deleteSection.selectedReason) {
			this.deleteSection.ShowReasonWarning();
		} else {
			this.HideTextareaWarning();
			this.deleteSection.HideReasonWarning();

			if (confirm(System.data.locale.core.notificationMessages.warningBeforeDelete)) {
				return true;
			}
		}
	}
	PrepareData() {
		this.questionData = {
			reason_id: this.deleteSection.selectedReason.id,
			reason: this.deleteSection.reasonText,
			give_warning: this.deleteSection.giveWarning,
			take_points: this.deleteSection.takePoints,
			return_points: this.deleteSection.returnPoints
		};
	}
	ShowHasBeenDeletedLabel() {
		this.$nHasBeenDeleted.parents(".sg-actions-list__hole.js-hidden").removeClass("js-hidden");
	}
	ShowButtonSpinner() {
		this.$buttonSpinner.insertAfter(this.$deleteButton);
	}
	HideButtonSpinner() {
		this.HideElement(this.$buttonSpinner);
	}
	DeleteQuestions(questionIDs) {
		if (!questionIDs || questionIDs.length == 0) {
			return clearInterval(this._loop_deleter);
		}

		for (let i = 0, questionID; i < 5 && (questionID = questionIDs.shift()); i++) {
			this.DeleteQuestion(questionID);
		}
	}
	async DeleteQuestion(id) {
		this.questionData.model_id = id;
		let resRemove = await RemoveQuestion(this.questionData);

		/* await System.Delay();
		let resRemove = { success: false, message: "question cannot be deleted :/" }; */

		this.MarkQuestionID(id, !!resRemove.success);

		if (!resRemove || !resRemove.success) {
			this.modal.notification(
				(
					resRemove.message ?
					`#${id} > ${resRemove.message}` :
					System.data.locale.core.notificationMessages.errorOccuredWhileDeletingTheQuestion.replace("%{question_id}", id)
				),
				"error"
			);
		} else {
			this.UpdateCounter();
		}

		this.UpdateProcessStatus();
	}
	MarkQuestionID(id, isDeleted) {
		let $id = $(`span:contains("${id}")`);

		$id.removeClass("toDelete");
		$id.addClass(isDeleted ? "deleted" : "error");
		this.deletedQuestions[id] = { isDeleted };
	}
	UpdateCounter() {
		this.$nHasBeenDeleted.text(++this.deletedQuestionCount);
	}
	UpdateProcessStatus() {
		if (this.questionsToDelete.length == ++this.openedConnections) {
			window.isPageProcessing = false;

			this.HideButtonSpinner();
			this.HideTextareaSpinner();
			this.modal.notification(System.data.locale.common.notificationMessages.operationCompleted, "success", true);
		}
	}
	ShowTextareaWarning() {
		if (this.$textareaWarning.parents("body").length == 0) {
			this.$textareaWarning.insertAfter(this.$textarea.parent());
		} else {
			this.$textareaWarning
				.fadeTo('fast', 0.5)
				.fadeTo('fast', 1)
				.fadeTo('fast', 0.5)
				.fadeTo('fast', 1);
		}

		this.$textareaWarning.focus();
	}
	async HideTextareaWarning() {
		await this.$textareaWarning.slideUp('fast').promise();
		this.HideElement(this.$textareaWarning)
		this.$textareaWarning.show();
	}
}

export default MassQuestionDeleter
