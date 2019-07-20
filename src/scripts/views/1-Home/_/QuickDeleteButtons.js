import Button from "../../../components/Button";
import ModeratingPanel from "./ModeratingPanel";
import QuickDeleteButton from "./QuickDeleteButton";

let System = require("../../../helpers/System");

class QuickDeleteButtons {
  /**
   * @param {HTMLElement} target
   */
  constructor(target) {
    this.target = target;

    if (typeof System == "function")
      System = System();

    $(target).addClass("js-extension");

    this.Init();
  }
  async Init() {
    try {
      this.RenderContainer();

      this.questionId = this.FindQuestionId();

      this.ShowContainer();
      this.RenderMoreOptionsButton();
      this.RenderButtonSpinner();
      this.RenderDeleteButtons();
      this.BindHandlers();
    } catch (error) {
      console.error(error);
    }
  }
  RenderContainer() {
    this.$container = $(`
    <div class="sg-actions-list sg-actions-list--to-top ext_actions">
      <div class="sg-actions-list__hole sg-actions-list__hole--spaced-xsmall">
        <div class="sg-spinner-container"></div>
      </div>
      <div class="sg-actions-list__hole sg-actions-list__hole--no-spacing">
        <div class="sg-content-box"></div>
      </div>
    </div>`);

    this.$deleteButtonContainerBox = $(".sg-content-box", this.$container);
    this.$moreOptionsButtonContainer = $(".sg-spinner-container", this.$container);
  }
  /**
   * @returns {number}
   */
  FindQuestionId() {
    let $questionLink = $(window.selectors.questionLink, this.target);
    let questionLink = $questionLink.attr("href");

    if (!questionLink)
      throw {
        error: "Question link cannot be found",
        element: $questionLink
      };

    let questionId = System.ExtractId(questionLink);

    if (!questionId)
      throw {
        error: "Question id is invalid",
        element: $questionLink,
        data: questionLink,
        id: questionId
      };

    return questionId;
  }
  ShowContainer() {
    let $feedContentBox = $(this.target);

    if (window.selectors.questionsBox_buttonList)
      $feedContentBox = $(window.selectors.questionsBox_buttonList, this.target);

    this.$container.appendTo($feedContentBox);
  }
  RenderMoreOptionsButton() {
    this.$moreOptionsButton = Button({
      type: "primary-blue",
      size: "xsmall",
      icon: "stream",
      text: System.data.locale.common.moderating.moreOptions
    });

    this.$moreOptionsButton.appendTo(this.$moreOptionsButtonContainer);
  }
  RenderButtonSpinner() {
    this.$spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`);
  }
  RenderDeleteButtons() {
    System.data.config.quickDeleteButtonsReasons.task.forEach(this.RenderDeleteButton.bind(this));
  }
  RenderDeleteButton(id) {
    let button = new QuickDeleteButton(id, this);
    let $buttonContainer = $(`<div class="sg-content-box__content sg-content-box__content--spaced-bottom-xsmall"></div>`);

    $buttonContainer.appendTo(this.$deleteButtonContainerBox);

    button.$spinnerContainer.appendTo($buttonContainer);
  }
  BindHandlers() {
    this.$moreOptionsButton.click(this.OpenPanel.bind(this));
  }
  async OpenPanel() {
    this.ShowMoreOptionsButtonSpinner();
    new ModeratingPanel(this);
  }
  ShowMoreOptionsButtonSpinner() {
    this.$spinner.appendTo(this.$moreOptionsButtonContainer);
  }
  HideSpinner() {
    this.$spinner.appendTo("<div />");
  }
}

export default QuickDeleteButtons
