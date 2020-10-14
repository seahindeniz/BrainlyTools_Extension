import type {
  RemoveCommentReqDataType,
  ReportedContentDataType,
} from "@BrainlyAction";
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

  ExpressDelete(data: RemoveCommentReqDataType) {
    return super.ExpressDelete(data, "RemoveComment");
  }
}
