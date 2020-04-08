import debounce from "debounce";
import Button from "../../../../components/Button";
import DeleteSection from "../../../../components/DeleteSection";
import Modal from "../../../../components/Modal";
import Action from "../../../../controllers/Req/Brainly/Action";
import Components from "./Components";

class MassContentDeleter extends Components {
  constructor(main) {
    super(main);

    this.deletedContents = {};
    this.contentsToDelete = [];
    this.deletedContentCount = 0;
    this.liLinkContent = System.data.locale.core.MassContentDeleter.text;

    this.RenderListItem();
    this.RenderModal();
    this.RenderDeleteButton();
    this.RenderButtonSpinner();
    this.RenderTextareaSpinner();
    this.RenderDeleteSection();
    this.RenderTextareaWarning();
    this.BindHandlers();
  }
  RenderModal() {
    let nIds = System.data.locale.common.nIds.replace("%{n}",
      ` <span>0</span> `);
    let nIdsToDeleted = System.data.locale.core.MassContentDeleter
      .nIdsToDeleted.replace("%{n}", ` <span>0</span> `);
    let nHasBeenDeleted = System.data.locale.core.MassContentDeleter
      .nHasBeenDeleted.replace("%{n}", ` <b>0</b> `);
    this.modal = new Modal({
      header: `
			<div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-text sg-text--peach">${System.data.locale.core.MassContentDeleter.text}</div>
					</div>
				</div>
			</div>`,
      content: `
			<div class="sg-content-box">
				<div class="sg-spinner-container sg-content-box--full">
					<div class="sg-content-box__actions">
						<div class="sg-textarea sg-textarea--full-width back" style="color: transparent;"></div>
						<div class="sg-textarea sg-textarea--full-width sg-textarea--resizable-vertical" contenteditable="true" style="position: absolute; background: transparent;" placeholder="${System.data.locale.core.MassModerateContents.targets.listOfIds.contentLinksOrIDs}"></div>
					</div>
				</div>
				<div class="sg-content-box__actions sg-content-box__content--spaced-top-small">
					<div class="sg-actions-list sg-actions-list--no-wrap">
						<div class="sg-actions-list__hole">
							<div class="sg-content-box">
                <div class="sg-content-box__content">
									<p class="sg-text">${nIds}</p>
								</div>
                <div class="sg-content-box__content">
									<p class="sg-text">${nIdsToDeleted}</p>
								</div>
              </div>
						</div>
						<div class="sg-actions-list__hole sg-actions-list__hole--to-right js-hidden">
							<p class="sg-text">${nHasBeenDeleted}</p>
						</div>
					</div>
				</div>
				<div class="sg-content-box__content sg-content-box__content--spaced-top-large">
					<blockquote class="sg-text sg-text--small">${System.data.locale.core.MassContentDeleter.containerExplanation}<br>${System.createBrainlyLink("question", { id: 1234567 })}<br>${System.createBrainlyLink("question", { id: 2345678 })}<br>1234567<br>53453<br>xy545645<br>xy423423</blockquote>
				</div>
				<div class="sg-content-box__actions deleteSection"></div>
			</div>`,
      actions: `<div class="sg-spinner-container"></div>`
    });
    this.$modal = this.modal.$modal;
    this.$textareaSpinnerContainer = $(".sg-spinner-container", this.modal
      .$content);
    this.$textareaBack = $(".sg-textarea.back", this
      .$textareaSpinnerContainer);
    this.$textarea = $(".sg-textarea:not(.back)", this
      .$textareaSpinnerContainer);
    this.$deleteButtonSpinnerContainer = $(".sg-spinner-container", this.modal
      .$actions);
    this.$labels = $("> .sg-content-box > .sg-content-box__actions:eq(0)",
      this.modal.$content);
    this.$nHasBeenDeleted = $(".sg-text > b", this.$labels);
    this.$contentsCount = $(".sg-content-box__content:eq(0) .sg-text > span",
      this.$labels);
    this.$nIdsToDelete = $(".sg-content-box__content:eq(1) .sg-text > span",
      this.$labels);

  }
  RenderDeleteButton() {
    this.$deleteButton = Button({
      type: "solid-peach",
      text: `${System.data.locale.common.delete} !`
    });

    this.$deleteButton.appendTo(this.$deleteButtonSpinnerContainer);
  }
  RenderButtonSpinner() {
    this.$buttonSpinner = this.RenderSpinner();
  }
  RenderTextareaSpinner() {
    this.$textareaSpinner = this.RenderSpinner();
  }
  RenderSpinner() {
    return $(
      `<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`
    );
  }
  RenderDeleteSection() {
    this.deleteSection = new DeleteSection();

    this.deleteSection.$.appendTo($(".deleteSection", this.$modal));
  }
  RenderTextareaWarning() {
    this.$textareaWarning = $(
      `<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--white enterIdWarn">${System.data.locale.core.notificationMessages.enterIdWarn}</div>`
    );
  }
  BindHandlers() {
    this.li.addEventListener("click", this.OpenModal.bind(this));
    this.$deleteButton.click(this.StartDeleting.bind(this));
    this.modal.$close.click(this.modal.Close.bind(this.modal));

    this.$textarea.on({
      paste: this.PasteHandler.bind(this),
      scroll: this.UpdateTextareaBackScroll.bind(this),
      input: debounce(() => this.UpdateTextareaBackContent(), 5)
    });

    // @ts-ignore
    new window.ResizeObserver(this.UpdateTextAreaBackResize.bind(this))
      .observe(this.$textarea[0]);
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
  /**
   * @param {ClipboardEvent} event
   */
  async PasteHandler(event) {
    event.preventDefault();
    this.ShowTextareaSpinner();

    /**
     * @type {string}
     */
    // @ts-ignore
    let text = (event.originalEvent || event).clipboardData.getData(
      "text/plain");

    if (text)
      text = text.replace(/\s{1,}/g, "<br>");

    document.execCommand("insertHTML", false, text)

    this.UpdateTextareaBackContent();
  }
  ShowTextareaSpinner() {
    this.$textareaSpinner.appendTo(this.$textareaSpinnerContainer);
  }
  HideTextareaSpinner() {
    this.HideElement(this.$textareaSpinner);
  }
  /**
   * @param {JQuery<HTMLElement>} $element
   */
  HideElement($element) {
    $element.appendTo("<div />");
  }
  UpdateTextareaBackScroll() {
    this.$textareaBack.scrollTop(this.$textarea.scrollTop());
  }
  UpdateTextareaBackContent() {
    let idList = this.ParseIDs();
    this.contentsToDelete = [];

    this.$contentsCount.text(idList.length);

    let temp = this.$textarea.prop("innerHTML");

    if (idList.length > 0) {
      let rgx = new RegExp(`(?<![0-9])(?:${idList.join("|")})(?![0-9])`, "g");
      temp = temp
        .replace(rgx,
          replacedId => {
            let id = Number(replacedId);

            if (this.contentsToDelete.includes(id))
              return replacedId;

            let status = "blue-light";

            if (
              this.deletedContents[id] &&
              this.deletedContents[id].isDeleted
            ) {
              status = "peach";
            } else
              this.contentsToDelete.push(id);

            return `<span class="sg-text--background-${status}">${id}</span>`;
          });
    }

    this.$nIdsToDelete.text(this.contentsToDelete.length);
    this.$textareaBack.html(temp);
    this.HideTextareaWarning();
    this.HideTextareaSpinner();
    this.UpdateTextareaBackScroll();
  }
  ParseIDs() {
    /**
     * @type {number[]}
     */
    let idList = [];
    let values = this.$textarea.prop("innerText");

    if (values)
      idList = System.ExtractIds(values);

    return idList;
  }
  async StartDeleting() {
    if (!this.IsDataClear())
      return false;

    this.openedConnections = 0;
    window.isPageProcessing = true;
    let contentsToDelete = [...this.contentsToDelete];

    this.PrepareData();
    this.ShowButtonSpinner();
    this.ShowTextareaSpinner();
    this.ShowHasBeenDeletedLabel();
    this.DeleteContents(contentsToDelete);
    this._loop_deleter = setInterval(() => this.DeleteContents(
      contentsToDelete), 1000);
    System.log(5, {
      user: System.data.Brainly.userData.user,
      data: this
        .contentsToDelete
    });
  }
  IsDataClear() {
    if (!this.contentsToDelete || this.contentsToDelete.length == 0) {
      this.$textarea.focus();
      this.ShowTextareaWarning();
    } else if (this.deleteSection.selectedReason) {
      this.HideTextareaWarning();

      if (confirm(System.data.locale.core.notificationMessages
          .warningBeforeDelete)) {
        return true;
      }
    }
  }
  PrepareData() {
    this.contentData = {
      model_id: undefined,
      reason_id: this.deleteSection.selectedReason.id,
      reason: this.deleteSection.reasonText,
      give_warning: this.deleteSection.giveWarning,
    };

    if (this.deleteSection.type == "question")
      this.contentData.return_points = this.deleteSection.returnPoints;

    if (
      this.deleteSection.type == "question" ||
      this.deleteSection.type == "answer"
    )
      this.contentData.take_points = this.deleteSection.takePoints;
  }
  ShowHasBeenDeletedLabel() {
    this.$nHasBeenDeleted.parents(".sg-actions-list__hole.js-hidden")
      .removeClass("js-hidden");
  }
  ShowButtonSpinner() {
    this.$buttonSpinner.appendTo(this.$deleteButtonSpinnerContainer);
  }
  HideButtonSpinner() {
    this.HideElement(this.$buttonSpinner);
  }
  DeleteContents(contentIDs) {
    if (!contentIDs || contentIDs.length == 0) {
      return clearInterval(this._loop_deleter);
    }

    for (let i = 0, contentID; i < 5 && (contentID = contentIDs
        .shift()); i++) {
      this.DeleteContent(contentID);
    }
  }
  async DeleteContent(id) {
    let Method;
    this.contentData.model_id = id;
    let action = new Action();

    if (this.deleteSection.type == "question")
      Method = action.RemoveQuestion;

    if (this.deleteSection.type == "answer")
      Method = action.RemoveAnswer;

    if (this.deleteSection.type == "comment")
      Method = action.RemoveComment;

    let resRemove = await Method.bind(action)(this.contentData);

    this.MarkContentID(id, !!resRemove.success);

    if (!resRemove || !resRemove.success) {
      this.modal.notification(
        (
          resRemove.message ?
          `#${id} > ${resRemove.message}` :
          System.data.locale.core.notificationMessages
          .errorOccurredWhileDeletingTheN.replace("%{content_id}",
            ` #${id} `)
        ),
        "error"
      );
    } else {
      this.UpdateCounter();
    }

    this.UpdateProcessStatus();
  }
  MarkContentID(id, isDeleted) {
    let $id = $(`span:contains("${id}")`);

    $id.removeClass("toProcess");
    $id.addClass(isDeleted ? "success" : "error");
    this.deletedContents[id] = { isDeleted };
  }
  UpdateCounter() {
    this.$nHasBeenDeleted.text(++this.deletedContentCount);
  }
  UpdateProcessStatus() {
    if (this.contentsToDelete.length == ++this.openedConnections) {
      window.isPageProcessing = false;

      this.HideButtonSpinner();
      this.HideTextareaSpinner();
      this.modal.notification(System.data.locale.common.notificationMessages
        .operationCompleted, "success", true);
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

export default MassContentDeleter
