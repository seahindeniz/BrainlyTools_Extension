import notification from "../../../components/notification";
import {
  Button,
  ContentBox,
  ContentBoxContent,
  Text
} from "../../../components/style-guide";
import Action from "../../../controllers/Req/Brainly/Action";

export default function taskSection() {
  let moderateButtonContainer = document.querySelector(window.selectors
    .taskModerateButtonContainer);

  if (!moderateButtonContainer)
    return;

  let extButtonsContainer = ContentBox({
    className: "ext_actions",
  });

  moderateButtonContainer.after(extButtonsContainer);

  System.data.config.quickDeleteButtonsReasons.task.forEach(
    (id, i) => {
      let reason = System.data.Brainly.deleteReasons.__withIds.task
      [id];
      let button = Button({
        type: "destructive",
        size: "small",
        icon: Text({
          text: i + 1,
          weight: "bold",
          color: "white",
        }),
        text: reason.title,
        title: reason.text,
        reasonId: reason.id,
      });
      let buttonContainer = ContentBoxContent({
        children: button,
        spacedTop: "small",
      });

      extButtonsContainer.append(buttonContainer);
    });

  let taskModerateButtonsClickHandler = async function() {
    // @ts-ignore
    let $parentArticle = $(this).parents(window.selectors.articleQuestion);
    let question_id = Number($parentArticle.data("question-id"));

    if (!question_id)
      throw "Cannot find the question id";

    let userData = ($parentArticle.data("user"));

    if (!userData)
      throw "Cannot find the user data";

    let reason = System.data.Brainly.deleteReasons.__withIds.task[this
      .reasonId];

    if (!reason || !reason.id)
      throw "Can't find the reason";

    let confirmDeleting = System.data.locale.common.moderating
      .doYouWantToDeleteWithReason
      .replace("%{reason_title}", reason.title)
      .replace("%{reason_message}", reason.text);

    if (confirm(confirmDeleting)) {
      let taskData = {
        model_id: question_id,
        reason_id: reason.category_id,
        reason: reason.text,
        reason_title: reason.title
      };
      taskData.give_warning = System.canBeWarned(reason.id);
      let svg = $("svg", this);
      let spinner = $(
        `<div class="sg-spinner sg-spinner--xxsmall sg-spinner--light"></div>`
      ).insertBefore(svg);

      svg.hide();

      let res = await new Action().RemoveQuestion(taskData);
      //let res = { success: true }; await System.Delay();

      new Action().CloseModerationTicket(question_id);

      if (!res || !res.success)
        return notification((res && res.message) || System.data.locale
          .common.notificationMessages.somethingWentWrong, "error");

      System.log(5, { user: userData, data: [question_id] });
      $parentArticle.addClass("brn-question--deleted");
      // @ts-ignore
      $(window.selectors.taskModerateButton).remove();
      extButtonsContainer.remove();

      spinner.remove();
      svg.show();
    }
  };
  $("button", extButtonsContainer).on("click", taskModerateButtonsClickHandler);
}
