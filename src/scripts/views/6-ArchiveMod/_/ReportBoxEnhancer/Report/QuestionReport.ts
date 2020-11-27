import Action, { RemoveQuestionReqDataType } from "@BrainlyAction";
import Report from ".";

export default class QuestionReport extends Report {
  RenderDeleteButtons() {
    super.RenderDeleteButtons("question", {
      button: {
        type: "solid-mustard",
      },
      text: "gray",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  Delete(data: RemoveQuestionReqDataType) {
    data.take_points = true;
    data.return_points = false;

    return new Action().RemoveQuestion(data);
  }
}
