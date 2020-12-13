import { Button, Flex, Text } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import tippy from "tippy.js";
import type ReportTypesType from "./ReportTypes";

type ReportTypeNameType =
  | "questionAnswerReports"
  | "commentReports"
  | "correctionReports";

export default class ReportType {
  main: ReportTypesType;
  typeName: ReportTypeNameType;

  container: FlexElementType;
  numberOfReports: Text;
  button: Button;

  constructor(main: ReportTypesType, typeName: ReportTypeNameType) {
    this.main = main;
    this.typeName = typeName;

    this.Render();
    this.BindListeners();
  }

  Render() {
    this.numberOfReports = document.createTextNode("0");

    const textPieces: (string | Text)[] = System.data.locale.reportedContents[
      this.typeName
    ].text.split("%{number_of_reports}");

    textPieces.splice(1, 0, this.numberOfReports);

    this.container = Flex({
      margin: "xxs",
      children: (this.button = new Button({
        type: "outline",
        children: textPieces,
        title: System.data.locale.reportedContents[this.typeName].title,
      })),
    });

    tippy(this.button.element, {
      theme: "light",
      allowHTML: true,
      content: Text({
        size: "small",
        weight: "bold",
        children: System.data.locale.reportedContents[this.typeName].title,
      }),
    });

    this.main.main.reportTypeFilterContainer.append(this.container);
  }

  BindListeners() {
    this.button.element.addEventListener("click", this.Selected.bind(this));
  }

  Selected() {
    if (this.main.selectedReportType) {
      this.main.selectedReportType.Deselected();
    }

    this.main.selectedReportType = this;

    this.button.ChangeType({ type: "outline", toggle: "blue" });

    this.main.main.main.main.queue.HideContents();
    this.main.main.main.FetchReports({ resetStore: true });
    this.main.main.main.main.queue.filter.all.forEach(filter =>
      filter.HideLabel(),
    );
  }

  Deselected() {
    this.main.selectedReportType.button.ChangeType({ type: "outline" });
  }
}
