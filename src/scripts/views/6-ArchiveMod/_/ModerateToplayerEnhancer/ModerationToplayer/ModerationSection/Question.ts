/* eslint-disable import/no-duplicates */
import Action, { RemoveQuestionReqDataType } from "@BrainlyAction";
import ModerationSection from ".";
import type ModerationToplayerClassType from "..";
import type { QuestionEntryType } from "..";

export default class QuestionSection extends ModerationSection {
  data: QuestionEntryType;
  contentType: "question";

  constructor(main: ModerationToplayerClassType) {
    super(main, main.question);

    this.contentType = "question";

    this.RenderDeleteButtons({
      type: "solid-mustard",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  Delete(data: RemoveQuestionReqDataType) {
    data.return_points = false;

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
