import secondsToTime from "../../../helpers/secondsToTime";
import { RemoveQuestion, OpenModerationTicket, CloseModerationTicket } from "../../../controllers/ActionsOfBrainly";
import Buttons from "../../../components/Buttons";
import notification from "../../../components/notification";
import extModeratePanel from "../../../components/extModeratePanel";

const ext_actions_buttons_click_handler = async function() {
	let btn_index = $(this).index();
	let $parent_feed = $(this).parents(window.selectors.feed_item);
	let $feedContentBox = $(">.sg-content-box > .sg-box", $parent_feed)
	let question_link = $(window.selectors.questionLink, $parent_feed).attr("href");

	if (question_link != "") {
		let question_id = Number(question_link.split("/").pop());

		if (question_id >= 0) {
			if (btn_index == 0) {
				let ticket = await OpenModerationTicket(question_id);

				if (!ticket) {
					notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
				} else if (!ticket.success) {
					ticket.message && notification(ticket.message, "error");
				} else {
					let $toplayer = extModeratePanel(ticket);
					let $closeIcon = $(".sg-toplayer__close", $toplayer);
					let $counter = $(".js-counter", $toplayer);
					let $categories = $(".categories", $toplayer);
					/*let $categoryRadio = $('input[name="categories"]:checked', $toplayer);
					let $reasons = $('div.reasons', $toplayer);
					let $reasonSeperator = $('div.sg-horizontal-separator', $toplayer);*/
					let $textarea = $('textarea', $toplayer);
					let $take_points = $('#take_points', $toplayer);
					let $return_points = $('#return_points', $toplayer);
					let $give_warning = $('#give_warning', $toplayer);
					let $submit = $('button.js-submit', $toplayer);

					$toplayer.appendTo(window.selectors.toplayerContainer);

					let closeModPanel = async () => {
						let svg = $("svg", $closeIcon);

						$(`<div class="sg-spinner sg-spinner--xxsmall"></div>`).insertBefore(svg);
						svg.remove();
						$closeIcon.off("click");

						let closedTicket = await CloseModerationTicket(question_id);
						let notifyType = "error";

						if (closedTicket.success) {
							notifyType = "info"
						}

						notification(closedTicket.message, notifyType);
						clearInterval(_loop_panelCounter);
						$closeIcon.parents(".js-modal").remove();
					}

					let panelCounter = () => {
						let time = secondsToTime(--ticket.data.ticket.time_left);
						if (time.m == 0 && time.s == 0) {
							clearInterval(_loop_panelCounter);
							closeModPanel();
						}

						$counter.html((time.m <= 9 ? "0" + time.m : time.m) + ":" + (time.s <= 9 ? "0" + time.s : time.s));
					}
					panelCounter();

					let _loop_panelCounter = setInterval(panelCounter, 1000);

					$closeIcon.click(closeModPanel);

					$submit.click(async function() {
						if (!window.selectedCategory) {
							let $selectReasonWarn = $(".selectReasonWarn", $toplayer);
							if ($selectReasonWarn.length == 0) {
								$(`<div class="sg-bubble sg-bubble--bottom sg-bubble--row-start sg-bubble--peach sg-text--light selectReasonWarn">${System.data.locale.common.moderating.selectReason}</div>`).insertBefore($categories)
							} else {
								$selectReasonWarn.fadeTo('fast', 0.5).fadeTo('fast', 1.0).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
							}
						} else {
							$(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`).insertAfter($submit);;
							let taskData = {
								model_id: ticket.data.task.id,
								reason_id: window.selectedCategory.id,
								reason: $textarea.val(),
								give_warning: $give_warning.is(':checked'),
								take_points: $take_points.is(':checked'),
								return_points: $return_points.is(':checked')
							};
							let removing = await RemoveQuestion(taskData);

							if (removing && removing.success) {
								$parent_feed.addClass("deleted");
								$closeIcon.parents(".js-modal").remove();
								clearInterval(_loop_panelCounter);
							}
						}
					});
				}
			} else if (btn_index == 1 || btn_index == 2) {
				setTimeout(async () => {
					if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
						let reason = System.data.Brainly.deleteReasons.__withIds.task[System.data.config.quickDeleteButtonsReasons.task[btn_index - 1]];
						let taskData = {
							model_id: question_id,
							reason_id: reason.category_id,
							reason: reason.text
						};
						taskData.give_warning = System.canBeWarned(reason.id);
						let $svg = $("svg", this);
						let $spinner = $(`<div class="sg-spinner sg-spinner--xxsmall sg-spinner--light"></div>`);

						$spinner.insertBefore($svg);
						$svg.hide();

						let removing = await RemoveQuestion(taskData);

						if (removing) {
							if (removing.success) {
								$parent_feed.addClass("deleted");
							} else if (removing.message) {
								notification(removing.message, "error");
							}
						} else {
							notification(System.data.locale.common.notificationMessages.somethingWentWrong, "error");
						}

						$spinner.remove();
						$svg.show();
					}
				}, 100);
			}
		}
	}
};
$("body").on("click", ".ext_actions button", ext_actions_buttons_click_handler);

let prepareButtons = "";

if (!System.data.config.quickDeleteButtonsReasons) {
	Console.error("Quick delete reasons cannot be found");
} else {
	let data = [{
		text: System.data.locale.common.moderating.moreOptions,
		type: "alt",
		icon: "stream"
	}];

	System.data.config.quickDeleteButtonsReasons.task.forEach((reason, i) => {
		data.push({
			text: System.data.Brainly.deleteReasons.__withIds.task[reason].title,
			title: System.data.Brainly.deleteReasons.__withIds.task[reason].text,
			type: "peach",
			icon: "x"
		});
	});
	prepareButtons = Buttons('RemoveQuestion', data);
}

export default function createQuestionRemoveButtons(nodes) {
	//console.log("nodes:", nodes);
	if (nodes) {
		for (let i = 0, node;
			(node = nodes[i]); i++) {
			node.classList.add("ext-buttons-added");
			let $ext_actions = $(`<div class="ext_actions">${prepareButtons}</div>`);

			$ext_actions.appendTo($(window.selectors.feeds_questionsBox_buttonList, node));
		}
	}
}
