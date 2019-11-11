import { Button, ContentBox, ContentBoxContent, Text } from "@style-guide";
import notification from "../../../components/notification2";
import Action from "../../../controllers/Req/Brainly/Action";
import WaitForElement from "../../../helpers/WaitForElement";

export default async function responseSection() {
  /**
   * @param {JQuery<HTMLElement>} [responseContainers]
   */
  const addButtons = (responseContainers) => {
    responseContainers.each((i, moderateButtonContainer) => {
      let extButtonsContainer = ContentBox({
        className: "ext_actions",
      });

      moderateButtonContainer.after(extButtonsContainer);

      System.data.config.quickDeleteButtonsReasons.response.forEach(
        (id, i) => {
          let reason = System.DeleteReason({
            id,
            type: "response",
          });
          let button = Button({
            type: "destructive",
            size: "small",
            icon: Text({
              text: i + 1,
              weight: "bold",
              color: "white",
            }),
            text: reason.title,
            title: reason.text
          });
          let buttonContainer = ContentBoxContent({
            children: button,
            spacedTop: "small",
          });

          extButtonsContainer.append(buttonContainer);
        });
    });
  }
  addButtons($(window.selectors.responseContainer + " " + window.selectors
    .responseModerateButtonContainer));

  let observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target) {
        /**
         * @type {HTMLDivElement}
         */
        // @ts-ignore
        let target = mutation.target;

        if (
          target.className.includes(window.selectors
            .responseHeader)
        ) {
          let ext_actions = target.querySelector(".ext_actions");

          if (!ext_actions) {
            addButtons($(window.selectors
              .responseModerateButtonContainer, target));
          }
        }
      }
    })
  });

  let responseParentContainer = await WaitForElement(window.selectors
    .responseParentContainer);
  observer.observe(responseParentContainer[0], {
    childList: true,
    subtree: true
  });

  $(window.selectors.responseContainer).on("click", ".ext_actions button",
    responseModerateButtonsClickHandler);
}

async function responseModerateButtonsClickHandler() {
  let parentResponseContainer = $(this).parents(window.selectors
    .responseContainer);
  let answer_id = Number(parentResponseContainer.data("answer-id"));

  if (!answer_id)
    throw "Cannot find the answer id";

  let usersData = $(".js-users-data").data("z");
  let questionData = $(".js-main-question").data("z");
  let answer = questionData.responses.find(response => response.id ==
    answer_id);
  let user = usersData[answer.userId];

  if (!user)
    throw "Cannot find the user data";

  let btn_index = $(this).parent().index();
  let reason = System.DeleteReason({
    id: System
      .data.config.quickDeleteButtonsReasons.response[btn_index],
    type: "response",
    noRandom: true,
  });

  let confirmDeleting = System.data.locale.common.moderating
    .doYouWantToDeleteWithReason
    .replace("%{reason_title}", reason.title)
    .replace("%{reason_message}", reason.text);

  if (confirm(confirmDeleting)) {
    let responseData = {
      model_id: answer_id,
      reason_id: reason.category_id,
      reason: reason.text,
      reason_title: reason.title
    };
    responseData.give_warning = System.canBeWarned(reason.id);
    let svg = $("svg", this);

    $(`<div class="sg-spinner sg-spinner--xxsmall sg-spinner--light"></div>`)
      .insertBefore(svg);
    svg.remove();

    let res = await new Action().RemoveAnswer(responseData);
    await new Action().CloseModerationTicket(questionData.id);

    if (!res || !res.success)
      return notification({
        type: "error",
        html: (res && res.message) || System.data.locale.common
          .notificationMessages.somethingWentWrong
      });

    System.log(6, { user, data: [answer_id] });
    parentResponseContainer.addClass("brn-question--deleted");
    $(window.selectors.responseModerateButtonContainer,
      parentResponseContainer).remove();
    $(this).parents(".ext_actions").remove();
  }
};
