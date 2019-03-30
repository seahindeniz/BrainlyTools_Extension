import debounce from "debounce"

const ERROR = "error";
const USER_NOT_FOUND = "notFound";
const SUCCESS = "success";

class IdListSection {
	constructor(main) {
		this.main = main;
		this.idList = [];

		this.Render();
		this.RenderSpinner();
		this.BindEvents();
	}
	Render() {
		this.$ = $(`
		<div class="sg-content-box">
			<div class="sg-spinner-container sg-content-box--full js-inputs">
				<div class="sg-content-box__actions">
					<div class="sg-textarea sg-textarea--full-width" style="color: transparent;"></div>
					<div class="sg-textarea sg-textarea--full-width sg-textarea--resizable-vertical" contenteditable="true" style="position: absolute; background: transparent;" placeholder="${System.data.locale.core.TaskDeleter.questionsLinksOrIDs}"></div>
				</div>
			</div>
			<div class="sg-content-box__content">
				<div class="sg-actions-list sg-actions-list--no-wrap sg-actions-list--to-right">
					<div class="sg-actions-list__hole">
						<p class="sg-text sg-text--xsmall sg-text--gray sg-text--bold"><span class="sg-text--mint">0</span></p>
					</div>
				</div>
			</div>
		</div>`);

		this.$textarea = $(".sg-textarea:eq(1)", this.$);
		this.$textareaBack = $(".sg-textarea:eq(0)", this.$);
		this.$spinnerContainer = $(".sg-spinner-container", this.$);
		this.$idCount = $("> .sg-content-box__content .sg-text > span", this.$);
	}
	RenderSpinner() {
		this.$spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`);
	}
	BindEvents() {
		this.$textarea.on({
			paste: this.PasteHandler.bind(this),
			scroll: this.UpdateTextareaBackScroll.bind(this),
			input: debounce(() => this.UpdateTextareaBackContent(), 5)
		});

		new window.ResizeObserver(this.UpdateTextAreaBackResize.bind(this)).observe(this.$textarea[0]);
	}
	UpdateTextAreaBackResize() {
		this.$textareaBack.css({
			width: this.$textarea.outerWidth(),
			height: this.$textarea.outerHeight()
		});
	}
	async PasteHandler(event) {
		event.preventDefault();
		this.ShowSpinner();

		let text = (event.originalEvent || event).clipboardData.getData("text/plain");

		await System.Delay(50);
		document.execCommand("insertText", false, text);
	}
	ShowSpinner() {
		this.$spinner.appendTo(this.$spinnerContainer);
	}
	HideSpinner() {
		this.main.HideElement(this.$spinner);
	}
	UpdateTextareaBackScroll() {
		this.$textareaBack.scrollTop(this.$textarea.scrollTop());
	}
	UpdateTextareaBackContent() {
		this.idList = this.ParseIDs();

		this.$idCount.text(this.idList.length);

		let temp = this.$textarea.html();

		this.idList.forEach(id => {
			temp = temp.replace(new RegExp(`((?:\\b|pt)+${id}\\b)`), `<span class="toProcess">$1</span>`);
		});

		this.HideSpinner();
		this.$textareaBack.html(temp);
		this.UpdateTextareaBackScroll();
		this.$textarea.removeClass(`error`);
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
	ShowEmptyIdListError() {
		this.main.modal.notification(System.data.locale.core.notificationMessages.youNeedToEnterValidId, "error");
		this.$textarea.focus().addClass(`error`);
	}
	BeforeSending(user) {}
	MessageSend(data) {
		this.MarkUserID(data.id, data.exception_type);
	}
	MarkUserID(id, status) {
		let _class = SUCCESS;
		let $id = $(`span`, this.$textareaBack).filter((i, span) => span.innerText == id);

		if (status == 500) {
			_class = USER_NOT_FOUND;
		} else if (status) {
			_class = ERROR;
		}

		$id.attr("class", _class);
	}
}

export default IdListSection
