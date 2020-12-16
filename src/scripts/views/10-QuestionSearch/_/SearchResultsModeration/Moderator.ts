import { RemoveAnswerReqDataType } from "@BrainlyAction";
import DeleteSection from "@components/DeleteSection2/DeleteSection";
import notification from "@components/notification2";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Box, Button, Checkbox, Flex, Label, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type QuestionClassType from "./Question/Question";
import type SearchResultsModerationClassType from "./SearchResultsModeration";

export default class Moderator {
  private main: SearchResultsModerationClassType;

  private deleteSection: DeleteSection;
  private container?: Box;
  private deleteButtonNumberText: Text;
  private deleteButton: Button;
  private deleteAcrossButton?: Button;
  private deleteAcrossButtonNumberText?: Text;
  private deleteButtonsContainer: FlexElementType;
  private selectAllCheckbox: Checkbox;
  private selectedQuestions: QuestionClassType[];
  private selectedQuestionsLength: number;
  private loopTryToDeleteQuestions: number;
  private deleteReqData: RemoveAnswerReqDataType;
  private stopButton: Button;

  constructor(main: SearchResultsModerationClassType) {
    this.main = main;
  }

  Show() {
    if (!this.container) {
      this.Render();
      this.RenderDeleteButton();

      if (System.checkUserP(26) && System.checkBrainlyP(102)) {
        this.RenderDeleteAcrossButton();
      }
    }

    this.main.searchResultContainerWrapper.append(this.container.element);
  }

  Hide() {
    HideElement(this.container?.element);
  }

  private Render() {
    this.deleteSection = new DeleteSection({
      defaults: { contentType: "Question" },
      actionButton: (this.deleteButtonsContainer = Flex({
        fullWidth: true,
        justifyContent: "space-around",
        marginTop: "s",
      })),
    });

    this.selectAllCheckbox = new Checkbox({
      id: null,
      onChange: this.SelectAllCheckboxes.bind(this),
    });

    this.container = Build(
      new Box({
        border: true,
        borderColor: "gray-secondary-lightest",
        padding: "m",
        color: "light",
      }),
      [
        [
          Flex({ direction: "column" }),
          [
            [
              Flex({
                justifyContent: "center",
                marginBottom: "xs",
              }),
              Text({
                size: "large",
                weight: "bold",
                transform: "uppercase",
                children: System.data.locale.common.moderating.moderate,
              }),
            ],
            [
              Flex({
                direction: "column",
                marginBottom: "s",
                marginTop: "s",
              }),
              [
                [
                  Flex(),
                  new Label({
                    tag: "label",
                    type: "transparent",
                    children: System.data.locale.common.selectAll,
                    icon: this.selectAllCheckbox.element,
                  }),
                ],
                [
                  Flex({
                    marginTop: "xxs",
                  }),
                  new Button({
                    type: "outline",
                    toggle: "blue",
                    size: "xs",
                    children: System.data.locale.common.toggleSelections,
                    onClick: this.ToggleCheckboxes.bind(this),
                  }),
                ],
              ],
            ],
            this.deleteSection.container,
          ],
        ],
      ],
    );
  }

  private RenderDeleteButton() {
    this.deleteButtonNumberText = document.createTextNode("0");

    const numberLabel = new Label({
      color: "achromatic",
      children: this.deleteButtonNumberText,
    });

    this.deleteButton = new Button({
      children: System.data.locale.common.delete,
      icon: numberLabel.element,
      onClick: this.DeleteSelectedQuestions.bind(this),
      reversedOrder: true,
      size: "s",
      type: "solid-peach",
    });

    this.deleteButtonsContainer.append(this.deleteButton.element);
  }

  private RenderDeleteAcrossButton() {
    this.deleteAcrossButtonNumberText = document.createTextNode("0");

    const numberLabel = new Label({
      color: "achromatic",
      children: this.deleteAcrossButtonNumberText,
    });

    this.deleteAcrossButton = new Button({
      children: System.data.locale.common.deleteAcross,
      icon: numberLabel.element,
      onClick: this.DeleteSelectedQuestionsAcrossPages.bind(this),
      reversedOrder: true,
      size: "s",
      type: "solid-peach",
    });

    this.deleteButtonsContainer.append(this.deleteAcrossButton.element);
  }

