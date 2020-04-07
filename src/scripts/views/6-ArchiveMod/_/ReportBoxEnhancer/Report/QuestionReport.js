import Report from ".";
import Action from "@/scripts/controllers/Req/Brainly/Action";

export default class QuestionReport extends Report {
  /**
   * @param {import("../").default} main
   * @param {import("./").ZdnObject} zdnObject
   */
  constructor(main, zdnObject) {
    super(main, zdnObject);
  }
  RenderDeleteButtons() {
    super.RenderDeleteButtons("question", {
      button: "mustard",
      text: "gray",
    });
  }
  Delete(data) {
    data.take_points = data.give_warning;
    data.return_points = !data.give_warning;

    return new Action().RemoveQuestion(data);
  }
}
