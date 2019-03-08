import { RemoveQuestion, CloseModerationTicket } from "../../../controllers/ActionsOfBrainly";
import Buttons from "../../../components/Buttons";
import notification from "../../../components/notification";
import QuickDeleteButton from "../../1-Home/_/QuickDeleteButton";

/**
 * Prepare and add quick delete buttons to question box
 */
export default function taskSection() {
	let buttonData = [];

	System.data.config.quickDeleteButtonsReasons.task.forEach(id => {
		let reason = System.data.Brainly.deleteReasons.__withIds.task[id];

		buttonData.push({
			text: reason.title,
			title: reason.text,
			type: "peach",
			icon: "x"
		});
	});
	let taskDeleteButtons = Buttons('RemoveQuestion', buttonData, `<li class="sg-list__element  sg-actions-list--to-right">{button}</li>`);

	let $taskModerateButtons = $(`
	<div class="sg-actions-list sg-actions-list--to-right sg-actions-list--no-wrap">
		<div class="sg-content-box" style="height: 0;">
			<ul class="sg-list ext_actions">
				${taskDeleteButtons}
			</ul>
		</div>
	</div>`);

	$taskModerateButtons.insertAfter(selectors.taskModerateButtonContainer);

	let taskModerateButtonsClickHandler = async function() {
		let btn_index = $(this).parent().index();
		let $parentArticle = $(this).parents(selectors.articleQuestion);
		let question_id = Number($parentArticle.data("question-id"));
		let userData = ($parentArticle.data("user"));

		if (!question_id) {
			Console.error("Cannot find the question id");
		} else if (!userData) {
			Console.error("Cannot find the user data");
		} else {
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

				let res = await RemoveQuestion(taskData);

				CloseModerationTicket(question_id);

				if (!res || !res.success) {
					notification((res && res.message) || System.data.locale.common.notificationMessages.somethingWentWrong, "error");
				} else {
					System.log(5, { user: userData, data: [question_id] });
					$parentArticle.addClass("brn-question--deleted");
					$(selectors.taskModerateButton).remove();
					$taskModerateButtons.remove();
				}

				spinner.remove();
				svg.show();
			}
		}
	};
	$("button", $taskModerateButtons).on("click", taskModerateButtonsClickHandler);
}
/* export default function() {
	let $buttonContainer = $(`
	<div class="sg-actions-list" style="width: 2em;position: absolute;right: 0;">
		<div class="sg-actions-list__hole sg-actions-list__hole--no-spacing ext_actions"></div>
	</div>
	`);
	let $buttonHole = $(".sg-actions-list__hole", $buttonContainer);

	$buttonContainer.insertAfter(selectors.taskModerateButtonContainer);
	System.data.config.quickDeleteButtonsReasons.task.forEach(id => {
		let $button = new QuickDeleteButton(id, this);

		$button.appendTo($buttonHole);
	});
}
 */