  private SelectAllCheckboxes() {
    this.main.questions.all.forEach(question => {
      if (question.deleted) return;

      question.checkbox.input.checked = this.selectAllCheckbox.input.checked;
    });

    this.UpdateButtonNumbers();
  }

  private ToggleCheckboxes() {
    this.main.questions.all.forEach(question => {
      if (question.deleted) return;

      question.checkbox.input.checked = !question.checkbox.input.checked;
    });

    this.UpdateButtonNumbers();
  }

  private DeleteSelectedQuestions() {
    this.selectedQuestions = this.FilterSelectedQuestions(true);
    this.ConfirmDeletion();
  }

  private DeleteSelectedQuestionsAcrossPages() {
    this.selectedQuestions = this.FilterSelectedQuestions();
    this.ConfirmDeletion();
  }

  UpdateButtonNumbers() {
    if (!this.deleteButtonNumberText) return;

    const selectedQuestions = this.FilterSelectedQuestions(true);

    this.deleteButtonNumberText.nodeValue = String(selectedQuestions.length);

    if (!this.deleteAcrossButtonNumberText) return;

    const selectedQuestionsAcrossPages = this.FilterSelectedQuestions();

    this.deleteAcrossButtonNumberText.nodeValue = String(
      selectedQuestionsAcrossPages.length,
    );
  }

  FilterSelectedQuestions(visibleQuestionsOnly?: boolean) {
    const selectedQuestions = this.main.questions.all.filter(
      question =>
        question.checkbox.input.checked &&
        !question.deleted &&
        (!visibleQuestionsOnly || IsVisible(question.container)),
    );

    return selectedQuestions;
  }

  private ConfirmDeletion() {
    this.selectedQuestionsLength = this.selectedQuestions.length;

    if (this.selectedQuestionsLength === 0) {
      notification({
        type: "info",
        text: System.data.locale.questionSearch.selectAtLeastOneQuestion,
      });

      return;
    }

    if (
      !confirm(
        System.data.locale.questionSearch.doYouWantToDeleteSelectedQuestions.replace(
          /%{N}/g,
          String(this.selectedQuestionsLength),
        ),
      )
    )
      return;

    this.StartDeletingQuestions();
  }

  private StartDeletingQuestions() {
    this.deleteReqData = this.deleteSection.PrepareData();

    this.ShowStopButton();
    this.TryToDeleteQuestions();
    this.loopTryToDeleteQuestions = window.setInterval(
      this.TryToDeleteQuestions.bind(this),
      1000,
    );
  }

  private ShowStopButton() {
    if (!this.stopButton) {
      this.RenderStopButton();
    }

    HideElement(this.deleteButtonsContainer);
    this.deleteSection.buttonContainer.append(this.stopButton.element);
  }

  private RenderStopButton() {
    this.stopButton = new Button({
      children: System.data.locale.common.stop,
      onClick: this.FinishDeletion.bind(this),
      type: "solid-blue",
    });
  }

  private TryToDeleteQuestions() {
    const selectedQuestions = this.selectedQuestions.splice(0, 7);

    if (!selectedQuestions) {
      this.StopDeletion();

      return;
    }

    selectedQuestions.forEach(async question => {
      await question.Delete(this.deleteReqData);

      this.selectedQuestionsLength--;

      if (this.selectedQuestionsLength === 0) {
        this.FinishDeletion();
      }
    });
  }

  private StopDeletion() {
    clearInterval(this.loopTryToDeleteQuestions);
  }

  private FinishDeletion() {
    this.StopDeletion();
    this.HideStopButton();
    this.UpdateButtonNumbers();
  }

  private HideStopButton() {
    HideElement(this.stopButton.element);
    this.deleteSection.buttonContainer.append(this.deleteButtonsContainer);
  }
}
