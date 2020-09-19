import ReportType from "./ReportType";
import type ReportTypesType from "./ReportTypes";

export default class QuestionAnswerRT extends ReportType {
  constructor(main: ReportTypesType) {
    super(main, "questionAnswerReports");
  }

  Selected() {
    const filters = this.main.main.main.main.queue.options.option.contentFilters
      .filter;

    filters.contentType.Show();
    filters.attachmentLength.Show();
    this.main.main.main.pageNumbers.Show();
    filters.additionalData.Show();
    this.main.main.categoryFilter.ShowQuestionAnswerSelector();
    super.Selected();
  }

  Deselected() {
    super.Deselected();
    this.main.main.main.pageNumbers.Hide();
  }
}
