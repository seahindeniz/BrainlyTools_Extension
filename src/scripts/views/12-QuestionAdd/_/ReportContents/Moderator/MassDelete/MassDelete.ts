import {
  RemoveQuestionReqDataType,
  RemoveAnswerReqDataType,
  RemoveCommentReqDataType,
} from "@BrainlyAction";
import notification from "@components/notification2";
import HideElement from "@root/helpers/HideElement";
import { Button, Flex } from "@style-guide";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import ActionSection from "../ActionSection";
import type ModeratorClassType from "../Moderator";
import MassDeleteDeleteSection from "./MassDeleteDeleteSection";

export default class MassDeleteSection extends ActionSection {
  deleteSection: {
    all: (
      | MassDeleteDeleteSection
      | MassDeleteDeleteSection
      | MassDeleteDeleteSection
    )[];
    byContentType: {
      Question?: MassDeleteDeleteSection;
      Answer?: MassDeleteDeleteSection;
      Comment?: MassDeleteDeleteSection;
    };
  };

  #container: import("@style-guide/Flex").FlexElementType;
  deleteButton?: Button;
  dataMap: {
    [contentType in ContentNameType]?:
      | RemoveQuestionReqDataType
      | RemoveAnswerReqDataType
      | RemoveCommentReqDataType;
  };

  constructor(main: ModeratorClassType) {
    super(
      main,
      {
        type: "outline",
        children: System.data.locale.common.delete,
      },
      {
        type: "outline",
        toggle: "peach",
      },
    );

    this.deleteSection = {
      all: [],
      byContentType: {},
    };
  }

  get container() {
    if (!this.#container) {
      this.RenderContainer();
    }

    return this.#container;
  }

  private RenderContainer() {
    this.#container = Flex({ direction: "column", marginTop: "xs" });
  }

  async ActionButtonClicked() {
    if (this.moderating) return;

    if (this.main.selectedActionSection === this) {
      this.Hide();
      this.main.HideStopButtonContainer();

      return;
    }

    this.contents = this.main.main.contents.filtered.filter(
      content => content.has !== "reserved" && content.has !== "deleted",
    );

    if (this.contents.length === 0) {
      notification({
        type: "info",
        text:
          System.data.locale.reportedContents.massModerate.delete
            .noContentToDelete,
      });

      return;
    }

    await this.HighlightActionButton();
    this.RenderDeleteSections();
  }

  Hide() {
    HideElement(this.#container);
    super.Hide();
  }

  async RenderDeleteSections() {
    this.RenderDeleteSection("Question");
    this.RenderDeleteSection("Answer");
    this.RenderDeleteSection("Comment");
    this.ShowContainer();
    this.TryToShowDeleteButton();
  }

  ShowContainer() {
    if (Object.keys(this.deleteSection).length === 0) return;

    this.main.container.append(this.#container);
  }

  RenderDeleteSection(contentType: ContentNameType) {
    if (!this.contents.some(content => content.contentType === contentType)) {
      if (this.deleteSection[contentType]) {
        HideElement(this.deleteSection[contentType].container);

        this.deleteSection[contentType] = null;
      }

      return;
    }

    if (this.deleteSection.byContentType[contentType]) return;

    const deleteSection = new MassDeleteDeleteSection(this, contentType);
    this.deleteSection.byContentType[contentType] = deleteSection;

    this.deleteSection.all.push(deleteSection);

    this.container.append(deleteSection.container);
  }

  TryToShowDeleteButton() {
    if (
      !this.deleteSection.all.some(
        section => section.deleteSection.reasonSection?.selectedRadio,
      )
    ) {
      this.HideDeleteButton();

      return;
    }

    this.main.ShowStopButtonContainer();

    if (!this.deleteButton) {
      this.RenderDeleteButton();
    }

    this.main.stopButtonContainer.append(this.deleteButton.element);
  }

  HideDeleteButton() {
    HideElement(this.deleteButton?.element);
  }

  RenderDeleteButton() {
    this.deleteButton = new Button({
      type: "solid-peach",
      onClick: this.StartDeleting.bind(this),
      children: System.data.locale.common.delete,
    });
  }

  async StartDeleting() {
    this.dataMap = {};

    Object.entries(this.deleteSection.byContentType).forEach(
      ([contentType, section]: [ContentNameType, MassDeleteDeleteSection]) => {
        this.dataMap[contentType] = section.deleteSection.PrepareData();
      },
    );

    this.contents = this.contents.filter(
      content => !!this.dataMap[content.contentType],
    );

    if (
      !confirm(
        System.data.locale.reportedContents.massModerate.delete.confirmDeletion.replace(
          /%\{n}/gi,
          `${this.contents.length}`,
        ),
      )
    )
      return;

    await this.Moderating();

    this.TryToDelete();

    this.loopTryToModerate = window.setInterval(
      this.TryToDelete.bind(this),
      1000,
      // 360,
    );
  }

  Moderating() {
    this.HideDeleteButton();

    return super.Moderating();
  }

  TryToDelete() {
    const contents = this.contents.splice(0, 7);

    if (contents.length === 0) {
      this.StopModerating();

      return;
    }

    contents.forEach(async content => {
      await content.ExpressDelete(this.dataMap[content.contentType]);
      // await System.TestDelay();
      // content.Deleted();

      if (content.has === "failed")
        this.main.main.statusBar.IncreaseNumberOfFailed();
      else this.main.main.statusBar.IncreaseNumberOfModeration();

      if (this.contents.length > 0) return;

      await System.Delay(50);
      this.FinishModerating();
    });
  }

  StopModerating() {
    this.TryToShowDeleteButton();
    super.StopModerating();
  }
}
