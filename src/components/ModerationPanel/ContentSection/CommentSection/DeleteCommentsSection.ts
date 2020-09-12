import type { RemoveCommentReqDataType } from "@BrainlyAction";
import DeleteSection from "@components/DeleteSection2/DeleteSection";
import Build from "@root/helpers/Build";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Button, Flex } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type CommentClassType from "./Comment";
import type CommentSectionClassType from "./CommentSection";

export default class DeleteCommentsSection {
  main: CommentSectionClassType;

  container: FlexElementType;
  deleteSection: DeleteSection;
  deleteSectionContainer: FlexElementType;
  removableComments: CommentClassType[];
  deletionData: RemoveCommentReqDataType;
  deleteButtonSpinner: HTMLDivElement;
  loopTryToDeleteComments: number;
  stopButton: Button;
  stopButtonContainer: FlexElementType;
  removableCommentsLength: number;

  constructor(main: CommentSectionClassType) {
    this.main = main;

    this.Render();
  }

  Render() {
    this.container = Build(Flex({ direction: "column" }), [
      [
        Flex({ alignSelf: "flex-end" }),
        new Button({
          size: "s",
          type: "solid-peach",
          onClick: this.ToggleDeleteSection.bind(this),
          children: System.data.locale.moderationPanel.deleteAllComments,
        }),
      ],
    ]);

    this.main.container.prepend(this.container);
  }

  ToggleDeleteSection() {
    if (!IsVisible(this.deleteSectionContainer)) {
      this.OpenDeleteSection();
    } else {
      this.HideDeleteSection();
    }
  }

  OpenDeleteSection() {
    // if (this.data.deleted || this.main.main.deleted) return;

    if (!this.deleteSection) {
      this.RenderDeleteSection();
    }

    this.container.append(this.deleteSectionContainer);
  }

  HideDeleteSection() {
    HideElement(this.deleteSectionContainer);
  }

  RenderDeleteSection() {
    this.deleteSection = new DeleteSection({
      defaults: {
        contentType: "Comment",
      },
      listeners: {
        onDeleteButtonClick: this.DeleteSectionButtonClicked.bind(this),
      },
    });
    this.deleteSectionContainer = Flex({
      tag: "div",
      marginTop: "xs",
      direction: "column",
      children: this.deleteSection.container,
    });
  }

  DeleteSectionButtonClicked() {
    this.removableComments = this.main.comments.filter(comment => {
      return !comment.data.deleted;
    });
    this.removableCommentsLength = this.removableComments.length;

    if (
      !confirm(
        System.data.locale.moderationPanel.confirmDeletingNComments.replace(
          /%{N}/g,
          String(this.removableCommentsLength),
        ),
      )
    )
      return;
    // this.ConfirmDeletion(this.deleteSection.PrepareData());

    this.StartDeleting();
  }

  StartDeleting() {
    this.deletionData = this.deleteSection.PrepareData();

    this.ShowStopButton();
    this.TryToDeleteComments();
    this.loopTryToDeleteComments = window.setInterval(
      this.TryToDeleteComments.bind(this),
      1000,
    );
  }

  ShowStopButton() {
    if (!this.stopButtonContainer) {
      this.RenderStopButton();
    }

    HideElement(this.deleteSection.deleteButton.element);
    this.deleteSection.buttonContainer.append(this.stopButtonContainer);
  }

  HideStopButton() {
    this.deleteSection.buttonContainer.append(
      this.deleteSection.deleteButton.element,
    );
    HideElement(this.stopButtonContainer);
  }

  RenderStopButton() {
    this.stopButtonContainer = Flex({
      marginLeft: "s",
      children: this.stopButton = new Button({
        type: "solid",
        onClick: this.StopDeleting.bind(this),
        children: System.data.locale.common.stop,
      }),
    });
  }

  StopDeleting() {
    clearInterval(this.loopTryToDeleteComments);
  }

  TryToDeleteComments() {
    const removableComments = this.removableComments.splice(0, 7);

    if (removableComments.length === 0) {
      this.StopDeleting();

      return;
    }

    removableComments.forEach(async comment => {
      // await System.TestDelay();
      // comment.Deleted();
      await comment.Delete(this.deletionData);
      --this.removableCommentsLength;

      if (this.removableCommentsLength > 0) return;

      this.FinishDeleting();
    });
  }

  FinishDeleting() {
    this.StopDeleting();
    this.Hide();
  }

  Hide() {
    HideElement(this.container);

    this.main.deleteCommentsSection = null;
  }
}
