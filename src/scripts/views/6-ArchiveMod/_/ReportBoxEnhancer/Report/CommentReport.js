import Action from "@/scripts/controllers/Req/Brainly/Action";
import Report from ".";

export default class CommentReport extends Report {
  RenderDeleteButtons() {
    super.RenderDeleteButtons("comment", {
      button: "black",
      text: "white",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  Delete(data) {
    return new Action().RemoveComment(data, true);
  }
}
