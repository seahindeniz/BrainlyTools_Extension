import Action, { RemoveQuestionReqDataType } from "@BrainlyAction";
import ModerationSection from ".";
import type ModerationToplayerClassType from "..";

export default class QuestionSection extends ModerationSection {
  constructor(main: ModerationToplayerClassType) {
    super(main, main.question);

    this.contentType = "question";

    this.RenderDeleteButtons({
      type: "solid-mustard",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  Delete(data: RemoveQuestionReqDataType) {
    data.return_points = !data.give_warning;

    return new Action().RemoveQuestion(data);
  }

  Deleted() {
    super.Deleted();
    this.main.zdnObject.endModeration(
      false,
      System.data.locale.moderateAll.notificationMessage
        .questionRemovedPanelClosing,
      4000,
      true,
    );
    System.log(5, {
      user: this.main.zdnObject.data.user,
      data: [this.data.id],
    });
  }
}
