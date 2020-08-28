import ReportType from "./ReportType";
import type ReportTypesType from "./ReportTypes";

export default class QuestionAnswerRT extends ReportType {
  constructor(main: ReportTypesType) {
    super(main, "correctionReports");
  }

  Selected() {
    this.main.main.categoryFilter.HideCommentSelector();
    this.main.main.categoryFilter.HideQuestionAnswerSelector();
    super.Selected();
  }
}
