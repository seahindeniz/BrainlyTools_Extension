// @flow

import {
  ActionList,
  ActionListHole,
  Button,
  Checkbox,
  ContentBox,
  ContentBoxActions,
  ContentBoxContent,
  ContentBoxTitle,
  Flex,
  Icon,
  LabelDeprecated,
  Spinner,
  SpinnerContainer,
  Text,
} from "@style-guide";
import type { QuestionSearch } from "..";
import DeleteSection from "../../../components/DeleteSection";
import notification from "../../../components/notification2";
import Action from "../../../controllers/Req/Brainly/Action";
import Build from "../../../helpers/Build";
import InsertAfter from "../../../helpers/InsertAfter";
import IsVisible from "../../../helpers/IsVisible";

function RenderSpinner(isLight?: boolean) {
  return Spinner({
    overlay: true,
    size: "xsmall",
    light: isLight,
  });
}

class ModerateSection {
  main: QuestionSearch;
  selectAllContainer: HTMLDivElement;
  selectAll: HTMLInputElement;
  deleteSection: DeleteSection;
  deleteSectionContainer: HTMLDivElement;
  deleteButtonNumberBadge: HTMLDivElement;

  deleteButtonSpinnerContainer: HTMLDivElement;
  deleteButtonContainer: HTMLDivElement;
  deleteButtonSpinner: HTMLDivElement;
  actionButtonContainer: HTMLDivElement;
  deleteAllButtonSpinnerContainer: HTMLDivElement;
  deleteAllButtonContainer: HTMLDivElement;
  deleteAllButtonSpinner: HTMLDivElement;
  container: HTMLDivElement;

  $paginationContainer: any;
  $pagination: any;

  deleteButton: Button;
  deleteAllButton: Button;
  stopButton: Button;
  stopButtonSpinnerContainer: HTMLDivElement;
  stopButtonContainer: HTMLDivElement;
  stopButtonSpinner: HTMLDivElement;
  counterSpinner: HTMLDivElement;
  checkIcon: Icon;
  counterLabel: HTMLDivElement;
  deleteButtonCounter: HTMLElement;
  deleteAllButtonCounter: HTMLElement;

  constructor(main: QuestionSearch) {
    this.main = main;

    this.RenderSelectAll();
    this.RenderDeleteSection();
    this.RenderDeleteButton();
    this.RenderActionButtonContainer();

    if (System.checkUserP(26)) this.RenderDeleteAllButton();

    this.Render();
    this.RenderStopButton();
    this.RenderCounterSpinner();
    this.RenderCounterLabel();
    this.ResetCounter();
    this.RenderCheckIcon();
    this.BindHandlers();
  }

  RenderSelectAll() {
    const checkboxContainer = Checkbox();
    this.selectAllContainer = LabelDeprecated({
      html: System.data.locale.common.selectAll,
      htmlFor: checkboxContainer.inputId,
      icon: checkboxContainer,
    });

    this.selectAll = this.selectAllContainer.querySelector("input");
  }

  RenderDeleteSection() {
    this.deleteSection = new DeleteSection({ type: "question" });
    this.deleteSectionContainer = ContentBoxContent({
      children: this.deleteSection.container,
    });
  }

  RenderDeleteButton() {
    this.deleteButton = new Button({
      size: "small",
      type: "solid-light",
      toggle: "peach",
      html: System.data.locale.common.delete,
      icon: (this.deleteButtonCounter = Text({
        html: "0",
        weight: "bold",
        fixPosition: true,
      })),
    });

    this.deleteButtonSpinnerContainer = SpinnerContainer({
      children: this.deleteButton.element,
    });
    this.deleteButtonContainer = ActionListHole({
      children: this.deleteButtonSpinnerContainer,
    });

    this.deleteButtonSpinner = RenderSpinner();
  }

  RenderActionButtonContainer() {
    this.actionButtonContainer = ActionList({
      direction: "space-between",
      children: this.deleteButtonContainer,
    });
  }

  RenderDeleteAllButton() {
    this.deleteAllButton = new Button({
      type: "solid-light",
      toggle: "peach",
      size: "small",
      html: System.data.locale.common.deleteAcross,
      icon: (this.deleteAllButtonCounter = Text({
        html: "0",
        weight: "bold",
        fixPosition: true,
      })),
    });

    this.deleteAllButtonSpinnerContainer = SpinnerContainer({
      children: this.deleteAllButton.element,
    });
    this.deleteAllButtonContainer = ActionListHole({
      children: this.deleteAllButtonSpinnerContainer,
    });

    this.actionButtonContainer.append(this.deleteAllButtonContainer);

    this.deleteAllButtonSpinner = RenderSpinner();
  }

  Render() {
    this.container = Build(ContentBoxContent({ spacedBottom: "xlarge" }), [
      [
        ContentBox(),
        [
          ContentBoxTitle({
            align: "center",
            children: System.data.locale.common.moderating.moderate,
          }),
          [ContentBoxContent(), this.selectAllContainer],
          this.deleteSectionContainer,
          [ContentBoxActions(), this.actionButtonContainer],
        ],
      ],
    ]);
  }

  Show() {
    this.$paginationContainer = $(
      "> .sg-content-box__content:eq(2)",
      this.main.element,
    );
    this.$pagination = $(`[data-test="pagination"]`, this.$paginationContainer);

    if (this.$pagination.length === 0) {
      console.error("Pagination cannot be found");
      return;
    }

    this.$paginationContainer.after(this.container);

    this.selectAll.checked = false;
  }

