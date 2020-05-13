import {
  Button,
  ContentBox,
  ContentBoxContent,
  Text,
  Spinner,
} from "@style-guide";
import notification from "../../../components/notification2";
import Action from "../../../controllers/Req/Brainly/Action";
import WaitForElements from "../../../helpers/WaitForElements";

export default async function responseSection() {
  /**
   * @param {JQuery<HTMLElement>} [responseContainers]
   */
  const addButtons = responseContainers => {
    responseContainers.each((_, moderateButtonContainer) => {
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
          size: "small",
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
    });
  };

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target) {
        /**
         * @type {HTMLDivElement}
         */
        // @ts-ignore
        const { target } = mutation;

        if (target.className.includes(window.selectors.responseHeader)) {
          const extActions = target.querySelector(".ext_actions");

          if (!extActions) {
            addButtons(
              $(window.selectors.responseModerateButtonContainer, target),
            );
          }
        }
      }
    });
  });

  const responseParentContainer = await WaitForElements(
    window.selectors.responseParentContainer,
  );

  const mainQuestionArticle = document.querySelector(`.js-main-question`);

  if (
    !mainQuestionArticle ||
    mainQuestionArticle.classList.contains("brn-question--deleted")
  )
    return;

  addButtons(
    $(
      `${window.selectors.responseContainer} ${window.selectors.responseModerateButtonContainer}`,
    ),
  );

  observer.observe(responseParentContainer[0], {
    childList: true,
    subtree: true,
  });

  async function responseModerateButtonsClickHandler() {
    const parentResponseContainer = $(this).parents(
      window.selectors.responseContainer,
    );
    const answerId = Number(parentResponseContainer.data("answer-id"));

    if (!answerId) throw Error("Cannot find the answer id");

    const usersData = $(".js-users-data").data("z");
    const questionData = $(".js-main-question").data("z");
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
      const responseData = {
        model_id: answerId,
        reason_id: reason.category_id,
        reason: reason.text,
        reason_title: reason.title,
      };
      responseData.give_warning = System.canBeWarned(reason.id);
      responseData.take_points = responseData.give_warning;

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
          window.selectors.responseModerateButtonContainer,
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
}
