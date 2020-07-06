import { ContentBoxContent, Button, Icon } from "@style-guide";
import ModeratingPanel from "./ModeratingPanel";
import QuickDeleteButton from "./QuickDeleteButton";

class QuickDeleteButtons {
  /**
   * @param {HTMLElement} target
   * @param {{user?: {}, questionId?: number}} param1
   */
  constructor(target, { user, questionId } = {}) {
    this.target = target;
    this.user = user;
    this.questionId = questionId;

    target.classList.add("js-extension");

    this.Init();
  }

  async Init() {
    try {
      this.RenderContainer();

      if (!this.user) this.user = this.FindOwner();

      if (!this.questionId) this.questionId = this.FindQuestionId();

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
      <div class="sg-actions-list__hole sg-actions-list__hole--no-spacing">
        <div class="sg-spinner-container"></div>
      </div>
      <div class="sg-actions-list__hole sg-actions-list__hole--no-spacing">
        <div class="sg-content-box"></div>
      </div>
    </div>`);

    this.$deleteButtonContainerBox = $(".sg-content-box", this.$container);
    this.$moreOptionsButtonContainer = $(
      ".sg-spinner-container",
      this.$container,
    );
  }

  FindOwner() {
    const $userLink = $(window.selectors.userLink, this.target);

    if ($userLink.length == 0)
      throw {
        msg: "User link element not found from target",
        element: this.target,
      };

    const link = $userLink.attr("href");

    if (!link)
      throw { msg: "User link not found from target", element: this.target };

    let [nick, id] = link.replace(/.*\//, "").split("-");

    if (!nick)
      throw { msg: "User nick not found from target", element: this.target };

    if (!id)
      throw { msg: "User id not found from target", element: this.target };

    id = ~~id;

    return {
      id,
      nick,
    };
  }

  /**
   * @returns {number}
   */
  FindQuestionId() {
    const $questionLink = $(window.selectors.questionLink, this.target);
    const questionLink = $questionLink.attr("href");

    if (!questionLink)
      throw {
        msg: "Question link cannot be found",
        element: $questionLink,
      };

    const questionId = System.ExtractId(questionLink);

    if (!questionId)
      throw {
        msg: "Question id is invalid",
        element: $questionLink,
        data: questionLink,
        id: questionId,
      };

    return questionId;
  }

  ShowContainer() {
    this.$container.appendTo(this.target);
  }

  RenderMoreOptionsButton() {
    this.moreOptionsButton = new Button({
      type: "solid-blue",
      size: "m",
      reversedOrder: true,
      icon: new Icon({
        type: "menu",
      }),
      text: System.data.locale.common.moderating.moreOptions,
    });

    this.$moreOptionsButton = $(this.moreOptionsButton.element);

    this.$moreOptionsButton.appendTo(this.$moreOptionsButtonContainer);
  }

  RenderButtonSpinner() {
    this.$spinner = $(
      `<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--xsmall"></div></div>`,
    );
  }

  RenderDeleteButtons() {
    System.data.config.quickDeleteButtonsReasons.question.forEach(
      this.RenderDeleteButton.bind(this),
    );
  }

  /**
   * @param {number} id
   * @param {number} index
   */
  RenderDeleteButton(id, index) {
    const button = new QuickDeleteButton(id, index, this);
    const buttonContainer = ContentBoxContent({
      spacedBottom: "xsmall",
    });

    buttonContainer.append(button.spinnerContainer);
    this.$deleteButtonContainerBox.append(buttonContainer);
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

export default QuickDeleteButtons;
