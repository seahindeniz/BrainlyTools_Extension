import DeleteSection from "../../../components/DeleteSection";
import notification from "../../../components/notification2";
import {
  ActionList,
  ActionListHole,
  Badge,
  Button,
  ContentBox,
  ContentBoxActions,
  ContentBoxContent,
  ContentBoxTitle,
  Label,
  Spinner,
  SpinnerContainer
} from "../../../components/style-guide";
import Checkbox from "../../../components/style-guide/Checkbox";
import Icon from "../../../components/style-guide/Icon";
import Action from "../../../controllers/Req/Brainly/Action";
import Build from "../../../helpers/Build";
import generateRandomString from "../../../helpers/generateRandomString";
import InsertAfter from "../../../helpers/InsertAfter";
import IsVisible from "../../../helpers/IsVisible";

class ModerateSection {
  /**
   * @param {import("../index").QuestionSearch} main
   */
  constructor(main) {
    this.main = main;

    this.RenderSelectAll();
    this.RenderDeleteSection();
    this.RenderDeleteButton();
    this.RenderActionButtonContainer();

    if (System.checkUserP(26))
      this.RenderDeleteAllButton();

    this.Render();
    this.RenderStopButton();
    this.RenderCounterSpinner();
    this.RenderCounterLabel();
    this.ResetCounter();
    this.RenderCheckIcon();
    this.BindHandlers();
  }
  RenderSelectAll() {
    this.selectAllContainer = Label({
      html: System.data.locale.common.selectAll,
      htmlFor: generateRandomString(),
      icon: Checkbox()
    });

    this.selectAll = this.selectAllContainer.querySelector("input");
  }
  RenderDeleteSection() {
    this.deleteSection = new DeleteSection({ type: "task" });
    this.deleteSectionContainer = ContentBoxContent({
      children: this.deleteSection.container
    });
  }
  RenderDeleteButton() {
    this.deleteButtonNumberBadgeContainer = Badge({
      text: {
        text: 0
      }
    });
    this.deleteButtonNumberBadge = this.deleteButtonNumberBadgeContainer
      .querySelector("div");
    this.deleteButton = Button({
      type: "destructive",
      size: "small",
      html: `${System.data.locale.common.delete}&nbsp;`,
    });

    this.deleteButton.append(this.deleteButtonNumberBadgeContainer);

    this.deleteButtonSpinnerContainer = SpinnerContainer({
      children: this.deleteButton
    });
    this.deleteButtonContainer = ActionListHole({
      children: this.deleteButtonSpinnerContainer
    });

    this.deleteButtonSpinner = this.RenderSpinner();
  }
  RenderActionButtonContainer() {
    this.actionButtonContainer = ActionList({
      direction: "space-between",
      children: this.deleteButtonContainer
    });
  }
  RenderDeleteAllButton() {
    this.deleteAllButtonNumberBadgeContainer = Badge({
      text: {
        text: 0
      }
    });
    this.deleteAllButtonNumberBadge = this.deleteAllButtonNumberBadgeContainer
      .querySelector("div");
    this.deleteAllButton = Button({
      type: "destructive",
      size: "small",
      html: `${System.data.locale.common.deleteAll}&nbsp;`,
    });

    this.deleteAllButton.append(this.deleteAllButtonNumberBadgeContainer);

    this.deleteAllButtonSpinnerContainer = SpinnerContainer({
      children: this.deleteAllButton
    });
    this.deleteAllButtonContainer = ActionListHole({
      children: this.deleteAllButtonSpinnerContainer
    });

    this.actionButtonContainer.append(this.deleteAllButtonContainer);

    this.deleteAllButtonSpinner = this.RenderSpinner();
  }
  Render() {
    this.container = Build(ContentBoxContent({ spacedBottom: "xlarge" }), [
      [
        ContentBox(),
        [

          ContentBoxTitle({
            align: "center",
            children: System.data.locale.common.moderating.moderate
          }),
          [
            ContentBoxContent(),
            this.selectAllContainer
          ],
          this.deleteSectionContainer,
          [
            ContentBoxActions(),
            this.actionButtonContainer
          ]
        ]
      ]
    ]);
  }
  Show() {
    this.$paginationContainer = $("> .sg-content-box__content:eq(2)", this
      .main.element);
    this.$pagination = $(`[data-test="pagination"]`, this
      .$paginationContainer);

    if (this.$pagination.length == 0)
      return console.error("Pagination cannot be found");

    this.$paginationContainer.after(this.container);

    this.selectAll.checked = false;
  }
  RenderSpinner(isLight) {
    return Spinner({
      overlay: true,
      size: "xsmall",
      light: isLight
    });
  }
  RenderStopButton() {
    this.stopButton = Button({
      type: "destructive",
      size: "small",
      text: System.data.locale.common.stop
    })
    this.stopButtonSpinnerContainer = SpinnerContainer({
      children: this.stopButton
    });
    this.stopButtonContainer = ActionListHole({
      children: this.stopButtonSpinnerContainer
    });

    this.stopButtonSpinner = this.RenderSpinner();
  }
  RenderCounterSpinner() {
    this.counterSpinner = Spinner({
      size: "xxsmall"
    });
  }
  RenderCounterLabel() {
    this.counterLabel = Label({
      text: "0/0",
      icon: this.counterSpinner
    });
    this.counterText = this.counterLabel.querySelector(".sg-label__text");
    this.counterContainer = ActionListHole({
      children: this.counterLabel
    });
  }
  ResetCounter() {
    this.counter = {
      n: 0,
      max: 0
    };

    this.counterLabel.ChangeIcon(this.counterSpinner);
  }
  RenderCheckIcon() {
    this.checkIcon = Icon({
      type: "check",
      size: 14,
      color: "mint"
    });
  }
  BindHandlers() {
    this.stopButton.addEventListener("click", this.StopDeleting.bind(this));
    this.selectAll.addEventListener("click", this.ToggleCheckboxes.bind(
      this));
    this.deleteButton.addEventListener("click", this
      .DeleteSelectedQuestionsFromCurrentPage.bind(this));

    if (this.deleteAllButton)
      this.deleteAllButton.addEventListener("click", this
        .DeleteAllSelectedQuestions.bind(this));
  }
  async HideStopButton(event) {
    this.EnableDeleteButtons();

    if (event) {
      this.stopButtonSpinnerContainer.append(this.stopButtonSpinner);
      await System.Delay(600);
    }

    this.HideElement(this.stopButtonSpinner);
    this.HideElement(this.stopButtonContainer);
    this.HideDeleteButtonSpinner();
    this.HideDeleteAllButtonSpinner();
  }
  EnableDeleteButtons() {
    this.deleteButton.Enable();
    this.deleteAllButton.Enable();
  }
  /**
   * @param {HTMLElement | JQuery<HTMLElement>} $element
   */
  HideElement($element) {
    if (!$element) return;

    if ($element instanceof HTMLElement) {
      if ($element.parentElement)
        $element.parentElement.removeChild($element);
    } else if ($element instanceof jQuery)
      $element.appendTo("<div />");
  }
  ShowDeleteButtonSpinner() {
    this.deleteButtonSpinnerContainer.append(this.deleteButtonSpinner);
  }
  HideDeleteButtonSpinner() {
    this.HideElement(this.deleteButtonSpinner);
  }
  ShowDeleteAllButtonSpinner() {
    this.deleteAllButtonSpinnerContainer.append(this.deleteAllButtonSpinner);
  }
  HideDeleteAllButtonSpinner() {
    this.HideElement(this.deleteAllButtonSpinner);
  }
  ToggleCheckboxes() {
    $.each(this.main.questionBoxList, (id, questionBox) => {
      if (!questionBox.deleted && IsVisible(questionBox.checkBox))
        questionBox.checkBox.checked = this.selectAll.checked;
    });
    this.UpdateDeleteButtonsNumber();
  }
  DeleteSelectedQuestionsFromCurrentPage() {
    this.idList = this.SelectedQuestions(true);

    let isConfirmed = this.DeleteQuestions();

    if (isConfirmed)
      this.ShowDeleteButtonSpinner();
  }
  SelectedQuestions(fromCurrentPage = false) {
    let idList = [];

    $.each(this.main.questionBoxList, (id, questionBox) => {
      if (
        questionBox.checkBox.checked &&
        (
          fromCurrentPage &&
          IsVisible(questionBox.checkBox)
        ) &&
        !questionBox.deleted
      )
        idList.push(~~id);
    });

    return idList;
  }
  DeleteQuestions() {
    if (this.idList.length == 0) {
      notification({
        type: "error",
        html: System.data.locale.userContent.notificationMessages
          .selectAtLeastOneContent,
      })
    } else if (this.deleteSection.selectedReason) {
      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        // @ts-ignore
        window.isPageProcessing = true;

        this.postData = {
          reason_id: this.deleteSection.selectedReason.id,
          reason_title: this.deleteSection.selectedReason.title,
          reason: this.deleteSection.reasonText,
          give_warning: this.deleteSection.giveWarning,
          take_points: this.deleteSection.takePoints,
          return_points: this.deleteSection.returnPoints
        };

        this.ResetCounter();

        this.counter.max = this.idList.length;

        this.ShowCounter();
        this.UpdateCounterNumbers();
        this.ShowStopButton();
        this.StartDeleting();
        this._loop = setInterval(this.StartDeleting.bind(this), 1000);

        return true;
      }
    }
  }
  ShowCounter() {
    InsertAfter(this.counterContainer, this.deleteButtonContainer);
  }
  UpdateCounterNumbers() {
    this.counterText.innerHTML = `${this.counter.n}/${this.counter.max}`;
  }
  ShowStopButton() {
    this.DisableDeleteButtons();
    InsertAfter(this.stopButtonContainer, this.deleteButtonContainer);
  }
  DisableDeleteButtons() {
    this.deleteButton.Disable();
    this.deleteAllButton.Disable();
  }
  StartDeleting() {
    for (let i = 0; i < 5; i++) {
      let questionId = this.idList.shift();

      if (!questionId)
        this.StopDeleting();
      else
        this.DeleteQuestion(questionId);
    }
  }
  StopDeleting() {
    this.started = false;
    // @ts-ignore
    window.isPageProcessing = false;

    clearInterval(this._loop);
    this.counterLabel.ChangeIcon(this.checkIcon);
  }
  /**
   * @param {number} model_id
   */
  async DeleteQuestion(model_id) {
    /**
     * @type {import("./QuestionBox").default}
     */
    let questionBox = this.main.questionBoxList[model_id];
    questionBox.deleted = true;
    let postData = {
      ...this.postData,
      model_id
    };

    questionBox.ShowSpinner();
    questionBox.DisableCheckbox();

    //let resRemove = await new Action().HelloWorld();
    let resRemove = await new Action().RemoveQuestion(postData);

    this.counter.n++;
    this.UpdateCounterNumbers();

    questionBox.HideSpinner();

    if (!resRemove || !resRemove.success) {
      questionBox.deleted = false;

      questionBox.$.addClass("warning");
      questionBox.checkBox.disabled = false;
      notification({
        type: "error",
        html: `#${model_id} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`,
      });
    } else {
      questionBox.Deleted();

      if (this.counter.n == this.counter.max) {
        this.HideStopButton();
        this.UpdateDeleteButtonsNumber();
      }
    }
  }
  DeleteAllSelectedQuestions() {
    this.idList = this.SelectedQuestions();

    let isConfirmed = this.DeleteQuestions();

    if (isConfirmed)
      this.ShowDeleteAllButtonSpinner();
  }
  UpdateDeleteButtonsNumber() {
    this.UpdateDeleteButtonNumber();
    this.UpdateDeleteAllButtonNumber();
  }
  UpdateDeleteButtonNumber() {
    let idList = this.SelectedQuestions(true);

    this.deleteButtonNumberBadge.innerText = String(idList.length);
  }
  UpdateDeleteAllButtonNumber() {
    if (this.deleteAllButtonNumberBadge) {
      let idList = this.SelectedQuestions();

      this.deleteAllButtonNumberBadge.innerText = String(idList.length);
    }
  }
}

export default ModerateSection
