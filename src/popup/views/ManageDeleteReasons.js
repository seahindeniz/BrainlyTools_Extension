"use strict";

import ext from "../../scripts/utils/ext";
import Storage from "../../scripts/helpers/extStorage";
import notification from "../components/notification";
import send2AllBrainlyTabs from "../helpers/send2AllBrainlyTabs";
import Inject2body from "../../scripts/helpers/Inject2body";
import bulmahead from "../../scripts/lib/bulmahead"
import { UpdateDeleteReasonsPreferences } from "../../scripts/controllers/ActionsOfServer";
import PrepareDeleteReasons from "../../scripts/controllers/PrepareDeleteReasons";

const ManageDeleteReasons = async callback => {
	let $manageDeleteReasons = $(`
	<div id="manageDeleteReasons" class="column is-narrow">
		<article class="message is-danger">
			<div class="message-header">
				<p>${System.data.locale.popup.extensionManagement.manageDeleteReasons.text}</p>
			</div>
			<div class="message-body">
				<div class="field is-horizontal">
					<div class="field-label has-text-centered">
						<label class="label">${System.data.locale.popup.extensionOptions.quickDeleteButtons.task}</label>
						<div class="field is-grouped is-grouped-multiline" data-type="task"></div>
					</div>
					<div class="field-label has-text-centered">
						<label class="label">${System.data.locale.popup.extensionOptions.quickDeleteButtons.response}</label>
						<div class="field is-grouped is-grouped-multiline" data-type="response"></div>
					</div>
					<div class="field-label has-text-centered">
						<label class="label">${System.data.locale.popup.extensionOptions.quickDeleteButtons.comment}</label>
						<div class="field is-grouped is-grouped-multiline" data-type="comment"></div>
					</div>
					<div class="field-body">
						<div class="field is-grouped">
							<div class="control is-expanded">
								<div class="dropdown">
									<div class="dropdown-trigger">
										<input id="prova" class="input" type="text" placeholder="${System.data.locale.popup.extensionManagement.manageDeleteReasons.findReason}" aria-haspopup="true" aria-controls="prova-menu">
									</div>
									<div class="dropdown-menu" id="prova-menu" role="menu" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<p class="help">${ System.data.locale.popup.extensionManagement.manageDeleteReasons.explaining.line1 }</br></br>
				${System.data.locale.popup.extensionManagement.manageDeleteReasons.explaining.line2
				.replace(/\%\{exclamation-circle\}/, '<span class="icon is-small"><i class="fas fa-exclamation-circle"></i></span>')
				.replace(/\%\{exclamation-triangle\}/, '<span class="icon is-small"><i class="fas fa-exclamation-triangle"></i></span>')}</p>
			</div>
		</article>
	</div>`);

	callback($manageDeleteReasons);

	let $input = $("#prova", $manageDeleteReasons);
	let $menu = $("#prova-menu", $manageDeleteReasons);
	let deleteReasons = { ...System.data.Brainly.deleteReasons.__withTitles };

	delete deleteReasons.__categories;

	let deleteReasonsKeys = {
		task: Object.keys(deleteReasons.task),
		response: Object.keys(deleteReasons.response),
		comment: Object.keys(deleteReasons.comment)
	};
	let addTag = (type, value, label, reason, confirmation = null) => {
		$(`
		<div class="control">
			<div class="tags has-addons">
				<a class="tag" data-value="${value}">${label}</a>
				<a class="button tag${confirmation === false?" is-danger":""}" data-is="danger" title="${System.data.locale.popup.extensionManagement.manageDeleteReasons.withoutAsk}">
					<span class="icon is-small">
						<i class="fas fa-exclamation-circle"></i>
					</span>
				</a>
				<a class="button tag${confirmation === true?" is-warning":""}" data-is="warning" title="${System.data.locale.popup.extensionManagement.manageDeleteReasons.withAsk}">
					<span class="icon is-small">
						<i class="fas fa-exclamation-triangle"></i>
					</span>
				</a>
				<a class="button tag is-delete is-info" title="${System.data.locale.common.delete}"></a>
			</div>
		</div>`).appendTo($(`.field[data-type="${type}"]`, $manageDeleteReasons)).prop("reason", reason);
	}
	let onReasonSelect = function() {
		console.log(this.object);
		addTag(this.object.type, this.object.value, this.object.label, this.object.reason);
		$input.val("");
	};

	bulmahead($input.get(0), $menu.get(0), v => {
		return new Promise((resolve, reject) => {
			return resolve((() => {
				let reasons = [];

				Object.keys(deleteReasonsKeys).forEach(type => {
					deleteReasonsKeys[type].forEach(key => {
						if ((new RegExp(v, "i")).test(key)) {
							let typeT = type == "task" ? "Q" : type == "response" ? "A" : "C";

							reasons.push({
								type,
								prelabel: typeT + " › ",
								label: System.data.Brainly.deleteReasons.__withIds[type].__categories[deleteReasons[type][key].category_id].text + " › " + deleteReasons[type][key].title,
								reason: deleteReasons[type][key],
								value: deleteReasons[type][key].title
							});
						}
					});
				});
				console.log(reasons);
				return reasons;
			})())
		})
	}, onReasonSelect, 200);

	/**
	 * Tag click
	 */
	const tagClickHandler = async function() {
		let $parentControl = $(this).parents(".control");
		let type = $parentControl.parent().data("type");
		let reason = $parentControl.get(0).reason;

		let reasonData = {
			id: reason.id,
			confirmation: "remove"
		}

		if (!this.classList.contains("is-delete")) {
			reasonData.confirmation = this.dataset.is == "warning";
		}

		let resUpdate = await UpdateDeleteReasonsPreferences(reasonData);

		if (!resUpdate || !resUpdate.success) {
			notification(System.data.locale.common.notificationMessages.somethingWentWrong, "danger");
		} else {
			let message = System.data.locale.popup.notificationMessages.removedMessage
			if (reasonData.confirmation == "remove") {
				$parentControl.remove();
			} else {
				$("a.button.tag:not(.is-delete)", $parentControl).attr("class", "button tag");
				this.classList.add("is-" + this.dataset.is);

				message = System.data.locale.common.done;
			}

			notification(message);
		}
	};
	$(".field.is-grouped", $manageDeleteReasons).on("click", ".button.tag", tagClickHandler);

	/**
	 * Prepare defined tags
	 */
	await PrepareDeleteReasons();

	let preferences = System.data.Brainly.deleteReasons.__preferences;

	if (preferences && preferences instanceof Array && preferences.length > 0) {
		preferences.forEach(preference => {
			let reason = System.data.Brainly.deleteReasons.__withIds.__all[preference.reasonID];
			let categoryText = System.data.Brainly.deleteReasons.__withIds.__all[reason.category_id].text;

			if (reason) {
				let label = categoryText + " › " + reason.title;
				addTag(reason.type, reason.title, label, reason, preference.confirmation);
			}
		});
	}
};

export default ManageDeleteReasons
