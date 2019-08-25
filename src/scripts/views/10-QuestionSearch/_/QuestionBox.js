import { Avatar, ContentBox, ContentBoxContent, ContentBoxTitle } from "../../../components/style-guide";
import Action from "../../../controllers/Req/Brainly/Action";
import Build from "../../../helpers/Build";
import QuickDeleteButtons from "../../1-Home/_/QuickDeleteButtons";

class QuestionBox {
  /**
   * @param {import("../index").QuestionSearch} main
   * @param {HTMLElement} box
   * @param {number} id
   */
  constructor(main, box, id) {
    this.main = main;
    this.container = box;
    this.$ = $(box);
    this.id = id;
    this.deleted = false;

    this.GetQuestion();

    if (System.checkUserP([14, 26])) {
      this.RenderSelectBox();
      this.ShowSelectBox();
      this.RenderSpinner();
      this.BindHandlers();
    }
  }
  async GetQuestion() {
    this.question = await new Action().QuestionContent(this.id);

    this.user = this.question.users_data.find(usr => usr.id == this.question.data.task.user_id);

    this.RenderQuestionOwner();

    if (System.checkUserP(1))
      this.quickDeleteButtons = new QuickDeleteButtons(this.container, {
        user: this.user,
        questionId: this.id,
      });
  }
  RenderQuestionOwner() {
    this.PrepareAvatarHole();
    this.PrepareAvatarContentBox();
    this.RenderAttachments();
  }
  PrepareAvatarHole() {
    this.$questionLink = $("> .sg-content-box__content > a", this.$);
    let $actionList = $("> .sg-actions-list", this.$questionLink);
    this.$avatarHole = $("> .sg-actions-list__hole:eq(0)", $actionList);

    if (this.$avatarHole.length == 0)
      this.CreateAvatarHole();
    else {
      let $contentTextHole = $("> .sg-actions-list__hole:eq(1)", $actionList);
      let $itemContent = $(`> [data-test="search-item-content"]`, $contentTextHole);
      let $contentText = $(`> div`, $itemContent);

      $contentText.appendTo(this.$questionLink);
      $actionList.appendTo($("> .sg-content-box__content", this.$));
      this.$questionLink.appendTo($contentTextHole);
      $itemContent.remove();
    }
  }
  CreateAvatarHole() {
    let $contentBox = $(`> .sg-content-box__content`, this.$questionLink);
    let $contentText = $(`> [data-test="search-item-content-text"]`, $contentBox);
    let $actionList = $(`
    <div class="sg-actions-list sg-actions-list--to-top sg-actions-list--no-wrap">
      <div class="sg-actions-list__hole"></div>
      <div class="sg-actions-list__hole"></div>
    </div>`);

    this.$avatarHole = $(".sg-actions-list__hole:eq(0)", $actionList);
    let $contentTextHole = $(".sg-actions-list__hole:eq(1)", $actionList);

    $contentText.appendTo(this.$questionLink);
    this.$questionLink.appendTo($contentTextHole);
    $actionList.appendTo($("> .sg-content-box__content", this.$));
    $contentBox.remove();
  }
  PrepareAvatarContentBox() {
    let avatarURL = System.ExtractAvatarURL(this.user);
    let profileLink = System.createProfileLink(this.user);
    this.iconContentBox = Build(ContentBox(), [
      [
        ContentBoxTitle(),
        Avatar({
          spaced: true,
          link: profileLink,
          imgSrc: avatarURL,
        })
      ]
    ]);

    let $icon = $("> *", this.$avatarHole);

    if ($icon.length > 0) {
      this.approvedIconContainer = ContentBoxContent();

      this.iconContentBox.append(this.approvedIconContainer);

      $icon.appendTo(this.approvedIconContainer);
    }

    this.$avatarHole.append(this.iconContentBox);
  }
  RenderAttachments() {
    if (this.question.data.task.attachments.length > 0) {
      let questionLink = this.$questionLink.attr("href");
      let $attachmentContainer = $(`
      <div class="sg-content-box__content sg-content-box__content--spaced-top">
        <a data-test="feed-item-link" href="${questionLink}" class="sg-text sg-text--link-unstyled sg-text--bold">
          <div class="sg-box sg-box--gray-secondary-lightest sg-box--no-border sg-box--full sg-box--xxsmall-padding sg-box--no-min-height">
            <div class="sg-box__hole">
              <div class="sg-label sg-label--small sg-label--secondary">
                <div class="sg-label__icon">
                  <div class="sg-icon sg-icon--dark sg-icon--x14">
                    <svg class="sg-icon__svg">
                      <use xlink:href="#icon-attachment"></use>
                    </svg>
                  </div>
                </div>
                <div class="sg-label__number">${this.question.data.task.attachments.length}</div>
              </div>
            </div>
          </div>
        </a>
      </div>`);

      $attachmentContainer.appendTo(this.iconContentBox);
    }
  }
  RenderSelectBox() {
    this.$checkBoxContainerHole = $(`
    <div class="sg-actions-list__hole">
      <div class="sg-spinner-container">
        <div class="sg-label sg-label--secondary">
          <div class="sg-label__icon">
            <div class="sg-checkbox">
              <input type="checkbox" class="sg-checkbox__element" id="q-${this.id}">
              <label class="sg-checkbox__ghost" for="q-${this.id}">
                <div class="sg-icon sg-icon--adaptive sg-icon--x10">
                  <svg class="sg-icon__svg">
                    <use xlink:href="#icon-check"></use>
                  </svg>
                </div>
              </label>
            </div>
          </div>
          <label class="sg-label__text" for="q-${this.id}">${System.data.locale.common.select}</label>
        </div>
      </div>
    </div>`);

    this.$checkBoxContainer = $(".sg-checkbox", this.$checkBoxContainerHole);
    this.$checkBox = $("input", this.$checkBoxContainer);
    this.$checkBoxGhost = $(".sg-checkbox__ghost", this.$checkBoxContainer);
    this.$spinnerContainer = $(".sg-spinner-container", this.$checkBoxContainerHole);
  }
  ShowSelectBox() {
    if (System.checkUserP([14, 26])) {
      let $seeAnswerLinkContainer = $(".sg-content-box__actions > .sg-actions-list", this.$);

      this.$checkBoxContainerHole.prependTo($seeAnswerLinkContainer);
    }
  }
  RenderSpinner() {
    this.$spinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--small"></div>
    </div>`);
  }
  BindHandlers() {
    this.$checkBox.change(this.CheckBoxChanged.bind(this));
  }
  CheckBoxChanged() {
    this.main.moderateSection.UpdateDeleteButtonsNumber();
  }
  ShowSpinner() {
    this.$spinner.appendTo(this.$spinnerContainer);
  }
  HideSpinner() {
    this.$spinner.appendTo("<div />");
  }
  ShowQuickDeleteButtons() {
    if (System.checkUserP(1)) {
      this.quickDeleteButtons.target = this.$;

      this.quickDeleteButtons.ShowContainer();
    }
  }
  CheckIsDeleted() {
    if (this.deleted)
      this.Deleted();
  }
  Deleted() {
    this.$.addClass("deleted");
    this.$checkBoxContainer.removeClass("sg-checkbox--disabled");
  }
  DisableCheckbox() {
    this.$checkBox.prop("disabled", true);
    this.$checkBoxContainer.addClass("sg-checkbox--disabled");
  }
}

export default QuestionBox
