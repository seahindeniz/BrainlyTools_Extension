import Action from "@BrainlyAction";
import type { ContentNameType } from "@components/ModerationPanel/ModeratePanelController";
import ModeratePanelController from "@components/ModerationPanel/ModeratePanelController";
import notification, {
  GetFlashMessageContainer,
} from "@components/notification2";
import type ContentClassType from "../../Content/Content";
import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";

function RelocateFlashMessageContainer() {
  const container = GetFlashMessageContainer();

  document.body.prepend(container);
}

export default class ModerationPanelController extends ModeratePanelController {
  main: QueueClassType;

  contentCurrentlyModerating: ContentClassTypes;

  constructor(main: QueueClassType) {
    super({
      switcher: true,
    });

    this.main = main;

    RelocateFlashMessageContainer();
  }

  async ModerateContent(content: ContentClassTypes | ContentClassType) {
    try {
      if (!content.contentType) return undefined;

      // @ts-expect-error
      this.contentCurrentlyModerating = content;

      const resTicket = await new Action().OpenModerationTicket(
        content.data.task_id,
      );

      this.HideLoadingOverlay();
      content.HideSpinner();
      content.EnableActions();
      content.moderateButton?.Enable();

      // eslint-disable-next-line camelcase
      if (!resTicket?.success || !resTicket?.data || !resTicket?.users_data) {
        notification({
          timeOut: 5000,
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
    const globalId = btoa(`${contentType.toLowerCase()}:${id}`);

    const content = this.main.main.contents.byGlobalId.all[globalId];

    content?.Deleted();
  }

  async SwitchToReport(direction: "next" | "previous") {
    try {
      if (this.moderationPanel)
        await this.moderationPanel.FinishModeration(true);

      if (!this.contentCurrentlyModerating) return;

      this.ShowLoadingOverlay();

      const index = this.main.main.contents.filtered.indexOf(
        this.contentCurrentlyModerating,
      );

      if (index < 0) return;

      const content = this.main.main.contents.filtered[
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
        notification({
          timeOut: 5000,
          type: "info",
          html: System.data.locale.moderationPanel.switchingToNextContent,
        });
        this.SwitchToReport(direction);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
