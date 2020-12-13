import Action from "@BrainlyAction";
import Button from "@components/Button";
import DeleteSection from "@components/DeleteSection";
import Modal from "@components/Modal";
import { Text } from "@style-guide";
import debounce from "debounce";
import tippy from "tippy.js";
import Components from ".";

function RenderSpinner() {
  return $(
    `<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`,
  );
}

class MassContentDeleter extends Components {
  deletedContents: {
    [x: number]: { isDeleted: boolean };
  };

  contentsToDelete: number[];
  deletedContentCount: number;
  openedConnections: number;
  loopDeleter: number;

  modal: Modal;
  $textareaSpinnerContainer: JQuery<HTMLElement>;
  $textareaBack: JQuery<HTMLElement>;
  $textarea: JQuery<HTMLElement>;
  $deleteButtonSpinnerContainer: JQuery<HTMLElement>;
  $labels: JQuery<HTMLElement>;
  $nHasBeenDeleted: JQuery<HTMLElement>;
  $contentsCount: JQuery<HTMLElement>;
  $nIdsToDelete: JQuery<HTMLElement>;
  $deleteButton: JQuery<HTMLElement>;
  $buttonSpinner: JQuery<HTMLElement>;
  $textareaSpinner: JQuery<HTMLElement>;
  deleteSection: DeleteSection;

  contentData: {
    [x: string]: any;
  };

