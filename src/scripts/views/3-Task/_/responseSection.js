import Button from "../../../components/Button";
import notification from "../../../components/notification";
import Action from "../../../controllers/Req/Brainly/Action";
import WaitForElement from "../../../helpers/WaitForElement";
import WaitForObject from "../../../helpers/WaitForObject";

export default async function responseSection() {
  let $responseModerateButtons = $(`
  <div class="sg-actions-list__hole">
    <div class="sg-actions-list sg-actions-list--to-right sg-actions-list--no-wrap">
      <div class="sg-content-box" style="height: 0;">
        <ul class="sg-list ext_actions"></ul>
      </div>
		</div>
  </div>`);
  let $buttonContainerList = $(".sg-list", $responseModerateButtons);

  System.data.config.quickDeleteButtonsReasons.response.forEach(id => {
    let reason = System.data.Brainly.deleteReasons.__withIds.response[id];
    let $buttonContainer = $(`<li class="sg-list__element sg-actions-list--to-right"></li>`);

    let $button = Button({
      type: "destructive",
      size: "xsmall",
      icon: "x",
      text: reason.title,
      title: reason.text
    });

    $button.appendTo($buttonContainer);
    $buttonContainer.appendTo($buttonContainerList);
  });

  let cloneResponseModerateButtons = () => $responseModerateButtons.clone();
  cloneResponseModerateButtons().insertAfter(selectors.responseContainer + selectors.responseModerateButtonContainer);

  let _$_observe = await WaitForObject("$().observe");

  if (_$_observe) {
    let responseParentContainer = await WaitForElement(selectors.responseParentContainer);

    $(responseParentContainer).observe('added', 'div.js-answer-react', e => {
      cloneResponseModerateButtons().insertAfter($(selectors.responseContainer + selectors.responseModerateButtonContainer, e.addedNodes));
    });
  }

  $(selectors.responseContainer).on("click", ".ext_actions button", responseModerateButtonsClickHandler);
}

async function responseModerateButtonsClickHandler() {
  let parentResponseContainer = $(this).parents(selectors.responseContainer);
  let answer_id = Number(parentResponseContainer.data("answer-id"));

  if (!answer_id)
    throw "Cannot find the answer id";

  let usersData = $(".js-users-data").data("z");
  let questionData = $(".js-main-question").data("z");
  let answer = questionData.responses.find(response => response.id == answer_id);
  let user = usersData[answer.userId];

  if (!user)
    throw "Cannot find the user data";

  let btn_index = $(this).parent().index();
  let reason = System.data.Brainly.deleteReasons.__withIds.response[System.data.config.quickDeleteButtonsReasons.response[btn_index]];

  if (!reason || !reason.id)
    throw "Can't find the reason";

  let confirmDeleting = System.data.locale.common.moderating.doYouWantToDeleteWithReason
    .replace("%{reason_title}", reason.title)
    .replace("%{reason_message}", reason.text);

  if (confirm(confirmDeleting)) {
    let responseData = {
      model_id: answer_id,
      reason_id: reason.category_id,
      reason: reason.text
    };
    responseData.give_warning = System.canBeWarned(reason.id);
    let svg = $("svg", this);

    $(`<div class="sg-spinner sg-spinner--xxsmall sg-spinner--light"></div>`).insertBefore(svg);
    svg.remove();

    let res = await new Action().RemoveAnswer(responseData);
    await new Action().CloseModerationTicket(questionData.id);

    if (!res || !res.success)
      return notification((res && res.message) || System.data.locale.common.notificationMessages.somethingWentWrong, "error");

    System.log(6, { user, data: [answer_id] });
    parentResponseContainer.addClass("brn-question--deleted");
    $(selectors.responseModerateButtonContainer, parentResponseContainer).remove();
    $responseModerateButtons.remove();
  }
};
