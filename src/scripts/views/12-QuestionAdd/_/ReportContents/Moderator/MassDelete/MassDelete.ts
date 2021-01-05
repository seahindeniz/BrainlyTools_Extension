import {
  RemoveAnswerReqDataType,
  RemoveCommentReqDataType,
  RemoveQuestionReqDataType,
} from "@BrainlyAction";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import notification from "@components/notification2";
import HideElement from "@root/helpers/HideElement";
import { Flex } from "@style-guide";
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
      {
        type: "solid-peach",
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

  async ActionButtonSelected() {
    this.UpdateFilteredContentsStore();

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
    this.HideModerateButtons();
    super.Hide();
  }

  async RenderDeleteSections() {
    this.RenderDeleteSection("Question");
    this.RenderDeleteSection("Answer");
    this.RenderDeleteSection("Comment");
    this.ShowContainer();
    this.TryToShowModerateButtons();
  }

  ShowContainer() {
    if (this.deleteSection.all.length === 0) return;

    this.main.container.append(this.#container);
  }

  RenderDeleteSection(contentType: ContentNameType) {
    if (
      !System.checkUserP([
        18,
        contentType === "Question" ? 42 : contentType === "Answer" ? 43 : 44,
      ]) ||
      !this.contents.some(content => content.contentType === contentType)
    ) {
      if (this.deleteSection.byContentType[contentType]) {
        HideElement(this.deleteSection.byContentType[contentType].container);

        this.deleteSection.byContentType[contentType] = null;

        const sectionIndex = this.deleteSection.all.findIndex(
          section => section.contentType === contentType,
        );

        this.deleteSection.all.splice(sectionIndex, 1);
      }

      return;
    }

    if (this.deleteSection.byContentType[contentType]) return;

    const deleteSection = new MassDeleteDeleteSection(this, contentType);

    this.deleteSection.byContentType[contentType] = deleteSection;

    this.deleteSection.all.push(deleteSection);

    this.container.append(deleteSection.container);
  }

  TryToShowModerateButtons() {
    if (
      !this.deleteSection.all.some(
        section => section.deleteSection.reasonSection?.selectedRadio,
      )
    ) {
      this.HideModerateButtons();

      return;
    }

    this.ShowModerateButtons();
  }

  async StartModerating() {
    this.dataMap = {};

    Object.entries(this.deleteSection.byContentType).forEach(
      ([contentType, section]: [ContentNameType, MassDeleteDeleteSection]) => {
        if (!section) return;

        this.dataMap[contentType] = section.deleteSection.PrepareData();
      },
    );

    this.moderatableContents = this.moderatableContents.filter(
      content =>
        !!this.dataMap[content.contentType] &&
        System.checkUserP(
          content.contentType === "Question"
            ? 42
            : content.contentType === "Answer"
            ? 43
            : 44,
        ),
    );

    if (this.moderatableContents.length === 0) {
      notification({
        type: "info",
        text:
          System.data.locale.reportedContents.massModerate.delete
            .noContentToDelete,
      });
      this.EnableModerateButtons();

      return;
    }

    const nonConfirmedContents = this.moderatableContents.filter(
      content => content.has !== "confirmed",
    );

    const confirmedContentsLength =
      this.moderatableContents.length - nonConfirmedContents.length;

    if (
      confirmedContentsLength > 0 &&
      !confirm(
        System.data.locale.reportedContents.massModerate.delete.warnAboutConfirmedContents
          .replace(/%\{N_of_confirmed}/gi, String(confirmedContentsLength))
          .replace(
            /%\{N_of_filtered}/gi,
            String(this.moderatableContents.length),
          ),
      )
    ) {
      this.moderatableContents = nonConfirmedContents;
    }

    if (
      !confirm(
        System.data.locale.reportedContents.massModerate.delete.confirmDeletion.replace(
          /%\{n}/gi,
          `${this.moderatableContents.length}`,
        ),
      )
    ) {
      this.EnableModerateButtons();

      return;
    }

    await this.Moderating();

    this.TryToDeleteContents();

    this.loopTryToModerate = window.setInterval(
      this.TryToDeleteContents.bind(this),
      1000,
      // 360,
    );
  }

  Moderating() {
    this.deleteSection.all.forEach(deleteSection => {
      deleteSection.deleteSection.Disable();
    });

    return super.Moderating();
  }

  TryToDeleteContents() {
    const contents = this.moderatableContents.splice(0, 4);

    if (contents.length === 0) {
      this.StopModerating();

      return;
    }

    contents.forEach(async content => {
      await content.ExpressDelete(this.dataMap[content.contentType]);
      // console.log(this.dataMap[content.contentType]);
      // await System.TestDelay(800, 1500);
      // content.Deleted();

      this.ContentModerated(content);
    });
  }

  StopModerating() {
    this.deleteSection.all.forEach(deleteSection => {
      deleteSection.deleteSection.Enable();
    });
    super.StopModerating();
    this.TryToShowModerateButtons();
    this.HighlightActionButton();
  }

  protected SelectedContentTypes() {
    return this.deleteSection.all
      .filter(section => section.deleteSection.IsSelected())
      .map(section => section.contentType);
  }

  UpdateModerateButtonNumbers() {
    const selectedContentTypes = this.SelectedContentTypes();

    this.moderateVisibleContentsNumberText.nodeValue = String(
      this.VisibleContents(selectedContentTypes).length,
    );
    this.moderateFilteredContentsNumberText.nodeValue = String(
      this.FilteredContents(selectedContentTypes).length,
    );
  }

  RenameModerateButtons() {
    let selector = "contents";
    const selectedContentTypes = this.SelectedContentTypes();

    if (selectedContentTypes.length === 1) {
      const [selectedContentType] = selectedContentTypes;

      selector =
        selectedContentType === "Answer"
          ? "answers"
          : selectedContentType === "Comment"
          ? "comments"
          : selectedContentType === "Question"
          ? "questions"
          : "";
    }

    if (!selector) return;

    this.moderateVisibleContentsButton.ChangeChildren(
      System.data.locale.reportedContents.massModerate.visible[selector],
    );

    this.moderateFilteredContentsButton.ChangeChildren(
      System.data.locale.reportedContents.massModerate.filtered[selector],
    );
  }
}