  warningTippy: any;

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
    const nIds = System.data.locale.common.nIds.replace(
      "%{n}",
      ` <span>0</span> `,
    );
    const nIdsToDeleted = System.data.locale.core.MassContentDeleter.nIdsToDeleted.replace(
      "%{n}",
      ` <span>0</span> `,
    );
    const nHasBeenDeleted = System.data.locale.core.MassContentDeleter.nHasBeenDeleted.replace(
      "%{n}",
      ` <b>0</b> `,
    );

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
						<div class="sg-textarea sg-textarea--full-width sg-textarea--resizable-vertical" contenteditable="true" style="position: absolute; background: transparent;" placeholder="${
              System.data.locale.core.MassModerateContents.targets.listOfIds
                .contentLinksOrIDs
            }"></div>
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
					<blockquote class="sg-text sg-text--small">${
            System.data.locale.core.MassContentDeleter.containerExplanation
          }<br>${System.createBrainlyLink("question", {
        id: 1234567,
      })}<br>${System.createBrainlyLink("question", {
        id: 2345678,
      })}<br>1234567<br>53453<br>xy545645<br>xy423423</blockquote>
				</div>
				<div class="sg-content-box__actions deleteSection"></div>
			</div>`,
      actions: `<div class="sg-spinner-container"></div>`,
    });
    this.$textareaSpinnerContainer = $(
      ".sg-spinner-container",
      this.modal.$content,
    );
    this.$textareaBack = $(".sg-textarea.back", this.$textareaSpinnerContainer);
    this.$textarea = $(
      ".sg-textarea:not(.back)",
      this.$textareaSpinnerContainer,
    );
    this.$deleteButtonSpinnerContainer = $(
      ".sg-spinner-container",
      this.modal.$actions,
    );
    this.$labels = $(
      "> .sg-content-box > .sg-content-box__actions:eq(0)",
      this.modal.$content,
    );
    this.$nHasBeenDeleted = $(".sg-text > b", this.$labels);
    this.$contentsCount = $(
      ".sg-content-box__content:eq(0) .sg-text > span",
      this.$labels,
    );
    this.$nIdsToDelete = $(
      ".sg-content-box__content:eq(1) .sg-text > span",
      this.$labels,
    );
  }

  RenderDeleteButton() {
    this.$deleteButton = Button({
      type: "solid-peach",
      text: `${System.data.locale.common.delete} !`,
    });

    this.$deleteButton.appendTo(this.$deleteButtonSpinnerContainer);
  }

  RenderButtonSpinner() {
    this.$buttonSpinner = RenderSpinner();
  }

  RenderTextareaSpinner() {
    this.$textareaSpinner = RenderSpinner();
  }

  RenderDeleteSection() {
    this.deleteSection = new DeleteSection();

    this.deleteSection.$.appendTo($(".deleteSection", this.modal.$modal));
  }

  RenderTextareaWarning() {
    this.warningTippy = tippy(this.$textarea.parent().get(0), {
      theme: "light",
      trigger: "manual",
      placement: "bottom",
      content: Text({
        weight: "bold",
        color: "peach-dark",
        children: System.data.locale.core.notificationMessages.enterIdWarn,
      }),
    });
  }

  BindHandlers() {
    this.li.addEventListener("click", this.OpenModal.bind(this));
    this.$deleteButton.on("click", this.StartDeleting.bind(this));
    this.modal.$close.on("click", this.modal.Close.bind(this.modal));

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

  OpenModal() {
    this.modal.Open();
    this.UpdateTextAreaBackResize();
  }

  UpdateTextAreaBackResize() {
    this.$textareaBack.css({
      width: this.$textarea.outerWidth(),
      height: this.$textarea.outerHeight(),
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
      "text/plain",
    );

    if (text) text = text.replace(/\s{1,}/g, "<br>");

    document.execCommand("insertHTML", false, text);

    this.UpdateTextareaBackContent();
  }

  ShowTextareaSpinner() {
    this.$textareaSpinner.appendTo(this.$textareaSpinnerContainer);
  }

  HideTextareaSpinner() {
    this.HideElement(this.$textareaSpinner);
  }

  UpdateTextareaBackScroll() {
    this.$textareaBack.scrollTop(this.$textarea.scrollTop());
  }

  UpdateTextareaBackContent() {
    const idList = this.ParseIDs();

    this.contentsToDelete = [];

    this.$contentsCount.text(idList.length);

    let temp = this.$textarea.prop("innerHTML");

    if (idList.length > 0) {
      const rgx = new RegExp(`(?<![0-9])(?:${idList.join("|")})(?![0-9])`, "g");

      temp = temp.replace(rgx, replacedId => {
        const id = Number(replacedId);

        if (this.contentsToDelete.includes(id)) return replacedId;

        let status = "blue-light";

        if (this.deletedContents[id] && this.deletedContents[id].isDeleted) {
          status = "peach";
        } else this.contentsToDelete.push(id);

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
    let idList: number[] = [];
    const values = this.$textarea.prop("innerText");

    if (values) idList = System.ExtractIds(values);

    return idList;
  }

  async StartDeleting() {
    if (!this.IsDataClear()) return;

    this.openedConnections = 0;
    window.isPageProcessing = true;

    const contentsToDelete = [...this.contentsToDelete];

    this.PrepareData();
    this.ShowButtonSpinner();
    this.ShowTextareaSpinner();
    this.ShowHasBeenDeletedLabel();
    this.DeleteContents(contentsToDelete);
    this.loopDeleter = window.setInterval(
      () => this.DeleteContents(contentsToDelete),
      1000,
    );
    System.log(5, {
      user: System.data.Brainly.userData.user,
      data: this.contentsToDelete,
    });
  }

  IsDataClear() {
    if (!this.contentsToDelete?.length) {
      this.$textarea.trigger("focus");
      this.ShowTextareaWarning();

      return false;
    }

    if (!this.deleteSection.selectedReason) return false;

    this.HideTextareaWarning();

    return confirm(
      System.data.locale.core.notificationMessages.warningBeforeDelete,
    );
  }

  PrepareData() {
    this.contentData = {
      model_id: undefined,
      reason_id: this.deleteSection.selectedReason.id,
      reason: this.deleteSection.reasonText,
      give_warning: this.deleteSection.giveWarning,
    };

    if (this.deleteSection.type === "question")
      this.contentData.return_points = this.deleteSection.returnPoints;

    if (
      this.deleteSection.type === "question" ||
      this.deleteSection.type === "answer"
    )
      this.contentData.take_points = this.deleteSection.takePoints;
  }

  ShowHasBeenDeletedLabel() {
    this.$nHasBeenDeleted
      .parents(".sg-actions-list__hole.js-hidden")
      .removeClass("js-hidden");
  }

  ShowButtonSpinner() {
    this.$buttonSpinner.appendTo(this.$deleteButtonSpinnerContainer);
  }

  HideButtonSpinner() {
    this.HideElement(this.$buttonSpinner);
  }

  DeleteContents(contentIDs: number[]) {
    if (!contentIDs || contentIDs.length === 0) {
      clearInterval(this.loopDeleter);

      return;
    }

    for (let i = 0, contentID; i < 5 && (contentID = contentIDs.shift()); i++) {
      this.DeleteContent(contentID);
    }
  }

  async DeleteContent(id) {
    this.contentData.model_id = id;

    let Method;
    const action = new Action();

    if (this.deleteSection.type === "question") Method = action.RemoveQuestion;

    if (this.deleteSection.type === "answer") Method = action.RemoveAnswer;

    if (this.deleteSection.type === "comment") Method = action.RemoveComment;

    const resRemove = await Method.bind(action)(this.contentData);

    // const resRemove = { success: true, message: "Failed" };
    // await System.TestDelay();

    this.MarkContentID(id, !!resRemove.success);

    if (!resRemove || !resRemove.success) {
      this.modal.notification(
        resRemove.message
          ? `#${id} > ${resRemove.message}`
          : System.data.locale.core.notificationMessages.errorOccurredWhileDeletingTheN.replace(
              "%{content_id}",
              ` #${id} `,
            ),
        "error",
      );
    } else {
      this.UpdateCounter();
    }

    this.UpdateProcessStatus();
  }

  MarkContentID(id, isDeleted) {
    const $id = $(`span:contains("${id}")`);

    $id.removeClass("toProcess");
    $id.addClass(isDeleted ? "success" : "error");
    this.deletedContents[id] = { isDeleted };
  }

  UpdateCounter() {
    this.$nHasBeenDeleted.text(++this.deletedContentCount);
  }

  UpdateProcessStatus() {
    if (this.contentsToDelete.length === ++this.openedConnections) {
      window.isPageProcessing = false;

      this.HideButtonSpinner();
      this.HideTextareaSpinner();
      this.modal.notification(
        System.data.locale.common.notificationMessages.operationCompleted,
        "success",
        true,
      );
    }
  }

  ShowTextareaWarning() {
    this.warningTippy.show();
  }

  async HideTextareaWarning() {
    this.warningTippy.hide();
  }
}

export default MassContentDeleter;
