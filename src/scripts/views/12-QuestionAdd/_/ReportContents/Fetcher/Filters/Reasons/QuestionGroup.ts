import ReasonGroup from "./ReasonGroup";
import type ReasonsClassType from "./Reasons";

export default class QuestionGroup extends ReasonGroup {
  constructor(main: ReasonsClassType) {
    super(
      main,
      1,
      System.data.locale.reportedContents.categoryFilterFirstOption.reasonsFor
        .Question,
    );
  }

  Show() {
    this.main.reasonSelect.select.prepend(
      this.main.primaryReason.questionAnswer.option,
    );
    super.Show();
  }
}
