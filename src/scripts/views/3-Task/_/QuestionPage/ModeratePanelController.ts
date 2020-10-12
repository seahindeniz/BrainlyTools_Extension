import Action from "@BrainlyAction";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import ModeratePanelController from "@components/ModerationPanel/ModeratePanelController";
import type { ModeratePanelActionType } from "@components/ModerationPanel/ModerationPanel";
import notification from "@components/notification2";
import type QuestionPageClassType from "./QuestionPage";

export default class QuestionPageModeratePanelController extends ModeratePanelController {
  main: QuestionPageClassType;

  constructor(main: QuestionPageClassType) {
    super();

    this.main = main;
  }

  async Moderate() {
    try {
      const resTicket = await new Action().OpenModerationTicket(
        this.main.data.id,
      );

      if (resTicket.success === false) {
        notification({
          type: "error",
          html:
            resTicket.message ||
            System.data.locale.common.notificationMessages.somethingWentWrong,
        });

        return resTicket;
      }

      if (!resTicket.data || !resTicket.users_data) {
        notification({
          type: "error",
          html:
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
    if (contentType === "Comment") return;

    const content =
      contentType === "Question"
        ? this.main.questionSection
        : this.main.answerSections.byId[id];

    if (!content) return;

    if (action === "delete") content.Deleted();
    else if (action === "confirm") content.Confirmed();
  }
}
