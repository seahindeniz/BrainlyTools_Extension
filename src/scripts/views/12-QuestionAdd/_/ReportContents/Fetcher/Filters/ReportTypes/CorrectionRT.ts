import ReportType from "./ReportType";
import type ReportTypesClassType from "./ReportTypes";

export default class CorrectionRT extends ReportType {
  constructor(main: ReportTypesClassType) {
    super(main, "correctionReports");
  }

  Selected() {
    if (!this.main.main.main.IsSafeToFetchReports()) return;

    const filters = this.main.main.main.main.queue.filtersPanel.filter;

    filters.contentType.Hide();
    filters.additionalData.Hide();
    filters.attachmentLength.Show();
    this.main.main.reasonFilter.Hide();
    this.main.main.subjectFilter.Show();
    super.Selected();
  }
}
