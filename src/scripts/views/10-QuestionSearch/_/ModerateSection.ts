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
  Label,
  Spinner,
  SpinnerContainer,
  Text,
} from "@style-guide";
import type QuestionSearch from "..";
import DeleteSection from "@components/DeleteSection";
import notification from "@components/notification2";
import Action, {
  RemoveQuestionReqDataType,
} from "../../../../controllers/Req/Brainly/Action";
import Build from "@root/helpers/Build";
import InsertAfter from "../../../../helpers/InsertAfter";
import IsVisible from "../../../../helpers/IsVisible";
import type QuestionBox from "./QuestionBox";

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
  container: HTMLElement;
  counterContainer: HTMLElement;
  counterIconContainer: HTMLElement;
  counterText: HTMLElement;

  counter: {
    n: number;
    max: number;
  };

  idList: number[];

  postData: RemoveQuestionReqDataType;

  loopStartDeleting: number;
  started: boolean;

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
    this.selectAllContainer = Label({
      type: "transparent",
      containerTag: "label",
      icon: checkboxContainer,
      htmlFor: checkboxContainer.inputId,
      text: System.data.locale.common.selectAll,
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
      size: "s",
      type: "solid-light",
      toggle: "peach",
      html: System.data.locale.common.delete,
      icon: this.deleteButtonCounter = Text({
        html: "0",
        weight: "bold",
        fixPosition: true,
      }),
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
      size: "s",
      html: System.data.locale.common.deleteAcross,
      icon: this.deleteAllButtonCounter = Text({
        html: "0",
        weight: "bold",
        fixPosition: true,
      }),
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

  async Show() {
    const paginationContainer = this.main.element.querySelector(
      ":scope > div > .sg-content-box__content:nth-child(3)",
    );
    const pagination = paginationContainer.querySelector(
      `[data-test="pagination"]`,
    );

    if (!pagination) {
      // eslint-disable-next-line no-console
      console.error("Pagination cannot be found");

      return;
    }

    InsertAfter(this.container, paginationContainer);

    this.selectAll.checked = false;
  }

  RenderStopButton() {
    this.stopButton = new Button({
      type: "solid-peach",
      size: "s",
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

  async HideStopButton(event?: Event) {
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
    Object.values(this.main.questionBoxList).forEach(
      (questionBox: QuestionBox) => {
        if (!questionBox.deleted && IsVisible(questionBox.checkBox, true))
          questionBox.checkBox.checked = this.selectAll.checked;
      },
    );
    this.UpdateDeleteButtonsNumber();
  }

  DeleteSelectedQuestionsFromCurrentPage() {
    this.idList = this.SelectedQuestions(true);

    const isConfirmed = this.DeleteQuestions();

    if (isConfirmed) this.ShowDeleteButtonSpinner();
  }

  SelectedQuestions(fromCurrentPage?: boolean) {
    const idList = [];

    Object.entries(this.main.questionBoxList).forEach(
      ([id, questionBox]: [string, QuestionBox]) => {
        if (
          questionBox.checkBox.checked &&
          !questionBox.deleted &&
          (!fromCurrentPage || IsVisible(questionBox.checkBox, true))
        )
          idList.push(Number(id));
      },
    );

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

    if (
      !this.deleteSection.selectedReason ||
      !confirm(System.data.locale.common.moderating.doYouWantToDelete)
    )
      return false;

    window.isPageProcessing = true;

    this.postData = {
      model_id: undefined,
      reason_id: this.deleteSection.selectedReason.id,
      // @ts-expect-error
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
    this.loopStartDeleting = window.setInterval(
      this.StartDeleting.bind(this),
      1000,
    );

    return true;
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

    clearInterval(this.loopStartDeleting);
    this.HideElement(this.counterSpinner);
    this.counterIconContainer.append(this.checkIcon.element);
  }

  async DeleteQuestion(modelId: number) {
    /**
     * @type {import("./QuestionBox").default}
     */
    const questionBox = this.main.questionBoxList[modelId];
    questionBox.deleted = true;
    const postData = {
      ...this.postData,
      model_id: modelId,
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
        html: `#${modelId} > ${System.data.locale.common.notificationMessages.somethingWentWrong}`,
      });
    } else {
      questionBox.Deleted();

      if (this.counter.n === this.counter.max) {
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
