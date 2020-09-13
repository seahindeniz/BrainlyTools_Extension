import Build from "@root/helpers/Build";
import {
  ActionListHole,
  Avatar,
  Checkbox,
  ContentBox,
  ContentBoxContent,
  ContentBoxTitle,
  LabelDeprecated,
  Spinner,
  SpinnerContainer,
} from "@style-guide";
import Action from "@BrainlyAction";
import type QuestionSearchClassType from "..";
import QuickDeleteButtons from "../../1-Home/_/QuickDeleteButtons";

class QuestionBox {
  main: QuestionSearchClassType;
  container: HTMLElement;
  $: JQuery<HTMLElement>;
  id: number;
  deleted: boolean;
  question: any;
  user: any;
  quickDeleteButtons: QuickDeleteButtons;
  $questionLink: JQuery<HTMLElement>;
  $avatarHole: JQuery<HTMLElement>;
  iconContentBox: HTMLDivElement;
  approvedIconContainer: HTMLDivElement;
  checkBoxContainer: Checkbox;

  checkBox: any;
  checkBoxContainerHole: HTMLDivElement;
  spinnerContainer: HTMLDivElement;
  spinner: HTMLDivElement;

  constructor(main: QuestionSearchClassType, box: HTMLElement, id: number) {
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
    this.question = await new Action().GetQuestion(this.id);

    this.user = this.question.users_data.find(
      usr => usr.id === this.question.data.task.user_id,
    );

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
    const $actionList = $("> .sg-actions-list", this.$questionLink);
    this.$avatarHole = $("> .sg-actions-list__hole:eq(0)", $actionList);

    if (this.$avatarHole.length === 0) this.CreateAvatarHole();
    else {
      const $contentTextHole = $("> .sg-actions-list__hole:eq(1)", $actionList);
      const $itemContent = $(
        `> [data-test="search-item-content"]`,
        $contentTextHole,
      );
      const $contentText = $(`> div`, $itemContent);

      $contentText.appendTo(this.$questionLink);
      $actionList.appendTo($("> .sg-content-box__content", this.$));
      this.$questionLink.appendTo($contentTextHole);
      $itemContent.remove();
    }
  }

  CreateAvatarHole() {
    const $contentBox = $(`> .sg-content-box__content`, this.$questionLink);
    const $contentText = $(
      `> [data-test="search-item-content-text"]`,
      $contentBox,
    );
    const $actionList = $(`
    <div class="sg-actions-list sg-actions-list--to-top sg-actions-list--no-wrap">
      <div class="sg-actions-list__hole"></div>
      <div class="sg-actions-list__hole"></div>
    </div>`);

    this.$avatarHole = $(".sg-actions-list__hole:eq(0)", $actionList);
    const $contentTextHole = $(".sg-actions-list__hole:eq(1)", $actionList);

    $contentText.appendTo(this.$questionLink);
    this.$questionLink.appendTo($contentTextHole);
    $actionList.appendTo($("> .sg-content-box__content", this.$));
    $contentBox.remove();
  }

  PrepareAvatarContentBox() {
    const avatarURL = System.ExtractAvatarURL(this.user);
    const profileLink = System.createProfileLink(this.user);
    this.iconContentBox = Build(ContentBox(), [
      [
        ContentBoxTitle(),
        Avatar({
          spaced: true,
          link: profileLink,
          imgSrc: avatarURL,
        }),
      ],
    ]);

    const $icon = $("> *", this.$avatarHole);

    if ($icon.length > 0) {
      this.approvedIconContainer = ContentBoxContent();

      this.iconContentBox.append(this.approvedIconContainer);

      $icon.appendTo(this.approvedIconContainer);
    }

    this.$avatarHole.append(this.iconContentBox);
  }

  RenderAttachments() {
    if (this.question.data.task.attachments.length > 0) {
      const questionLink = this.$questionLink.attr("href");
      const $attachmentContainer = $(`
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
    this.checkBoxContainer = new Checkbox();
    this.checkBox = this.checkBoxContainer.input;
    this.checkBoxContainerHole = Build(ActionListHole(), [
      [
        (this.spinnerContainer = SpinnerContainer()),
        LabelDeprecated({
          type: "transparent",
          containerTag: "label",
          icon: this.checkBoxContainer.element,
          htmlFor: this.checkBoxContainer.inputId,
          text: System.data.locale.common.select,
        }),
      ],
    ]);
  }

  ShowSelectBox() {
    if (System.checkUserP([14, 26])) {
      const $seeAnswerLinkContainer = $(
        ".sg-content-box__actions > .sg-actions-list",
        this.$,
      );

      $seeAnswerLinkContainer.prepend(this.checkBoxContainerHole);
    }
  }

  RenderSpinner() {
    this.spinner = Spinner({
      overlay: true,
      size: "small",
    });
  }

  BindHandlers() {
    this.checkBox.addEventListener("change", this.CheckBoxChanged.bind(this));
  }

  CheckBoxChanged() {
    this.main.moderateSection.UpdateDeleteButtonsNumber();
  }

  ShowSpinner() {
    this.spinnerContainer.append(this.spinner);
  }

  HideSpinner() {
    this.spinnerContainer.removeChild(this.spinner);
  }

  ShowQuickDeleteButtons() {
    if (System.checkUserP(1)) {
      this.quickDeleteButtons.target = this.container;

      this.quickDeleteButtons.ShowContainer();
    }
  }

  CheckIsDeleted() {
    if (this.deleted) this.Deleted();
  }

  Deleted() {
    this.$.addClass("deleted");
  }

  DisableCheckbox() {
    this.checkBox.disabled = true;
  }
}

export default QuestionBox;
