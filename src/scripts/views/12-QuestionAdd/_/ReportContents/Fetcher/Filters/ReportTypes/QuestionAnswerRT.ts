import ReportType from "./ReportType";
import type ReportTypesType from "./ReportTypes";

export default class QuestionAnswerRT extends ReportType {
  constructor(main: ReportTypesType) {
    super(main, "questionAnswerReports");
  }

  Selected() {
    this.main.main.main.pageNumbers.Show();
    this.main.main.main.main.queue.options.option.contentFilters.filter.contentType.Show();
    this.main.main.categoryFilter.ShowQuestionAnswerSelector();
    super.Selected();
  }

  Deselected() {
    super.Deselected();
    this.main.main.main.pageNumbers.Hide();
    this.main.main.main.main.queue.options.option.contentFilters.filter.contentType.Hide();
  }
}
