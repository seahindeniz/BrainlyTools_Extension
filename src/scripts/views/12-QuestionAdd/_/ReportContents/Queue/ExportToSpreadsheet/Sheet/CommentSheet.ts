import type ExportToSpreadsheetClassType from "../ExportToSpreadsheet";
import Sheet from "./Sheet";
import type CommentClassType from "../../../Content/Comment";

export default class CommentSheet extends Sheet {
  constructor(main: ExportToSpreadsheetClassType) {
    super(main, "Comment", [
      {
        key: "questionId",
        header:
          System.data.locale.reportedContents.queue.exportReports.questionId,
      },
      {
        key: "commentId",
        header: System.data.locale.reportedContents.queue.exportReports.id,
      },
    ]);
  }

  SetRow(data: ObjectAnyType, content: CommentClassType) {
    data.commentId = content.data.model_id;

    super.SetRow(data);
  }
}
