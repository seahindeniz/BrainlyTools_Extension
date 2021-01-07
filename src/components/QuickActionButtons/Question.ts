import type { RemoveQuestionReqDataType } from "@BrainlyReq/RemoveQuestion";
import { RemoveQuestion } from "@BrainlyReq";
import DeleteButton from "./ActionButton/DeleteButton";
import QuickActionButtons, {
  ContentType,
  QuickActionButtonsPropsType,
} from "./QuickActionButtons";

type QuestionContentType = {
  hasVerifiedAnswers?: boolean;
} & ContentType;

type PropsType = {
  content: QuestionContentType;
} & QuickActionButtonsPropsType;

export default class QuickActionButtonsForQuestion extends QuickActionButtons {
  contentType: "Question";
  content: QuestionContentType;

  constructor(props: PropsType) {
    super("Question", props);

    this.RenderDeleteButtons();
    this.RenderConfirmButton();
  }

  RenderDeleteButtons() {
    if (
      this.content.hasVerifiedAnswers ||
      !System.checkUserP(1) ||
      !System.checkBrainlyP(102)
    )
      return;

    System.data.config.quickDeleteButtonsReasons.question.forEach(
      (id, index) => {
        const deleteButton = new DeleteButton(
          this,
          { id, type: "question" },
          index,
          {
            type: "solid-mustard",
          },
        );

        this.actionButtons.push(deleteButton);
      },
    );
  }

  async DeleteContent(data: RemoveQuestionReqDataType) {
    try {
      /* console.log(data, this.content.reported);

      const resDelete = { success: true, message: "" };

      await System.TestDelay(); */
      const resDelete = await RemoveQuestion(data, this.content.reported);

      if (resDelete?.success === false) {
        throw resDelete.message
          ? { msg: resDelete.message }
          : resDelete || Error("No response");
      }

      this.NotModerating();
      this.Deleted();

      if (this.content.author?.databaseId)
        System.log(5, {
          data: [this.content.databaseId],
          user: {
            id: this.content.author.databaseId,
            nick: this.content.author.nick,
          },
        });
    } catch (error) {
      console.error(error);
      this.props.notificationHandler?.({
        type: "error",
        html:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });

      this.NotModerating();
    }
  }
}
