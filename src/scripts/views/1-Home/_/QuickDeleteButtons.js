import Buttons from "../../../components/Buttons";
import ModeratingPanel from "./ModeratingPanel";
import QuickDeleteButton from "./QuickDeleteButton";

class QuickDeleteButtons {
  /**
   * @param {HTMLElement} target
   */
  constructor(target) {
    this.target = target;

    this.Init();
  }
  async Init() {
    this.RenderContainer();

    this.questionId = await this.FindQuestionId();

    this.ShowContainer();
    this.RenderMoreOptionsButton();
    this.RenderButtons();
    this.BindHandlers();
  }
  RenderContainer() {
    this.$container = $(`<div class="sg-actions-list sg-actions-list--to-top ext_actions"></div>`);
  }
  /**
   * @returns {number}
   */
  FindQuestionId() {
    return new Promise((resolve, reject) => {
      let $questionLink = $(window.selectors.questionLink, this.target);
      let questionLink = $questionLink.attr("href");

      if (!questionLink) {
        reject({
          error: "Question link cannot be found",
          element: $questionLink
        });
      } else {
        let questionId = Number(System.ExtractId(questionLink));

        if (!questionId) {
          reject({
            error: "Question id is invalid",
            element: $questionLink,
            data: questionLink,
            id: questionId
          });
        } else {
          resolve(questionId);
        }
      }
    });
  }
  ShowContainer() {
    let $feedContentBox = $(this.target);

    if (window.selectors.questionsBox_buttonList)
      $feedContentBox = $(window.selectors.questionsBox_buttonList, this.target);

    this.$container.appendTo($feedContentBox);
  }
  RenderMoreOptionsButton() {
    let $buttonContainer = $(`<div class="sg-actions-list__hole sg-actions-list__hole--spaced-xsmall"></div>`);
    $buttonContainer.appendTo(this.$container);

    this.$moreOptionsButton = $(Buttons('RemoveQuestion', {
      text: System.data.locale.common.moderating.moreOptions,
      type: "alt",
      icon: "stream"
    }));

    this.$moreOptionsButton.appendTo($buttonContainer);
  }
  RenderButtons() {
    let $buttonContainer = $(`<div class="sg-actions-list__hole sg-actions-list__hole--no-spacing"></div>`);

    $buttonContainer.appendTo(this.$container);
    System.data.config.quickDeleteButtonsReasons.task.forEach(id => {
      let button = new QuickDeleteButton(id, this);

      button.$.appendTo($buttonContainer);
    });
  }
  BindHandlers() {
    this.$moreOptionsButton.click(this.OpenPanel.bind(this));
  }
  async OpenPanel() {
    new ModeratingPanel(this);
  }
}

export default QuickDeleteButtons
