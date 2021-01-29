import type {
  RemoveCommentReqDataType,
  ReportedContentDataType,
} from "@BrainlyAction";
import { QuickActionButtonsForComment } from "@components";
import type ReportedContentsType from "../ReportedContents";
import Content from "./Content";

export default class Comment extends Content {
  contentType: "Comment";
  data: ReportedContentDataType & {
    // eslint-disable-next-line camelcase
    model_type_id: 45;
  };

  constructor(main: ReportedContentsType, data: ReportedContentDataType) {
    super({ main, data, contentType: "Comment" });
  }

  protected RenderQuickActionButtons() {
    this.quickActionButtons = new QuickActionButtonsForComment({
      content: {
        databaseId: this.data.model_id,
        reported: true, // !!this.data.report,
        author: {
          nick: this.users.reported.data.nick,
          databaseId: this.users.reported.data.id,
        },
        questionDatabaseId: this.data.task_id,
      },
      moreButton: true,
      containerProps: {
        alignItems: "center",
        justifyContent: "flex-end",
        className: "ext-quick-action-buttons",
      },
      onDelete: this.Deleted.bind(this),
      onConfirm: this.Confirmed.bind(this),
    });
  }

  ExpressDelete(data: RemoveCommentReqDataType) {
    return super.ExpressDelete(data, "RemoveComment");
  }
}
