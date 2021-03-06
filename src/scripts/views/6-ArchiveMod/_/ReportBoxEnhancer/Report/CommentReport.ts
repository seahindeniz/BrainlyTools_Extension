import Action, { RemoveCommentReqDataType } from "@BrainlyAction";
import Report from ".";

export default class CommentReport extends Report {
  RenderDeleteButtons() {
    super.RenderDeleteButtons("comment", {
      button: {
        type: "solid",
      },
      text: "white",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  Delete(data: RemoveCommentReqDataType) {
    return new Action().RemoveComment(data, true);
  }
}
