import type {
  RemoveCommentReqDataType,
  ReportedContentDataType,
} from "@BrainlyAction";
import QuickActionButtonsForComment from "@components/QuickActionButtons/Comment";
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
      },
      containerProps: {
        grow: true,
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
