"use strict";

import WaitForElement from "../../helpers/WaitForElement";
import WaitForObject from "../../helpers/WaitForObject";
import { RemoveQuestion, RemoveAnswer, RemoveComment, ConfirmQuestion, ConfirmAnswer, ConfirmComment } from "../../controllers/ActionsOfBrainly";
import Buttons from "../../components/Buttons";
import notification from "../../components/notification";

import "./_/pagination";
import layoutChanger from "./_/layoutChanger";

window.selectors = {
	moderationItemParent: "#moderation-all > div.content",
	moderationItemFooter: "div.content > div.footer",
	moderationItemType: "> div.header > span.qa",
	panelCloseIcon: "#toplayer > div.contener-center.mod > div.moderation > div.title > div.options > div.close",
	taskUrl: "> div.header a.task-url"
}

System.pageLoaded("Arcive Mod page OK!");
ArciveMod();

async function ArciveMod() {
	layoutChanger();

	if (System.checkUserP([1, 2, 45])) {
		/**
		 *  Adding remove buttons inside of question boxes
		 **/
		let prepareButtons = {
			task: true,
			response: true,
			comment: true
		};

		$.each(System.data.config.quickDeleteButtonsReasons, (key, reasons) => {
			if (prepareButtons[key]) {
				let data = [];

				reasons.forEach((reason, i) => {
					data.push({
						text: i + 1,
						title: System.data.Brainly.deleteReasons.__withIds[key][reason].title + ":\n" + System.data.Brainly.deleteReasons.__withIds[key][reason].text,
						type: "peach " + key
					});
				});

				prepareButtons[key] = Buttons('RemoveQuestionNoIcon', data, `<div class="sg-spinner-container">{button}</div>`);
			}
		});

		let confirmButton = Buttons('RemoveQuestionNoIcon', {
			text: "✓",
			class: "confirm",
			title: System.data.locale.common.moderating.confirm,
		}, `<div class="sg-spinner-container">{button}</div>`);

		prepareButtons.task += confirmButton;
		prepareButtons.response += confirmButton;
		prepareButtons.comment += confirmButton;

		let createQuickDeleteButtons = nodes => {
			if (nodes) {
				for (let i = 0, node;
					(node = nodes[i]); i++) {
					//let itemType = $(selectors.moderationItemType, node).text();
					node.classList.add("ext-buttons-added");
					//node.setAttribute("data-type", itemType == "Q" ? "task" : itemType == "A" ? "response" : "comment");
					let obj = Zadanium.getObject(node.getAttribute("objecthash"));
					let $footer = $(selectors.moderationItemFooter, node);

					if (System.checkUserP(obj.data.model_type_id)) {
						$("> div", $footer).hide();
						let itemType = obj.data.model_type_id == 1 ? "task" : obj.data.model_type_id == 2 ? "response" : "comment";
						let $extActionButtons = $(`<div class="ext-action-buttons sg-content-box__content--with-centered-text">${prepareButtons[itemType]}</div>`);

						//$footer.html("");
						prepareButtons[itemType] && $footer.append($extActionButtons);
					}
				}
			}
		}
		let quickDeleteButtonsHandler = async function() {
			let btn_index = $(this).index();
			let $moderation_item = $(this).parents(".moderation-item");

			let obj = Zadanium.getObject($moderation_item.attr("objecthash"));

			let $itemContent = $("> div.content ", $moderation_item);

			if (obj && obj.data && obj.data.model_id && obj.data.model_id >= 0) {
				let contentType = obj.data.model_type_id == 1 ? "task" : obj.data.model_type_id == 2 ? "response" : "comment";

				if ($(this).is(".confirm")) {
					if (confirm(System.data.locale.common.moderating.notificationMessages.doYouWantToConfirmThisContent)) {
						let res;
						let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small sg-spinner--light"></div></div>`).appendTo(this);
						let $extActions = $(this).parents(".ext-action-buttons");

						$extActions.addClass("is-deleting");

						if (contentType == "task") {
							res = await ConfirmQuestion(obj.data.model_id);

							System.log(19, obj.data.user, [obj.data.model_id]);
						} else if (contentType == "response") {
							res = await ConfirmAnswer(obj.data.model_id);

							System.log(20, obj.data.user, [obj.data.model_id]);
						} else if (contentType == "comment") {
							res = await ConfirmComment(obj.data.model_id);

							System.log(21, obj.data.user, [obj.data.model_id]);
						}

						$spinner.remove();

						if (!res) {
							notification(System.data.locale.common.notificationMessages.operationError, "error");
						} else {
							if (!res.success) {
								notification(res.message || System.data.locale.common.notificationMessages.somethingWentWrong, "error");
							} else {
								$moderation_item.addClass("confirmed");
								$extActions.removeClass("is-deleting");
								$(this).remove();
							}
						}
					}
				} else if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
					let reason = System.data.Brainly.deleteReasons.__withIds[contentType][System.data.config.quickDeleteButtonsReasons[contentType][btn_index]];
					let data = {
						model_id: obj.data.model_id,
						reason_id: reason.category_id,
						reason: reason.text
					};
					data.give_warning = System.canBeWarned(reason.id);
					let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small sg-spinner--light"></div></div>`).appendTo(this);
					let $extActions = $(this).parents(".ext-action-buttons");

					$extActions.addClass("is-deleting");

					let onRes = res => {
						if (res) {
							if (res.success) {
								$moderation_item.addClass("removed");
								$(this).parent().remove();
								if (contentType == "task") {
									$(selectors.panelCloseIcon).click();
								} else if (contentType == "response") {
									$moderation.classList.add("removed");
									$("button.resign", $moderation).click();
									$("> div.header > div.actions", $moderation).remove();
								}
							} else if (res.message) {
								Zadanium.toplayer.createdObjects[Zadanium.toplayer.createdObjects.length - 1].data.toplayer.setMessage(res.message, "failure")
							}
						} else {
							Zadanium.toplayer.createdObjects[Zadanium.toplayer.createdObjects.length - 1].data.toplayer.setMessage(System.data.locale.common.notificationMessages.somethingWentWrong, "failure")
						}
						$spinner.remove();
					};

					if (contentType == "task") {
						let res = await RemoveQuestion(data);

						System.log(5, obj.data.user, [data.model_id]);
						onRes(res);
					} else if (contentType == "response") {
						let res = await RemoveAnswer(data);

						System.log(6, obj.data.user, [data.model_id]);
						onRes(res);
					} else if (contentType == "comment") {
						let res = await RemoveComment(data);

						System.log(7, obj.data.user, [data.model_id]);
						onRes(res);
					}
				}

			}
		};
		$("body").on("click", ".ext-action-buttons button", quickDeleteButtonsHandler);

		/**
		 * Manipulate moderation panel
		 */
		let prepareQuickDeleteButtons = {
			task: true,
			response: true
		};

		$.each(System.data.config.quickDeleteButtonsReasons, (key, reasons) => {
			if (prepareQuickDeleteButtons[key]) {
				let data = [];

				reasons.forEach((reason, i) => {
					data.push({
						text: System.data.Brainly.deleteReasons.__withIds[key][reason].title,
						title: System.data.Brainly.deleteReasons.__withIds[key][reason].text,
						type: "peach sg-button-secondary--small"
					});
				});

				prepareQuickDeleteButtons[key] = Buttons('RemoveQuestionNoIcon', data);
			}
		});

		let manipulateModPanel = $toplayer => {
			$("> div:not(.moderation-taskline)", $toplayer).each(function(i, $moderation) {
				let contentType = $moderation.getAttribute("class").replace(/\w{1,}\-|[0-9.]| {1,}\w{1,}|\-| {1,}/g, "");
				let contentType_id = contentType == "task" ? 1 : contentType == "response" ? 2 : 45;

				System.checkUserP(contentType_id, () => {
					let contentID = $moderation.getAttribute("class").replace(/[^0-9.]/g, "");
					let $actions = $("> div.header > div.actions", $moderation);
					let $quickDeleteButtons = $(`<div class="actions pull-right quickDeleteButtons">${prepareQuickDeleteButtons[contentType]}</div>`);

					$quickDeleteButtons.insertAfter($actions);

					$("button", $quickDeleteButtons).click(async function() {
						let btn_index = $(this).index();

						if (contentID >= 0) {
							if (confirm(System.data.locale.common.moderating.doYouWantToDelete)) {
								let reason = System.data.Brainly.deleteReasons.__withIds[contentType][System.data.config.quickDeleteButtonsReasons[contentType][btn_index]];
								let data = {
									model_id: contentID,
									reason_id: reason.category_id,
									reason: reason.text
								};
								let spinner = $(`<div class="sg-spinner sg-spinner--xxsmall sg-spinner--light"></div>`).appendTo(this);

								let onRes = res => {
									if (res) {
										if (res.success) {
											if (contentType == "task") {
												$(selectors.panelCloseIcon).click();
											} else if (contentType == "response") {
												$moderation.classList.add("removed");
												$("button.resign", $moderation).click();
												$("> div.header > div.actions", $moderation).remove();
											}
										} else if (res.message) {
											Zadanium.toplayer.createdObjects[Zadanium.toplayer.createdObjects.length - 1].data.toplayer.setMessage(res.message, "failure")
										}
									} else {
										Zadanium.toplayer.createdObjects[Zadanium.toplayer.createdObjects.length - 1].data.toplayer.setMessage(System.data.locale.common.notificationMessages.somethingWentWrong, "failure")
									}
									spinner.remove();
								};

								let obj = Zadanium.getObject($($toplayer).attr("objecthash"));

								if (contentType == "task") {
									let user = Zadanium.users.getUserObject(obj.data.task.user.id);

									let res = await RemoveQuestion(data);

									onRes(res);
									System.log(5, user.data, [contentID]);
								} else if (contentType == "response") {
									let response = obj.data.responses.find(res => {
										return res.id == contentID;
									});
									let user = Zadanium.users.getUserObject(response.user_id);

									let res = await RemoveAnswer(data);

									onRes(res);
									System.log(6, user.data, [contentID]);
								}
							}

						}
					});
				});
			});
		}

		let _$_observe = await WaitForObject("$().observe");

		if (_$_observe) {
			(async () => {
				let moderationItemParent = await WaitForElement(selectors.moderationItemParent);

				//moderationItemParent[0].classList.add("quickDelete");
				$(moderationItemParent).observe('added', 'div.moderation-item:not(.ext-buttons-added)', e => {
					createQuickDeleteButtons(e.addedNodes);
				});

				let e = await WaitForElement('div.moderation-item:not(.ext-buttons-added)', true);
				createQuickDeleteButtons(e);
			})();

			$("#toplayer").observe('added', '.moderation-toplayer', e => {
				manipulateModPanel(e.addedNodes[0])
			});
		}
	}

	/**
	 * Right/Left arrow actions for toplayers
	 */

	const nextObjFound = (nextObj, objContenerMod) => {
		if (nextObj) {
			//objZ.closeTicket();
			objContenerMod.elements.close.click();
			$('#toplayer, #toplayer > div.contener-center.mod').show();
			//nextObj.openToplayer();
			nextObj.elements.openToplayerButton.click();
		}
	}
	let findNext = async (k, action, objContenerMod) => {
		let currentObj = Zadanium.moderation.all.createdObjects[k];

		if (currentObj) {
			if (currentObj.data.disabled) {;
				findNext(action == "previousReport" ? --k : ++k, action, objContenerMod);
			} else {
				nextObjFound(currentObj, objContenerMod);
			}
		} else {
			if (action == "next") {
				let loaderMsg = $("#moderation-all > div.content > div.loader.calm > div.loadMore").text();

				objContenerMod.elements.close.click();
				$('#toplayer, #toplayer > div.contener-center.mod').show();

				Zadanium.moderation.all.getContent();

				let _createdObject = await WaitForObject(`Zadanium.moderation.all.createdObjects[${Zadanium.moderation.all.createdObjects.length + 1}]`);

				if (_createdObject) {
					findNext(k, action, objContenerMod);

				};

				let _msgText = await WaitForObject(`
				let msgText = $("#moderation-all > div.content > div.loader.calm > div.loadMore").text();
				(msgText!= "" && msgText != "${loaderMsg}") || undefined
			`);

				if (_$_observe) {
					objContenerMod.elements.close.click();
				}
			} else {
				objContenerMod.elements.close.click();
			}
		}
	}
	let toplayer = await WaitForElement("#toplayer");
	let $toplayer = $(toplayer);

	const switchModerate = function(e) {
		if (typeof e == "string" || e.target.classList.contains("moderation")) {
			let action = "";

			if (typeof e == "string") {
				action = e;
			} else {
				let toplayerOffset = e.offsetX;
				let arrowOffset = e.target.offsetWidth;

				if (toplayerOffset > arrowOffset) {
					action = "next";
				} else if (toplayerOffset < 0) {
					action = "previousReport"
				}
			}

			if (action != "") {
				let $contenerMod = $(".contener-center.mod", toplayer);
				let objContenerMod = Zadanium.getObject($contenerMod.attr("objecthash"));

				if (action == "closePanel") {
					objContenerMod.elements.close.click();
				} else {
					let $moderationToplayer = $(".moderation-toplayer:visible", toplayer);
					let objZ = Zadanium.getObject($moderationToplayer.attr("objecthash"));
					let taskId = objZ.data.task.id;

					Zadanium.moderation.all.createdObjects.forEach((obj, i) => {
						if (obj.data.task_id == taskId) {
							findNext(action == "previousReport" ? i - 1 : i + 1, action, objContenerMod);
						}
					});
				}
			}
		}
	};

	$toplayer.on('mouseup', 'div.contener.mod.moderation', switchModerate);
	$("body").on("keyup", function(e) {
		console.log(e.keyCode);
		if (
			$toplayer.is(':visible') &&
			!(
				/textarea|input/gi.exec(e.target.type)
			)
		) {
			if (e.keyCode === 65 || e.keyCode === 37) { // A
				switchModerate("previousReport");
			} else if (e.keyCode === 68 || e.keyCode === 39) { // D
				switchModerate("next");
			} else if (e.keyCode === 27) { // ESC
				switchModerate("closePanel");
			}
		}
	});
}
