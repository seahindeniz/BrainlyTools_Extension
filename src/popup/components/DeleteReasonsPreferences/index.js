import bulmahead from "../../../scripts/lib/bulmahead";
import Preference from "./Preference";

class DeleteReasonsPreferences {
	constructor() {
		this.selectedReasons = [];

		this.Render();
		this.BindEvents();
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
	}
	async InitStoredPreferences() {
		let preferences = System.data.Brainly.deleteReasons.__preferences;

		if (preferences instanceof Array && preferences.length > 0) {
			preferences.forEach(preference => {
				let reason = System.data.Brainly.deleteReasons.__withIds.__all[preference.reasonID];

				if (reason) {
					let category = System.data.Brainly.deleteReasons.__withIds.__all[reason.category_id];
					let categoryText = category.text;
					let label = categoryText + " › " + reason.title;

					let deleteReasonsPreference = new Preference(reason, label, preference.confirmation);

					deleteReasonsPreference.$.appendTo($(`.field[data-type="${reason.type}"]`, this.$layout));
					this.selectedReasons.push(reason.id);
					console.log(deleteReasonsPreference);
				} else {
					RemoveDeleteReasonPreference(preference.reasonID)
				}
			});
		}
	}
	BindEvents() {
		bulmahead(this.$input.get(0), this.$menu.get(0), this.SearchDeleteReason.bind(this), this.ReasonSelected.bind(this));
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
		let deleteReasonsPreference = new Preference(data.reason, data.label);

		deleteReasonsPreference.$.appendTo($(`.field[data-type="${data.type}"]`, this.$layout));
		this.$input.val("");
	}
}

export default DeleteReasonsPreferences
