"use strict";

import WaitForElm from "../../helpers/WaitForElm";
import WaitForFn from "../../helpers/WaitForFn";
import { RemoveQuestion, RemoveAnswer, RemoveComment, ConfirmComment } from "../../controllers/ActionsOfBrainly";
import { GetModerateAllPages } from "../../controllers/ActionsOfServer";
import Buttons from "../../components/Buttons";
import Storage from "../../helpers/extStorage";
import Notification from "../../components/Notification";

System.pageLoaded("Arcive Mod page OK!");

let selectors = {
	moderationItemParent: "#moderation-all > div.content",
	moderationItemFooter: "div.content > div.footer",
	moderationItemType: "> div.header > span.qa",
	panelCloseIcon: "#toplayer > div.contener-center.mod > div.moderation > div.title > div.options > div.close",
	taskUrl: "> div.header a.task-url"
}

System.checkUserP([1, 2, 45], () => {
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
	prepareButtons.comment += Buttons('RemoveQuestionNoIcon', {
		text: "✓",
		class: "confirm",
		title: System.data.locale.common.moderating.confirm,
	}, `<div class="sg-spinner-container">{button}</div>`);
	console.log(prepareButtons);
	let createQuickDeleteButtons = nodes => {
		if (nodes) {
			for (let i = 0, node;
				(node = nodes[i]); i++) {
				//let itemType = $(selectors.moderationItemType, node).text();
				node.classList.add("ext-buttons-added");
				//node.setAttribute("data-type", itemType == "Q" ? "task" : itemType == "A" ? "response" : "comment");
				let obj = Zadanium.getObject(node.getAttribute("objecthash"));
				let $footer = $(selectors.moderationItemFooter, node);

				System.checkUserP(obj.data.model_type_id, () => {
					$("> div", $footer).hide();
					let itemType = obj.data.model_type_id == 1 ? "task" : obj.data.model_type_id == 2 ? "response" : "comment";
					let $extActionButtons = $(`<div class="ext-action-buttons sg-content-box__content--with-centered-text">${prepareButtons[itemType]}</div>`);

					//$footer.html("");
					prepareButtons[itemType] && $footer.append($extActionButtons);
				});
			}
		}
	}
	let ext_actions_buttons_click_handler = function() {
		let btn_index = $(this).index();
		let $moderation_item = $(this).parents(".moderation-item");

		let obj = Zadanium.getObject($moderation_item.attr("objecthash"));

		let $itemContent = $("> div.content ", $moderation_item);
		if (obj && obj.data && obj.data.model_id && obj.data.model_id >= 0) {
			let contentType = obj.data.model_type_id == 1 ? "task" : obj.data.model_type_id == 2 ? "response" : "comment";

			if ($(this).is(".confirm")) {
				if (confirm(System.data.locale.common.moderating.doYouWantToConfirmComment)) {
					let $spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small sg-spinner--light"></div></div>`).appendTo(this);
					let $extActions = $(this).parents(".ext-action-buttons");

					$extActions.addClass("is-deleting");
					ConfirmComment(obj.data.model_id, res => {
						$spinner.remove();

						if (!res) {
							Notification(System.data.locale.common.notificationMessages.operationError, "error");
						} else {
							if (!res.success) {
								Notification(res.message || System.data.locale.common.notificationMessages.somethingWentWrong, "error");
							} else {
								$moderation_item.addClass("confirmed");
								$extActions.removeClass("is-deleting");
								$(this).remove();
							}
						}
					});
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
					System.log(5, obj.data.user, [data.model_id]);
					RemoveQuestion(data, onRes);
				} else if (contentType == "response") {
					System.log(6, obj.data.user, [data.model_id]);
					RemoveAnswer(data, onRes);
				} else if (contentType == "comment") {
					System.log(7, obj.data.user, [data.model_id]);
					RemoveComment(data, onRes);
				}
			}

		}
	};
	$("body").on("click", ".ext-action-buttons button", ext_actions_buttons_click_handler);

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

				$("button", $quickDeleteButtons).click(function() {
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

								System.log(5, user.data, [contentID]);

								RemoveQuestion(data, onRes);
							} else if (contentType == "response") {
								let response = obj.data.responses.find(res => {
									return res.id == contentID;
								});
								let user = Zadanium.users.getUserObject(response.user_id);

								System.log(6, user.data, [contentID]);

								RemoveAnswer(data, onRes);
							}
						}

					}
				});
			});
		});
	}

	let observeForNewModerationItem = moderationItemParent => {
		//moderationItemParent[0].classList.add("quickDelete");
		WaitForElm('div.moderation-item:not(.ext-buttons-added)', e => {
			createQuickDeleteButtons(e);
		});
		$(moderationItemParent).observe('added', 'div.moderation-item:not(.ext-buttons-added)', e => {
			createQuickDeleteButtons(e.addedNodes);
		});
	};

	let observeFound = () => {
		WaitForElm(selectors.moderationItemParent, observeForNewModerationItem);
		$("#toplayer").observe('added', '.moderation-toplayer', e => {
			manipulateModPanel(e.addedNodes[0])
		});
	}
	WaitForFn('$().observe', observeFound);
	//WaitForElm(selectors.feed_item, createQuestionRemoveButtons)
});

