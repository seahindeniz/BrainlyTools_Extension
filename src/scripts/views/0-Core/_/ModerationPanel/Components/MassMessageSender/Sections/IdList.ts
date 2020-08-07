/* eslint-disable import/no-duplicates */
import { SendMessageUserType } from "@/scripts/controllers/Req/Brainly/Action/SendMessageToBrainlyIds";
import debounce from "debounce";
import type MassMessageSenderClassType from "..";

const ERROR = "error";
const USER_NOT_FOUND = "notFound";
const SUCCESS = "success";

class IdListSection {
  main: MassMessageSenderClassType;
  idList: number[];

  $: JQuery<HTMLElement>;
  $textarea: JQuery<HTMLElement>;
  $textareaBack: JQuery<HTMLElement>;
  $spinnerContainer: JQuery<HTMLElement>;
  $idCount: JQuery<HTMLElement>;
  $spinner: JQuery<HTMLElement>;

  constructor(main: MassMessageSenderClassType) {
    this.main = main;
    this.idList = [];

    this.Render();
    this.RenderSpinner();
    this.BindHandlers();
  }

  Render() {
    this.$ = $(`
		<div class="sg-content-box">
			<div class="sg-spinner-container sg-content-box--full">
				<div class="sg-content-box__actions">
					<div class="sg-textarea sg-textarea--full-width" style="color: transparent;"></div>
					<div class="sg-textarea sg-textarea--full-width sg-textarea--resizable-vertical" contenteditable="true" style="position: absolute; background: transparent;" placeholder="${System.data.locale.core.pointChanger.enterOrPasteUID}"></div>
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
    this.$spinner = $(
      `<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`,
    );
  }

  BindHandlers() {
    this.$textarea.on({
      paste: this.PasteHandler.bind(this),
      scroll: this.UpdateTextareaBackScroll.bind(this),
      input: debounce(() => this.UpdateTextareaBackContent(), 5),
    });

    // @ts-ignore
    new window.ResizeObserver(this.UpdateTextAreaBackResize.bind(this)).observe(
      this.$textarea[0],
    );
  }

  UpdateTextAreaBackResize() {
    this.$textareaBack.css({
      width: this.$textarea.outerWidth(),
      height: this.$textarea.outerHeight(),
    });
  }

  async PasteHandler(event) {
    event.preventDefault();
    this.ShowSpinner();

    /**
     * @type {string}
     */
    // @ts-ignore
    let text = (event.originalEvent || event).clipboardData.getData(
      "text/plain",
    );

    if (text) text = text.replace(/\s{1,}/g, "<br>");

    document.execCommand("insertHTML", false, text);

    this.UpdateTextareaBackContent();
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
    this.idList = [];
    const idList = this.ParseIDs();

    let temp = this.$textarea.prop("innerHTML");

    if (idList.length > 0) {
      const rgx = new RegExp(`(?<![0-9])(?:${idList.join("|")})(?![0-9])`, "g");
      temp = temp.replace(rgx, replacedId => {
        const id = Number(replacedId);

        if (this.idList.includes(id)) return replacedId;

        this.idList.push(id);

        return `<span class="sg-text--background-blue-light">${id}</span>`;
      });
    }

    this.HideSpinner();
    this.$textareaBack.html(temp);
    this.UpdateTextareaBackScroll();
    this.$textarea.removeClass(`error`);
    this.$idCount.text(this.idList.length);
  }

  /**
   * @returns {number[]}
   */
  ParseIDs() {
    let idList;
    const values = this.$textarea.prop("innerText");

    if (values) {
      idList = System.ExtractIds(values);

      if (idList && idList.length > 0) {
        idList = Array.from(new Set(idList));
      }
    }
    return idList;
  }

  ShowEmptyIdListError() {
    this.main.modal.notification(
      System.data.locale.core.notificationMessages.youNeedToEnterValidId,
      "error",
    );
    this.$textarea.trigger("focus").addClass(`error`);
  }

  MessageSent(data: SendMessageUserType) {
    this.MarkUserID(data.id, data.exception_type);
  }

  MarkUserID(id: string | number, status: number) {
    let className = SUCCESS;
    const $id = $(`span`, this.$textareaBack).filter(
      (i, span) => span.innerText === String(id),
    );

    if (status === 500) {
      className = USER_NOT_FOUND;
    } else if (status) {
      className = ERROR;
    }

    $id.attr("class", className);
  }
}

export default IdListSection;
