import Button from "../../../components/Button";
import notification from "../../../components/notification";
import Action from "../../../controllers/Req/Brainly/Action";

export default function taskSection() {
  let $taskModerateButtons = $(`
	<div class="sg-actions-list sg-actions-list--to-right sg-actions-list--no-wrap">
		<div class="sg-content-box" style="height: 0;">
			<ul class="sg-list ext_actions"></ul>
		</div>
	</div>`);
  let $buttonContainerList = $(".sg-list", $taskModerateButtons);

  $taskModerateButtons.insertAfter(selectors.taskModerateButtonContainer);

  System.data.config.quickDeleteButtonsReasons.task.forEach(id => {
    let reason = System.data.Brainly.deleteReasons.__withIds.task[id];
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

  let taskModerateButtonsClickHandler = async function() {
    let btn_index = $(this).parent().index();
    let $parentArticle = $(this).parents(selectors.articleQuestion);
    let question_id = Number($parentArticle.data("question-id"));
    let userData = ($parentArticle.data("user"));

    if (!question_id)
      console.error("Cannot find the question id");
    else if (!userData)
      console.error("Cannot find the user data");
    else {
      if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
        let reason = System.data.Brainly.deleteReasons.__withIds.task[System.data.config.quickDeleteButtonsReasons.task[btn_index]];
        let taskData = {
          model_id: question_id,
          reason_id: reason.category_id,
          reason: reason.text
        };
        taskData.give_warning = System.canBeWarned(reason.id);
        let svg = $("svg", this);
        let spinner = $(`<div class="sg-spinner sg-spinner--xxsmall sg-spinner--light"></div>`).insertBefore(svg);

        svg.hide();

        let res = await new Action().RemoveQuestion(taskData);

        new Action().CloseModerationTicket(question_id);

        if (!res || !res.success)
          return notification((res && res.message) || System.data.locale.common.notificationMessages.somethingWentWrong, "error");

        System.log(5, { user: userData, data: [question_id] });
        $parentArticle.addClass("brn-question--deleted");
        $(selectors.taskModerateButton).remove();
        $taskModerateButtons.remove();

        spinner.remove();
        svg.show();
      }
    }
  };
  $("button", $taskModerateButtons).on("click", taskModerateButtonsClickHandler);
}