WaitForElm("#moderation-all > div.top > div.sub-header.row > div.pull-right", layoutChangerParent => {
	let $btnChangeLayout = $(`
	<button class="btn">
		<i class="icon icon-th nomargin"></i>
	</button>
	<button class="btn">
		<i class="icon icon-align-justify nomargin"></i>
	</button>`).prependTo(layoutChangerParent);

	$btnChangeLayout.click(function() {
		let $moderationItemParent = $(selectors.moderationItemParent);
		let isListView = $('i', this).is('.icon-align-justify');

		if (isListView) {
			$moderationItemParent.addClass('listView');
		} else {
			$moderationItemParent.removeClass('listView');
		}

		Storage.set({ archive_mod_layout: isListView });
	});

	WaitForElm("#moderation-all > div.top > div.header > h1", h1 => {
		$(h1).on("click", "span", function() {
			$("#moderation-all > div.top > div.sub-header.row > div.span5 > select.filters").val($(this).is(".total") ? "0" : "998").change();
		});
		Storage.get("archive_mod_layout", res => {
			if (res) {
				let $moderationItemParent = $(selectors.moderationItemParent);

				$moderationItemParent.addClass('listView');
			}
		});
	});
});

/**
 * Prepare for pagination
 */
GetModerateAllPages(res => {
	if (res && res.success && res.data) {
		WaitForElm("#moderation-all > div.content > div.loader.calm", $loadMoreButton => {
			let $pagination = $('#moderation-all > div.content > .pagination');

			if ($pagination.length == 0) {
				$pagination = $(`
				<div class="loader pagination pagination-centered" style="display: none; height: auto; padding: 15px 5px;">
					<ul>
						<li class="active"><a href="#"> 1 </a></li>
					</ul>
				</div>`);
				$pagination.insertAfter($loadMoreButton);

				let $paginationList = $(">ul", $pagination);

				$pagination.show();
				res.data.forEach((last_id, i) => {
					if (last_id != 0)
						$(`<li><a href="#" data-last-id="${last_id}"> ${i + 2} </a></li>`).appendTo($paginationList);
				});

				let pageClickHandler = function(e) {
					e.preventDefault();

					let $parentLi = $(this).parent();

					if (!$parentLi.is(".active")) {
						let page = $(this).data('last-id');

						$("li.active", $pagination).removeClass("active");
						$parentLi.addClass("active");

						if (page) {
							$Z.moderation.all.data.lastId = ~~page;
						} else {
							delete $Z.moderation.all.data.lastId;
							delete $Z.moderation.all.data.settings.last_id;
						}

						$Z.moderation.all.getContent();
						$('#moderation-all > div.content > .moderation-item').remove();
					}
				};
				$pagination.on("click", "a", pageClickHandler);

				$("#moderation-all > div.top > div.sub-header.row > div.span5 > select.filters").change(function() {
					if (this.value != 0) {
						$pagination.hide();
						return false
					}

					$pagination.show();
				});
			}
		});
	}
});

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
let findNext = (k, action, objContenerMod) => {
	let currentObj = Zadanium.moderation.all.createdObjects[k];

	if (currentObj) {
		if (currentObj.data.disabled) {;
			findNext(action == "prev" ? --k : ++k, action, objContenerMod);
		} else {
			nextObjFound(currentObj, objContenerMod);
		}
	} else {
		if (action == "next") {
			let loaderMsg = $("#moderation-all > div.content > div.loader.calm > div.loadMore").text();

			objContenerMod.elements.close.click();
			$('#toplayer, #toplayer > div.contener-center.mod').show();

			Zadanium.moderation.all.getContent();
			WaitForFn(`Zadanium.moderation.all.createdObjects[${Zadanium.moderation.all.createdObjects.length + 1}]`, obj => {
				if (obj) {
					findNext(k, action, objContenerMod);
				}
			});

			WaitForFn(
				`
					let msgText = $("#moderation-all > div.content > div.loader.calm > div.loadMore").text();
					(msgText!= "" && msgText != "${loaderMsg}") || undefined
				`,
				obj => {
					if (obj) {
						objContenerMod.elements.close.click();
					}
				}
			);
		} else {
			objContenerMod.elements.close.click();
		}
	}
}
WaitForElm("#toplayer", toplayer => {
	let $toplayer = $(toplayer);

	const switchModerate = function(e) {
		if (e.target.classList.contains("moderation")) {
			let action = "";

			if (typeof e == "string") {
				action = e;
			} else {
				let toplayerOffset = e.offsetX;
				let arrowOffset = e.target.offsetWidth;

				if (toplayerOffset > arrowOffset) {
					action = "next";
				} else if (toplayerOffset < 0) {
					action = "prev"
				}
			}

			if (action != "") {
				let $contenerMod = $(".contener-center.mod", toplayer);
				let objContenerMod = Zadanium.getObject($contenerMod.attr("objecthash"));
				let $moderationToplayer = $(".moderation-toplayer:visible", toplayer);
				let objZ = Zadanium.getObject($moderationToplayer.attr("objecthash"));
				let taskId = objZ.data.task.id;

				Zadanium.moderation.all.createdObjects.forEach((obj, i) => {
					if (obj.data.task_id == taskId) {
						findNext(action == "prev" ? i - 1 : i + 1, action, objContenerMod);
					}
				});
			}
		}
	};

	$toplayer.on('mouseup', 'div.contener.mod.moderation', switchModerate);
	$("body").on("keyup", function(e) {
		if ($toplayer.is(':visible') && !(/textarea|input/gi.exec(e.target.type))) {
			if (e.keyCode === 65 || e.keyCode === 37) { // A
				switchModerate("prev");
			} else if (e.keyCode === 68 || e.keyCode === 39) { // D
				switchModerate("next");
			}
		}
	});
});
