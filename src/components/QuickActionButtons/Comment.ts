import { CloseModerationTicket, RemoveComment } from "@BrainlyReq";
import type { RemoveCommentReqDataType } from "@BrainlyReq/RemoveComment";
import DeleteButton from "./ActionButton/DeleteButton";
import QuickActionButtons, {
  QuickActionButtonsPropsType,
} from "./QuickActionButtons";

export default class QuickActionButtonsForComment extends QuickActionButtons {
  contentType: "Comment";

  constructor(props: QuickActionButtonsPropsType) {
    super("Comment", props);

    this.RenderDeleteButtons();
    this.RenderConfirmButton();
  }

  RenderDeleteButtons() {
    if (!System.checkUserP(45) || !System.checkBrainlyP(102)) return;

    System.data.config.quickDeleteButtonsReasons.comment.forEach(
      (id, index) => {
        const deleteButton = new DeleteButton(
          this,
          { id, type: "comment" },
          index,
          {
            type: "solid",
          },
        );

        this.actionButtons.push(deleteButton);
      },
    );
  }

  async DeleteContent(data: RemoveCommentReqDataType) {
    try {
      const resDelete = await RemoveComment(data, this.content.reported);

      CloseModerationTicket(this.content.questionDatabaseId);

      if (resDelete?.success === false) {
        throw resDelete.message
          ? { msg: resDelete.message }
          : resDelete || Error("No response");
      }

      this.NotModerating();
      this.Deleted();

      if (this.content.author?.databaseId)
        System.log(7, {
          data: [this.content.databaseId],
          user: {
            id: this.content.author.databaseId,
            nick: this.content.author.nick,
          },
        });
    } catch (error) {
      console.error(error);
      this.props.notificationHandler?.({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });

      this.NotModerating();
    }
  }
}
