// @flow
import ReportType from "./ReportType";
import type ReportTypesType from "./ReportTypes";

export default class QuestionAnswerRT extends ReportType {
  constructor(main: ReportTypesType) {
    super(main, "questionAnswerReports");
  }

  Selected() {
    this.main.main.categoryFilter.ShowQuestionAnswerSelector();
    super.Selected();
  }
}
