import type ExportToSpreadsheetClassType from "../ExportToSpreadsheet";
import Sheet from "./Sheet";
import type AnswerClassType from "../../../Content/Answer";

export default class AnswerSheet extends Sheet {
  constructor(main: ExportToSpreadsheetClassType) {
    super(main, "Answer", [
      {
        key: "questionId",
        header:
          System.data.locale.reportedContents.queue.exportReports.questionId,
      },
      {
        key: "answerId",
        header: System.data.locale.reportedContents.queue.exportReports.id,
      },
    ]);
  }

  SetRow(data: ObjectAnyType, content: AnswerClassType) {
    data.answerId = content.data.model_id;

    super.SetRow(data);
  }
}
