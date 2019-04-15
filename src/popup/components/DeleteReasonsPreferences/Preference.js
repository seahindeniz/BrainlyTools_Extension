import notification from "../notification";
import { UpdateDeleteReasonsPreferences, RemoveDeleteReasonPreference } from "../../../scripts/controllers/ActionsOfServer";

class Preference {
  constructor(reason, label, confirmation) {
    this.reason = reason;
    this.label = label;
    this.confirmation = confirmation;

    this.Render();
    this.RenderNoConfirmationButton();
    this.RenderAskConfirmationButton();
    this.RenderDeleteButton();
    this.BindEvents();
  }
  Render() {
    this.$ = $(`
		<div class="control">
			<div class="tags has-addons">
				<a class="tag" data-value="${this.reason.title}">${this.label}</a>
			</div>
		</div>`);

    this.$tags = $("> .tags", this.$);
  }
  RenderNoConfirmationButton() {
    this.$noConfirmationButton = $(`
		<a class="button tag${this.confirmation === false?" is-danger":""}" data-is="danger" title="${System.data.locale.popup.extensionManagement.DeleteReasonsPreferences.withoutAsk}">
			<span class="icon is-small">
				<i class="fas fa-exclamation-circle"></i>
			</span>
		</a>`);

    this.$noConfirmationButton.appendTo(this.$tags);
  }
  RenderAskConfirmationButton() {
    this.$askConfirmationButton = $(`
		<a class="button tag${this.confirmation === true?" is-warning":""}" data-is="warning" title="${System.data.locale.popup.extensionManagement.DeleteReasonsPreferences.withAsk}">
			<span class="icon is-small">
				<i class="fas fa-exclamation-triangle"></i>
			</span>
		</a>`);

    this.$askConfirmationButton.appendTo(this.$tags);
  }
  RenderDeleteButton() {
    this.$deleteButton = $(`<a class="button tag is-delete is-info" title="${System.data.locale.common.delete}"></a>`);

    this.$deleteButton.appendTo(this.$tags);
  }
  BindEvents() {
    this.$deleteButton.click(this.Delete.bind(this));
    this.$noConfirmationButton.click(this.NoConfirmation.bind(this));
    this.$askConfirmationButton.click(this.AskConfirmation.bind(this));
  }
  async Delete() {
    let resRemove = await RemoveDeleteReasonPreference(this.reason.id);

    await this.CheckResponse(resRemove);
    this.$.remove();
    notification(System.data.locale.popup.notificationMessages.removedMessage);
  }
  async CheckResponse(res) {
    if (!res || !res.success) {
      notification(System.data.locale.common.notificationMessages.somethingWentWrong, "danger");
      return Promise.reject();
    }

    return Promise.resolve();
  }
  async NoConfirmation() {
    console.log("no confirmation1");
    await this.ChangeState(false);
    console.log("no confirmation2");

    this.RemoveStateColors();
    notification(System.data.locale.common.done);
    this.$noConfirmationButton.addClass("is-danger");
  }
  async AskConfirmation() {
    await this.ChangeState(true);

    this.RemoveStateColors();
    notification(System.data.locale.common.done);
    this.$askConfirmationButton.addClass("is-warning");
  }
  async ChangeState(confirmation) {
    let data = {
      id: this.reason.id,
      confirmation
    };

    let resUpdate = await UpdateDeleteReasonsPreferences(data);

    return this.CheckResponse(resUpdate);

  }
  RemoveStateColors() {
    this.$noConfirmationButton.removeClass("is-danger");
    this.$askConfirmationButton.removeClass("is-warning");
  }
}

export default Preference
