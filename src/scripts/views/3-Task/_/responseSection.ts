import WaitForElement from "@root/scripts/helpers/WaitForElement";
import {
  Button,
  ContentBox,
  ContentBoxContent,
  Icon,
  Spinner,
  Text,
} from "@style-guide";
import notification from "../../../components/notification2";
import Action from "../../../controllers/Req/Brainly/Action";

const SELECTORS = {
  articleQuestion: "article.brn-question",
  taskModerateButtonContainer:
    "article.js-main-question:not(.brn-question--deleted) .question-header > .sg-actions-list > .sg-actions-list__hole:last-child > .sg-actions-list",

  responseParentContainer: ".js-react-answers",
  responseContainer: ".brn-answer",
  responseHeader: "js-react-answer-header-",
  responseModerateButtonContainer: `div.sg-actions-list > div.sg-actions-list__hole:nth-child(2) > div.sg-actions-list`,
};

export default async function responseSection() {
  const questionArticle = document.querySelector(
    ".js-question",
  ) as HTMLDivElement;

  if (!questionArticle) throw Error("Cannot find question article element");

  const questionData = JSON.parse(questionArticle.dataset.z);
  /**
   * @param {JQuery<HTMLElement>} [responseContainers]
   */
  const addButtons = responseContainers => {
    responseContainers.each((_, moderateButtonContainer) => {
      const answerContainer = moderateButtonContainer.closest(".brn-answer");

      if (!answerContainer) throw Error("Cannot find answer container");

      const { answerId } = answerContainer.dataset;

      const answerData = questionData.responses.find(response => {
        return response.id === Number(answerId);
      });

      const extButtonsContainer = ContentBox({
        className: "ext_actions",
      });

      moderateButtonContainer.after(extButtonsContainer);

      System.data.config.quickDeleteButtonsReasons.answer.forEach((id, i) => {
        const reason = System.DeleteReason({
          id,
          type: "answer",
        });
        const button = new Button({
          type: "solid-peach",
          size: "s",
          icon: Text({
            text: i + 1,
            weight: "bold",
            color: "white",
          }),
          text: reason.title,
          title: reason.text,
        });

        button.element.addEventListener(
          "click",
          // eslint-disable-next-line no-use-before-define
          responseModerateButtonsClickHandler,
        );

        const buttonContainer = ContentBoxContent({
          children: button.element,
          spacedTop: "small",
        });

        extButtonsContainer.append(buttonContainer);
      });

      if (answerData.settings.isMarkedAbuse) {
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
          ConfirmButtonClickHandler,
        );

        const buttonContainer = ContentBoxContent({
          children: confirmButton.element,
          spacedTop: "small",
        });

        extButtonsContainer.append(buttonContainer);
      }
    });
  };

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target) {
        const target = mutation.target as HTMLDivElement;

        if (target.className.includes(SELECTORS.responseHeader)) {
          const extActions = target.querySelector(".ext_actions");

          if (!extActions) {
            addButtons($(SELECTORS.responseModerateButtonContainer, target));
          }
        }
      }
    });
  });

  const responseParentContainer = await WaitForElement(
    SELECTORS.responseParentContainer,
  );

  const mainQuestionArticle = document.querySelector(`.js-main-question`);

  if (
    !mainQuestionArticle ||
    mainQuestionArticle.classList.contains("brn-question--deleted")
  )
    return;

  addButtons(
    $(
      `${SELECTORS.responseContainer} ${SELECTORS.responseModerateButtonContainer}`,
    ),
  );

  observer.observe(responseParentContainer, {
    childList: true,
    subtree: true,
  });

  async function responseModerateButtonsClickHandler() {
    const parentResponseContainer = $(this).parents(
      SELECTORS.responseContainer,
    );
    const answerId = Number(parentResponseContainer.data("answer-id"));

    if (!answerId) throw Error("Cannot find the answer id");

    const usersData = $(".js-users-data").data("z");
    const answer = questionData.responses.find(
      response => Number(response?.id) === answerId,
    );
    const user = usersData[answer.userId];

    if (!user) throw Error("Cannot find the user data");

    const btnIndex = $(this).parent().index();
    const reason = System.DeleteReason({
      id: System.data.config.quickDeleteButtonsReasons.answer[btnIndex],
      type: "answer",
      noRandom: true,
    });

    const confirmDeleting = System.data.locale.common.moderating.doYouWantToDeleteWithReason
      .replace("%{reason_title}", reason.title)
      .replace("%{reason_message}", reason.text);

    if (confirm(confirmDeleting)) {
      const giveWarning = System.canBeWarned(reason.id);
      const responseData = {
        model_id: answerId,
        reason_id: reason.category_id,
        reason: reason.text,
        reason_title: reason.title,
        give_warning: giveWarning,
        take_points: giveWarning,
      };

      const icon = $(".sg-button__icon > div", this);
      const spinner = Spinner({ size: "xxsmall", light: true });

      icon.before(spinner);
      icon.detach();

      try {
        const res = await new Action().RemoveAnswer(responseData);

        new Action().CloseModerationTicket(questionData.id);

        if (!res || !res.success)
          // eslint-disable-next-line no-throw-literal
          throw { msg: res?.message };

        System.log(6, { user, data: [answerId] });
        parentResponseContainer.addClass("brn-question--deleted");
        $(
          SELECTORS.responseModerateButtonContainer,
          parentResponseContainer,
        ).remove();
        $(this).parents(".ext_actions").remove();
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

  /**
   * @this {HTMLElement}
   */
  async function ConfirmButtonClickHandler() {
    const parentResponseContainer = $(this).parents(
      SELECTORS.responseContainer,
    );
    const answerId = Number(parentResponseContainer.data("answer-id"));

    const answerData = window.jsData.question.answers.find(answer => {
      return answer.databaseId === Number(answerId);
    });

    if (
      !confirm(
        System.data.locale.userContent.notificationMessages
          .doYouWantToConfirmThisContent,
      )
    )
      return;

    const icon = $(".sg-button__icon > div", this);
    const spinner = Spinner({ size: "xxsmall", light: true });

    icon.before(spinner);
    icon.detach();

    try {
      const resConfirm = await new Action().ConfirmAnswer(answerId);

      new Action().CloseModerationTicket(questionData.id);

      // eslint-disable-next-line no-throw-literal
      if (!resConfirm?.success) throw { msg: resConfirm?.message };

      System.log(20, {
        user: {
          nick: answerData.user.nick,
          id: answerData.userId,
        },
        data: [answerId],
      });

      this.remove();
      parentResponseContainer.addClass("brn-content--confirmed");
    } catch (error) {
      console.error(error);
      icon.insertBefore(spinner);
      spinner.remove();
      notification({
        type: "error",
        html:
          error?.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });
    }

    const $reportedText = $(
      "div > div:nth-child(3) > div.js-react-answer-footer-26339823 > div > div.sg-flex.sg-flex--justify-content-space-between.sg-flex--wrap > div.sg-flex.sg-flex--align-items-center.sg-flex--margin-bottom-m > div.sg-flex.sg-flex--margin-left-s",
      responseParentContainer,
    );

    $reportedText.remove();
  }
}
