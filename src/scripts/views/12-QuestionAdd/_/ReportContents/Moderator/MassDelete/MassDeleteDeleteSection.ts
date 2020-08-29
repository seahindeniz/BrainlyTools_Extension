import DeleteSection from "@components/DeleteSection2/DeleteSection";
import Build from "@root/scripts/helpers/Build";
import { Flex, Text } from "@style-guide";
import type { ContentNameType } from "../../Content/Content";
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

  Render() {
    this.deleteSection = new DeleteSection({
      defaults: { contentType: this.contentType },
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

  ReasonChanged() {
    console.log(this.deleteSection.reasonSection.selectedRadio);
    this.main.main.ResizeTippy();
    this.main.TryToShowDeleteButton();
  }
}
