import type {
  RemoveCommentReqDataType,
  ReportedContentDataType,
} from "@BrainlyAction";
import type ReportedContentsType from "../ReportedContents";
import Content from "./Content";

export default class Comment extends Content {
  contentType: "Comment";

  constructor(main: ReportedContentsType, data: ReportedContentDataType) {
    super({ main, data, contentType: "Comment" });
  }

  ExpressDelete(data: RemoveCommentReqDataType) {
    return super.ExpressDelete(data, "RemoveComment");
  }
}
