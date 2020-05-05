import { Button, Flex, Spinner, Text } from "@style-guide";
import notification from "../../../components/notification2";
import Action from "../../../controllers/Req/Brainly/Action";

export default function taskSection() {
  /**
   * @type {HTMLDivElement}
   */
  const mainQuestionArticle = document.querySelector(`.js-main-question`);

  if (
    !mainQuestionArticle ||
    mainQuestionArticle.classList.contains("brn-question--deleted")
  )
    return;

  const extButtonsContainer = Flex({
    direction: "column",
    marginLeft: "xs",
    className: "ext_actions",
  });
  const mainContainer = Flex({
    noShrink: true,
    children: extButtonsContainer,
  });

  mainQuestionArticle.after(mainContainer);
  mainContainer.prepend(mainQuestionArticle);

  System.data.config.quickDeleteButtonsReasons.question.forEach((id, i) => {
    const reason = System.DeleteReason({
      id,
      type: "question",
    });
    const button = new Button({
      type: "solid-mustard",
      size: "small",
      icon: Text({
        text: i + 1,
        weight: "bold",
        color: "gray",
      }),
      text: reason.title,
      title: reason.text,
      reasonId: reason.id,
    });
    const buttonContainer = Flex({
      children: button.element,
      marginBottom: "xs",
    });

    extButtonsContainer.append(buttonContainer);
  });

  async function taskModerateButtonsClickHandler() {
    const questionId = Number(mainQuestionArticle.dataset.questionId);

    if (!questionId) throw Error("Cannot find the question id");

    const userData = $(".user-fiche-wrapper", mainQuestionArticle).data("z");

    if (!userData) throw Error("Cannot find the user data");

    const reason = System.DeleteReason({
      id: this.reasonId,
      type: "question",
      noRandom: true,
    });

    if (!reason || !reason.id) throw Error("Can't find the reason");

    const confirmDeleting = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", reason.title)
      .replace("%{reason_message}", reason.text);

    if (confirm(confirmDeleting)) {
      const taskData = {
        model_id: questionId,
        reason_id: reason.category_id,
        reason: reason.text,
        reason_title: reason.title,
      };
      taskData.give_warning = System.canBeWarned(reason.id);
      taskData.take_points = taskData.give_warning;
      taskData.return_points = !taskData.give_warning;
      const icon = $(".sg-button__icon > div", this);
      const spinner = Spinner({ size: "xxsmall", light: true });

      icon.before(spinner);
      icon.detach();

      try {
        const res = await new Action().RemoveQuestion(taskData);

        new Action().CloseModerationTicket(questionId);

        if (!res || !res.success)
          // eslint-disable-next-line no-throw-literal
          throw { msg: res?.message };

        System.log(5, { user: userData, data: [questionId] });
        mainQuestionArticle.classList.add("brn-question--deleted");
        // @ts-ignore
        $(window.selectors.taskModerateButton).remove();
        extButtonsContainer.remove();
      } catch (error) {
        console.error(error);
        icon.insertBefore(spinner);
        spinner.remove();
        notification({
          type: "error",
          html:
            error.msg ||
            System.data.locale.common.notificationMessages.somethingWentWrong,
        });
      }
    }
  }
  $("button", extButtonsContainer).on("click", taskModerateButtonsClickHandler);
}
