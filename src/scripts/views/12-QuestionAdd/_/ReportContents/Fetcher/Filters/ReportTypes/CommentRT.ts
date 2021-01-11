import ReportType from "./ReportType";
import type ReportTypesClassType from "./ReportTypes";

export default class CommentRT extends ReportType {
  constructor(main: ReportTypesClassType) {
    super(main, "commentReports");

    this.container.ChangeMargin({
      marginLeft: "xs",
      marginRight: "xs",
    });
  }

  Selected() {
    if (!this.main.main.main.IsSafeToFetchReports()) return;

    const filters = this.main.main.main.main.queue.filtersPanel.filter;

    filters.contentType.Hide();
    filters.additionalData.Hide();
    filters.attachmentLength.Hide();
    this.main.main.reasonFilter.Show();
    this.main.main.subjectFilter.Show();
    this.main.main.reasonFilter.ShowGroups(["comment"]);
    super.Selected();
  }
}
