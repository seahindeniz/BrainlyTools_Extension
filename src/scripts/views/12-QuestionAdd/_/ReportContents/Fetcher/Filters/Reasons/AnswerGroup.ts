import ReasonGroup from "./ReasonGroup";
import type ReasonsClassType from "./Reasons";

export default class AnswerGroup extends ReasonGroup {
  constructor(main: ReasonsClassType) {
    super(
      main,
      2,
      System.data.locale.reportedContents.categoryFilterFirstOption.reasonsFor
        .Answer,
    );
  }

  Show() {
    this.main.reasonSelect.select.prepend(
      this.main.primaryReason.questionAnswer.option,
    );
    super.Show();
  }
}
