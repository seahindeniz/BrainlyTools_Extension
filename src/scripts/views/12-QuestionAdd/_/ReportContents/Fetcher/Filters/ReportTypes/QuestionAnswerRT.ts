import ReportType from "./ReportType";
import type ReportTypesClassType from "./ReportTypes";

export default class QuestionAnswerRT extends ReportType {
  constructor(main: ReportTypesClassType) {
    super(main, "questionAnswerReports");
  }

  Selected() {
    if (!this.main.main.main.IsSafeToFetchReports()) return;

    const filters = this.main.main.main.main.queue.filtersPanel.filter;

    filters.contentType.Show();
    filters.attachmentLength.Show();
    this.main.main.main.pageNumbers.Show();
    filters.additionalData.Show();
    this.main.main.subjectFilter.Show();
    this.main.main.reasonFilter.Show();
    this.main.main.reasonFilter.ShowGroups(["question", "answer"]);
    super.Selected();
  }

  Deselected() {
    super.Deselected();
    this.main.main.main.pageNumbers.Hide();
  }
}
