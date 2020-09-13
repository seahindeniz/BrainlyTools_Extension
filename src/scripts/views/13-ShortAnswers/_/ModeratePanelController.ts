import Action from "@BrainlyAction";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import ModeratePanelController from "@components/ModerationPanel/ModeratePanelController";
import notification from "@components/notification2";
import type ShortAnswersClassType from "..";
import type AnswerClassType from "./Answer";

export default class ShortAnswerModeratePanelController extends ModeratePanelController {
  main: ShortAnswersClassType;

  answerInModeration: AnswerClassType;

  constructor(main: ShortAnswersClassType) {
    super({
      switcher: true,
    });

    this.main = main;
  }

  async Moderate(answer: AnswerClassType) {
    try {
      this.answerInModeration = answer;

      const resTicket = await new Action().OpenModerationTicket(
        answer.questionId,
      );

      this.HideLoadingOverlay();

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

  SomethingDeleted(id: number, contentType: ContentNameType) {
    if (contentType === "Comment") return;

    const answer = this.main.answers.byId[contentType][id];

    answer?.Deleted();
  }

  async SwitchToReport(direction: "next" | "previous") {
    try {
      if (this.moderationPanel)
        await this.moderationPanel.FinishModeration(true);

      if (!this.answerInModeration) return;

      this.ShowLoadingOverlay();

      const index = this.main.answers.all.indexOf(this.answerInModeration);

      if (index < 0) return;

      const content = this.main.answers.all[
        index + (direction === "next" ? 1 : -1)
      ];

      if (!content) {
        notification({
          type: "info",
          text: System.data.locale.moderationPanel.thereIsNoReportLeft,
        });

        this.HideLoadingOverlay();

        return;
      }

      const ticketData = await content.Moderate();

      if (!ticketData.success) {
        this.SwitchToReport(direction);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
