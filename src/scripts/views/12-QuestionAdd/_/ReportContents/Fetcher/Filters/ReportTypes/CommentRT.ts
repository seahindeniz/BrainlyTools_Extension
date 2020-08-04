// @flow
import ReportType from "./ReportType";
import type ReportTypesType from "./ReportTypes";

export default class QuestionAnswerRT extends ReportType {
  constructor(main: ReportTypesType) {
    super(main, "commentReports");

    this.container.ChangeMargin({
      marginLeft: "xs",
      marginRight: "xs",
    });
  }

  Selected() {
    this.main.main.categoryFilter.ShowCommentSelector();
    super.Selected();
  }
}
