import ReasonGroup from "./ReasonGroup";
import type ReasonsClassType from "./Reasons";

export default class CommentGroup extends ReasonGroup {
  constructor(main: ReasonsClassType) {
    super(
      main,
      45,
      System.data.locale.reportedContents.categoryFilterFirstOption.reasonsFor
        .Comment,
    );
  }

  Show() {
    this.main.reasonSelect.select.prepend(
      this.main.primaryReason.questionAnswer.option,
    );
    super.Show();
  }
}
