import Report from ".";
import Action from "@/scripts/controllers/Req/Brainly/Action";

export default class CommentReport extends Report {
  /**
   * @param {import("../").default} main
   * @param {import("./").ZdnObject} zdnObject
   */
  constructor(main, zdnObject) {
    super(main, zdnObject);
  }
  RenderDeleteButtons() {
    super.RenderDeleteButtons("comment", {
      button: "black",
      text: "white",
    });
  }
  Delete(data) {
    return new Action().RemoveComment(data, true);
  }
}
