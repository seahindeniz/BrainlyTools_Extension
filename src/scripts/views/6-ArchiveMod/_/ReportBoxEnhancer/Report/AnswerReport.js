import Report from ".";
import Action from "@/scripts/controllers/Req/Brainly/Action";

export default class AnswerReport extends Report {
  /**
   * @param {import("../").default} main
   * @param {import("./").ZdnObject} zdnObject
   */
  constructor(main, zdnObject) {
    super(main, zdnObject);
  }
  RenderDeleteButtons() {
    super.RenderDeleteButtons("answer", {
      button: "peach",
      text: "white",
    });
  }
  Delete(data) {
    return new Action().RemoveAnswer(data, true);
  }
}
