import Action from "@BrainlyAction";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import ModeratePanelController from "@components/ModerationPanel/ModeratePanelController";
import type { ModeratePanelActionType } from "@components/ModerationPanel/ModerationPanel";
import notification from "@components/notification2";
import type QuestionClassType from "./Question/Question";
import type FeedModerationClassType from "./SearchResultsModeration";

export default class HomepageModeratePanelController extends ModeratePanelController {
  main: FeedModerationClassType;

  constructor(main: FeedModerationClassType) {
    super();

    this.main = main;
  }

  async Moderate(question: QuestionClassType) {
    try {
      const resTicket = await new Action().OpenModerationTicket(
        question.questionId,
      );

      // eslint-disable-next-line camelcase
      if (!resTicket?.success || !resTicket?.data || !resTicket?.users_data) {
        notification({
          type: "error",
          html:
            resTicket.message ||
            System.data.locale.common.notificationMessages.somethingWentWrong,
        });

        return resTicket;
      }

      super.OpenModeratePanel(resTicket);

      return resTicket;
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    return undefined;
  }

  SomethingModerated(
    id: number,
    action: ModeratePanelActionType,
    contentType: ContentNameType,
  ) {
    if (contentType !== "Question") return;

    const content = this.main.questions.byId[id];

    if (!content) return;

    if (action === "delete") content.Deleted();
  }
}
