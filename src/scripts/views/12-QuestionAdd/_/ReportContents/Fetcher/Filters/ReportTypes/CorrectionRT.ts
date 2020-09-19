import ReportType from "./ReportType";
import type ReportTypesType from "./ReportTypes";

export default class QuestionAnswerRT extends ReportType {
  constructor(main: ReportTypesType) {
    super(main, "correctionReports");
  }

  Selected() {
    const filters = this.main.main.main.main.queue.options.option.contentFilters
      .filter;

    filters.contentType.Hide();
    filters.additionalData.Hide();
    filters.attachmentLength.Show();
    this.main.main.categoryFilter.HideCommentSelector();
    this.main.main.categoryFilter.HideQuestionAnswerSelector();
    super.Selected();
  }
}
