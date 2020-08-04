import ModerationPanel from "@/scripts/components/ModerationPanel/ModerationPanel";
import notification from "@/scripts/components/notification2";
import Action from "@BrainlyAction";
import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";

export default class ModerationPanelController {
  main: QueueClassType;

  moderationPanel: ModerationPanel;

  constructor(main: QueueClassType) {
    this.main = main;
  }

  // eslint-disable-next-line class-methods-use-this
  async ModerateContent(content: ContentClassTypes) {
    try {
      if (!content.contentType) return;

      const resTicket = await new Action().OpenModerationTicket(
        content.data.task_id,
      );
      content.HideSpinner();
      content.EnableActions();
      content.moderateButton.Enable();

      // eslint-disable-next-line camelcase
      if (!resTicket?.success || !resTicket?.data || !resTicket?.users_data) {
        notification({
          type: "error",
          html:
            resTicket.message ||
            System.data.locale.common.notificationMessages.somethingWentWrong,
        });

        return;
      }

      this.moderationPanel = new ModerationPanel(
        resTicket.data,
        resTicket.users_data,
        {
          onClose: this.ModerationPanelClosed.bind(this),
          onDelete: this.SomethingDeleted.bind(this),
        },
      );

      // TODO remove this
      new Action().CloseModerationTicket(content.data.task_id);
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        html: System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }
  }

  ModerationPanelClosed() {
    this.moderationPanel = null;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  SomethingDeleted() {}
}
