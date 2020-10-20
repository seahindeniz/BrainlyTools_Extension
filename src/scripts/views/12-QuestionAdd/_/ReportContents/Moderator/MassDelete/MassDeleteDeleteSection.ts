import DeleteSection from "@components/DeleteSection2/DeleteSection";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import Build from "@root/helpers/Build";
import { Flex, Text } from "@style-guide";
import type MassDeleteSectionClassType from "./MassDelete";

export default class MassDeleteDeleteSection {
  main: MassDeleteSectionClassType;
  contentType: ContentNameType;
  container: import("@style-guide/Flex").FlexElementType;
  deleteSection: DeleteSection;

  constructor(main: MassDeleteSectionClassType, contentType: ContentNameType) {
    this.main = main;
    this.contentType = contentType;

    this.Render();
  }

  private Render() {
    this.deleteSection = new DeleteSection({
      defaults: { contentType: this.contentType, takePoints: false },
      listeners: {
        onReasonChange: this.ReasonChanged.bind(this),
      },
    });

    this.container = Build(
      Flex({
        direction: "column",
        marginTop: "s",
      }),
      [
        [
          Flex({ marginBottom: "xxs" }),
          Text({
            weight: "bold",
            children:
              System.data.locale.reportedContents.massModerate.delete.choose[
                this.contentType
              ],
          }),
        ],
        this.deleteSection.container,
      ],
    );
  }

  private ReasonChanged() {
    this.main.main.ResizeTippy();
    this.main.TryToShowModerateButtons();
    this.main.UpdateModerateButtonNumbers();
    this.main.RenameModerateButtons();
  }
}
