import ReportType from "./ReportType";
import type ReportTypesType from "./ReportTypes";

export default class CorrectionRT extends ReportType {
  constructor(main: ReportTypesType) {
    super(main, "correctionReports");
  }

  Selected() {
    const filters = this.main.main.main.main.queue.options.option.contentFilters
      .filter;

    filters.contentType.Hide();
    filters.additionalData.Hide();
    filters.attachmentLength.Show();
    this.main.main.reasonFilter.Hide();
    this.main.main.subjectFilter.Show();
    super.Selected();
  }
}
