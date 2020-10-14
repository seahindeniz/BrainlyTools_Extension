import type ExportToSpreadsheetClassType from "../ExportToSpreadsheet";
import Sheet from "./Sheet";

export default class QuestionSheet extends Sheet {
  constructor(main: ExportToSpreadsheetClassType) {
    super(main, "Question", [
      {
        key: "questionId",
        header: System.data.locale.reportedContents.queue.exportReports.id,
      },
    ]);
  }
}
