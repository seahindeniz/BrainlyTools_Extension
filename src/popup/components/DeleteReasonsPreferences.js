import notification from "../components/notification";
import bulmahead from "../../scripts/lib/bulmahead"
import { UpdateDeleteReasonsPreferences } from "../../scripts/controllers/ActionsOfServer";

class DeleteReasonsPreferences {
	constructor() {
		this.selectedReasons = [];
		return this.Render();
	}
	Render() {
		this.$layout = $(`
		<div id="DeleteReasonsPreferences" class="column is-narrow">
			<article class="message is-danger">
				<div class="message-header">
					<p>${System.data.locale.popup.extensionManagement.DeleteReasonsPreferences.text}</p>
				</div>
				<div class="message-body">
					<div class="field">
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
											<input id="prova" class="input" type="text" placeholder="${System.data.locale.popup.extensionManagement.DeleteReasonsPreferences.findReason}" aria-haspopup="true" aria-controls="prova-menu">
										</div>
										<div class="dropdown-menu" id="prova-menu" role="menu" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<p class="help">${ System.data.locale.popup.extensionManagement.DeleteReasonsPreferences.explaining.line1 }</br></br>
					${System.data.locale.popup.extensionManagement.DeleteReasonsPreferences.explaining.line2
					.replace(/\%\{exclamation-circle\}/, '<span class="icon is-small"><i class="fas fa-exclamation-circle"></i></span>')
					.replace(/\%\{exclamation-triangle\}/, '<span class="icon is-small"><i class="fas fa-exclamation-triangle"></i></span>')}</p>
				</div>
			</article>
		</div>`);

		this.$input = $("#prova", this.$layout);
		this.$menu = $("#prova-menu", this.$layout);

		this.InitStoredPreferences();
		this.BindEvents();

		return this.$layout;
	}
	async InitStoredPreferences() {
		let preferences = System.data.Brainly.deleteReasons.__preferences;

		if (preferences instanceof Array && preferences.length > 0) {
			preferences.forEach(preference => {
				let reason = System.data.Brainly.deleteReasons.__withIds.__all[preference.reasonID];
				let categoryText = System.data.Brainly.deleteReasons.__withIds.__all[reason.category_id].text;

				if (reason) {
					let label = categoryText + " › " + reason.title;

					this.AddReasonToList(reason.type, reason.title, label, reason, preference.confirmation);
				}
			});
		}
	}
	BindEvents() {
		bulmahead(this.$input.get(0), this.$menu.get(0), this.SearchDeleteReason.bind(this), this.ReasonSelected.bind(this));
		$(".field.is-grouped", this.$layout).on("click", ".button.tag", this.ReasonTagChangeState);
	}
	SearchDeleteReason(value) {
		return new Promise(resolve => {
			return resolve((() => {
				let reasonList = [];

				$.each(System.data.Brainly.deleteReasons.__withTitles, (type, reasons) => {
					$.each(reasons, (reasonKey, reason) => {
						if (
							reasonKey.indexOf("__") < 0 &&
							(new RegExp(value, "i")).test(reasonKey) &&
							this.selectedReasons.indexOf(reason.id) < 0
						) {
							let typeT = System.data.locale.popup.extensionOptions.quickDeleteButtons[type]; //type == "task" ? "Q" : type == "response" ? "A" : "C";
							let categoryName = System.data.Brainly.deleteReasons.__withIds[type].__categories[reason.category_id].text;

							reasonList.push({
								type,
								prelabel: `${typeT} › `,
								label: `${categoryName} › ${reason.title}`,
								reason,
								value: reason.title
							});
						}
					});
				});

				return reasonList;
			})())
		})
	}
	ReasonSelected(data) {
		this.AddReasonToList(data.type, data.value, data.label, data.reason);
		this.$input.val("");
	}
	AddReasonToList(type, value, label, reason, confirmation = null) {
		this.selectedReasons.push(reason.id);
		$(`
		<div class="control">
			<div class="tags has-addons">
				<a class="tag" data-value="${value}">${label}</a>
				<a class="button tag${confirmation === false?" is-danger":""}" data-is="danger" title="${System.data.locale.popup.extensionManagement.DeleteReasonsPreferences.withoutAsk}">
					<span class="icon is-small">
						<i class="fas fa-exclamation-circle"></i>
					</span>
				</a>
				<a class="button tag${confirmation === true?" is-warning":""}" data-is="warning" title="${System.data.locale.popup.extensionManagement.DeleteReasonsPreferences.withAsk}">
					<span class="icon is-small">
						<i class="fas fa-exclamation-triangle"></i>
					</span>
				</a>
				<a class="button tag is-delete is-info" title="${System.data.locale.common.delete}"></a>
			</div>
		</div>`).appendTo($(`.field[data-type="${type}"]`, this.$layout)).prop("reason", reason);
	}
	async ReasonTagChangeState() {
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
			let message = System.data.locale.popup.notificationMessages.removedMessage;

			if (reasonData.confirmation == "remove") {
				$parentControl.remove();
			} else {
				$("a.button.tag:not(.is-delete)", $parentControl).attr("class", "button tag");
				this.classList.add("is-" + this.dataset.is);

				message = System.data.locale.common.done;
			}

			notification(message);
		}
	}
}

export default DeleteReasonsPreferences
