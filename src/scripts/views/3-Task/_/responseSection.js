import { RemoveAnswer, CloseModerationTicket } from "../../../controllers/ActionsOfBrainly";
import Buttons from "../../../components/Buttons";
import WaitForObject from "../../../helpers/WaitForObject";
import WaitForElement from "../../../helpers/WaitForElement";
import notification from "../../../components/notification";

/**
 * Prepare and add quick delete buttons to answer boxes
 */
export default async function responseSection() {
	let responseDeleteButtons = Buttons('RemoveQuestion', [{
			text: System.data.Brainly.deleteReasons.__withIds.response[System.data.config.quickDeleteButtonsReasons.response[0]].title,
			title: System.data.Brainly.deleteReasons.__withIds.response[System.data.config.quickDeleteButtonsReasons.response[0]].text,
			type: "peach",
			icon: "x"
		},
		{
			text: System.data.Brainly.deleteReasons.__withIds.response[System.data.config.quickDeleteButtonsReasons.response[1]].title,
			title: System.data.Brainly.deleteReasons.__withIds.response[System.data.config.quickDeleteButtonsReasons.response[1]].text,
			type: "peach",
			icon: "x"
		},
		{
			text: System.data.Brainly.deleteReasons.__withIds.response[System.data.config.quickDeleteButtonsReasons.response[2]].title,
			title: System.data.Brainly.deleteReasons.__withIds.response[System.data.config.quickDeleteButtonsReasons.response[2]].text,
			type: "peach",
			icon: "x"
		}
	], `<li class="sg-list__element  sg-actions-list--to-right">{button}</li>`);

	let $responseModerateButtons = $(`
	<div class="sg-actions-list sg-actions-list--to-right sg-actions-list--no-wrap">
		<div class="sg-content-box" style="height: 0;">
			<ul class="sg-list ext_actions">
				${responseDeleteButtons}
			</ul>
		</div>
	</div>`);

	let cloneResponseModerateButtons = () => $responseModerateButtons.clone();
	cloneResponseModerateButtons().insertAfter(selectors.responseContainer + selectors.responseModerateButtonContainer);

	let _$_observe = await WaitForObject("$().observe");

	if (_$_observe) {
		let responseParentContainer = await WaitForElement(selectors.responseParentContainer);

		$(responseParentContainer).observe('added', 'div.js-answer-react', e => {
			cloneResponseModerateButtons().insertAfter($(selectors.responseContainer + selectors.responseModerateButtonContainer, e.addedNodes));
		});
	}

	let responseModerateButtonsClickHandler = async function() {
		let btn_index = $(this).parent().index();
		let parentResponseContainer = $(this).parents(selectors.responseContainer);
		let answer_id = Number(parentResponseContainer.data("answer-id"));
		let taskId = $(".js-main-question.brn-question").data("question-id");

		if (answer_id > 0) {
			if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
				let reason = System.data.Brainly.deleteReasons.__withIds.response[System.data.config.quickDeleteButtonsReasons.response[btn_index]];
				let responseData = {
					model_id: answer_id,
					reason_id: reason.category_id,
					reason: reason.text
				};
				responseData.give_warning = System.canBeWarned(reason.id);
				let svg = $("svg", this);

				$(`<div class="sg-spinner sg-spinner--xxsmall sg-spinner--light"></div>`).insertBefore(svg);
				svg.remove();

				let res = await RemoveAnswer(responseData);
				await CloseModerationTicket(taskId);

				if (!res || !res.success) {
					notification((res && res.message) || System.data.locale.common.notificationMessages.somethingWentWrong, "error");
				} else {
					parentResponseContainer.addClass("brn-question--deleted");
					$(selectors.responseModerateButtonContainer, parentResponseContainer).remove();
					$responseModerateButtons.remove();
				}
			}
		} else {
			Console.error("Cannot find the answer id");
		}
	};
	$(selectors.responseParentContainer).on("click", selectors.responseContainer + " " + selectors.responseModerateButtonContainer + ":last-child button", responseModerateButtonsClickHandler);
}
