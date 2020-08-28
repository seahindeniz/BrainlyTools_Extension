import { Button, Flex, Icon, Spinner, Text } from "@style-guide";
import notification from "../../../components/notification2";
import Action from "../../../controllers/Req/Brainly/Action";

export default function taskSection() {
  const mainQuestionArticle = document.querySelector(
    `.js-main-question`,
  ) as HTMLDivElement;
  const questionContainer = mainQuestionArticle.querySelector(
    ":scope > div > .brn-qpage-next-question-box",
  );
  const questionData = JSON.parse(mainQuestionArticle?.dataset?.z);

  // eslint-disable-next-line camelcase
  if (!mainQuestionArticle || questionData?.is_deleted) return;

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

  let tempFlexElement = Flex({
    direction: "column",
    fullWidth: true,
  });
  mainQuestionArticle.className += ` ${tempFlexElement.className}`;

  tempFlexElement.remove();

  tempFlexElement = null;

  System.data.config.quickDeleteButtonsReasons.question.forEach((id, i) => {
    const reason = System.DeleteReason({ id });
    const button = new Button({
      type: "solid-mustard",
      size: "s",
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

    const userData = window.jsData.question.author;

    if (!userData) throw Error("Cannot find the user data");

    const reason = System.DeleteReason({ id: this.reasonId, noRandom: true });

    if (!reason || !reason.id) throw Error("Can't find the reason");

    const confirmDeleting = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", reason.title)
      .replace("%{reason_message}", reason.text);

    if (confirm(confirmDeleting)) {
      const giveWarning = System.canBeWarned(reason.id);
      const taskData = {
        model_id: questionId,
        reason_id: reason.category_id,
        reason: reason.text,
        reason_title: reason.title,
        give_warning: giveWarning,
        take_points: giveWarning,
        return_points: !giveWarning,
      };
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
        questionContainer.classList.add("brn-content--deleted");
        // @ts-ignore
        $(
          ".question-header > .sg-actions-list > .sg-actions-list__hole:last-child > .sg-actions-list > .sg-actions-list__hole:first-child",
        ).remove();
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

  if (questionData.isMarkedAbuse) {
    const confirmButton = new Button({
      size: "s",
      type: "solid-mint",
      title: System.data.locale.common.confirm,
      html: System.data.locale.common.confirm,
      icon: new Icon({
        type: "check",
        size: 22,
      }),
    });

    confirmButton.element.addEventListener(
      "click",
      // eslint-disable-next-line no-use-before-define
      async () => {
        if (
          !confirm(
            System.data.locale.userContent.notificationMessages
              .doYouWantToConfirmThisContent,
          )
        )
          return;
        const spinner = Spinner({ size: "xxsmall", light: true });
        const icon = confirmButton.icon.element;

        confirmButton.iconContainer.append(spinner);
        confirmButton.iconContainer.removeChild(icon);

        try {
          const resConfirm = await new Action().ConfirmQuestion(
            window.jsData.question.databaseId,
          );

          new Action().CloseModerationTicket(questionData.id);

          // eslint-disable-next-line no-throw-literal
          if (!resConfirm?.success) throw { msg: resConfirm?.message };

          System.log(19, {
            user: window.jsData.question.author,
            data: [window.jsData.question.databaseId],
          });

          confirmButton.element.remove();
          questionContainer.classList.add("brn-content--confirmed");

          const options = document.querySelector(
            ".brn-qpage-next-question-box__options",
          );

          if (options) options.remove();
        } catch (error) {
          console.error(error);

          confirmButton.iconContainer.append(icon);
          confirmButton.iconContainer.removeChild(spinner);
          notification({
            type: "error",
            html:
              error?.msg ||
              System.data.locale.common.notificationMessages.somethingWentWrong,
          });
        }
      },
    );

    const buttonContainer = Flex({
      children: confirmButton.element,
      marginBottom: "xs",
    });

    extButtonsContainer.append(buttonContainer);
  }
}