  RenderStopButton() {
    this.stopButton = new Button({
      type: "solid-peach",
      size: "small",
      text: System.data.locale.common.stop,
    });
    this.stopButtonSpinnerContainer = SpinnerContainer({
      children: this.stopButton.element,
    });
    this.stopButtonContainer = ActionListHole({
      children: this.stopButtonSpinnerContainer,
    });

    this.stopButtonSpinner = RenderSpinner();
  }

  RenderCounterSpinner() {
    this.counterSpinner = Spinner({
      size: "xxsmall",
    });
  }

  RenderCounterLabel() {
    this.counterContainer = Build(ActionListHole(), [
      [
        Flex(),
        [
          [
            (this.counterIconContainer = Flex({
              marginRight: "xxs",
            })),
            this.counterSpinner,
          ],
          [
            Flex({ alignItems: "center" }),
            (this.counterText = Text({
              text: "0/0",
              weight: "bold",
              fixPosition: true,
            })),
          ],
        ],
      ],
    ]);
  }

  ResetCounter() {
    this.counter = {
      n: 0,
      max: 0,
    };

    this.counterIconContainer.append(this.counterSpinner);
  }

  RenderCheckIcon() {
    this.checkIcon = new Icon({
      type: "check",
      size: 24,
      color: "mint",
    });
  }

  BindHandlers() {
    this.stopButton.element.addEventListener(
      "click",
      this.StopDeleting.bind(this),
    );
    this.selectAll.addEventListener("click", this.ToggleCheckboxes.bind(this));
    this.deleteButton.element.addEventListener(
      "click",
      this.DeleteSelectedQuestionsFromCurrentPage.bind(this),
    );

    if (this.deleteAllButton)
      this.deleteAllButton.element.addEventListener(
        "click",
        this.DeleteAllSelectedQuestions.bind(this),
      );
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

    if (this.deleteAllButton) this.deleteAllButton.Enable();
  }

  // eslint-disable-next-line class-methods-use-this
  HideElement(element: HTMLElement) {
    if (!element || !element.parentElement) return;

    element.parentElement.removeChild(element);
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
    Object.values(this.main.questionBoxList).forEach(questionBox => {
      if (!questionBox.deleted && IsVisible(questionBox.checkBox, true))
        questionBox.checkBox.checked = this.selectAll.checked;
    });
    this.UpdateDeleteButtonsNumber();
  }

  DeleteSelectedQuestionsFromCurrentPage() {
    this.idList = this.SelectedQuestions(true);

    const isConfirmed = this.DeleteQuestions();

    if (isConfirmed) this.ShowDeleteButtonSpinner();
  }

  SelectedQuestions(fromCurrentPage?: boolean) {
    const idList = [];

    Object.entries(this.main.questionBoxList).forEach(([id, questionBox]) => {
      if (
        questionBox.checkBox.checked &&
        !questionBox.deleted &&
        (!fromCurrentPage || IsVisible(questionBox.checkBox, true))
      )
        idList.push(~~id);
    });

    return idList;
  }

  DeleteQuestions() {
    if (this.idList.length === 0) {
      notification({
        type: "error",
        html:
          System.data.locale.userContent.notificationMessages
            .selectAtLeastOneContent,
      });

      return false;
    }

    if (!this.deleteSection.selectedReason) return false;

    if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
      window.isPageProcessing = true;

      this.postData = {
        reason_id: this.deleteSection.selectedReason.id,
        reason_title: this.deleteSection.selectedReason.title,
        reason: this.deleteSection.reasonText,
        give_warning: this.deleteSection.giveWarning,
        take_points: this.deleteSection.takePoints,
        return_points: this.deleteSection.returnPoints,
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

    if (this.deleteAllButton) this.deleteAllButton.Disable();
  }

  StartDeleting() {
    for (let i = 0; i < 5; i++) {
      const questionId = this.idList.shift();

      if (!questionId) this.StopDeleting();
      else this.DeleteQuestion(questionId);
    }
  }

  StopDeleting() {
    this.started = false;
    window.isPageProcessing = false;

    clearInterval(this._loop);
    this.HideElement(this.counterSpinner);
    this.counterIconContainer.append(this.checkIcon.element);
  }

  /**
   * @param {number} model_id
   */
  async DeleteQuestion(model_id) {
    /**
     * @type {import("./QuestionBox").default}
     */
    const questionBox = this.main.questionBoxList[model_id];
    questionBox.deleted = true;
    const postData = {
      ...this.postData,
      model_id,
    };

    questionBox.ShowSpinner();
    questionBox.DisableCheckbox();

    // const resRemove = await new Action().HelloWorld();
    const resRemove = await new Action().RemoveQuestion(postData);

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

    const isConfirmed = this.DeleteQuestions();

    if (isConfirmed) this.ShowDeleteAllButtonSpinner();
  }

  UpdateDeleteButtonsNumber() {
    this.UpdateDeleteButtonNumber();
    this.UpdateDeleteAllButtonNumber();
  }

  UpdateDeleteButtonNumber() {
    const idList = this.SelectedQuestions(true);

    this.deleteButtonCounter.innerText = String(idList.length);
  }

  UpdateDeleteAllButtonNumber() {
    if (!this.deleteAllButton) return;

    const idList = this.SelectedQuestions();

    this.deleteAllButtonCounter.innerText = String(idList.length);
  }
}

export default ModerateSection;
