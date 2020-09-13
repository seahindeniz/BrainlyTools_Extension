import ServerReq from "@ServerReq";
import { DeleteReasonSubCategoryType } from "@root/controllers/System";
import notification from "../notification";

class Preference {
  reason: DeleteReasonSubCategoryType & {
    type: string;
  };

  label: string;
  confirmation: boolean;

  $: JQuery<HTMLElement>;
  $tags: JQuery<HTMLElement>;
  $noConfirmationButton: JQuery<HTMLElement>;
  $askConfirmationButton: JQuery<HTMLElement>;
  $deleteButton: JQuery<HTMLElement>;

  constructor(reason, label, confirmation?) {
    this.reason = reason;
    this.label = label;
    this.confirmation = confirmation;

    this.Render();
    this.RenderNoConfirmationButton();
    this.RenderAskConfirmationButton();
    this.RenderDeleteButton();
    this.BindHandlers();
  }

  Render() {
    this.$ = $(`
		<div class="control">
			<div class="tags has-addons">
				<a class="tag fixReasonWidth" data-value="${this.reason.title}">${this.label}</a>
			</div>
		</div>`);

    this.$tags = $("> .tags", this.$);
  }

  RenderNoConfirmationButton() {
    this.$noConfirmationButton = $(`
		<a class="button tag${
      this.confirmation === false ? " is-danger" : ""
    }" data-is="danger" title="${
      System.data.locale.popup.extensionManagement.DeleteReasonsPreferences
        .withoutAsk
    }">
			<span class="icon is-small">
				<i class="fas fa-exclamation-circle"></i>
			</span>
		</a>`);

    this.$noConfirmationButton.appendTo(this.$tags);
  }

  RenderAskConfirmationButton() {
    this.$askConfirmationButton = $(`
		<a class="button tag${
      this.confirmation === true ? " is-warning" : ""
    }" data-is="warning" title="${
      System.data.locale.popup.extensionManagement.DeleteReasonsPreferences
        .withAsk
    }">
			<span class="icon is-small">
				<i class="fas fa-exclamation-triangle"></i>
			</span>
		</a>`);

    this.$askConfirmationButton.appendTo(this.$tags);
  }

  RenderDeleteButton() {
    this.$deleteButton = $(
      `<a class="button tag is-delete is-info" title="${System.data.locale.common.delete}"></a>`,
    );

    this.$deleteButton.appendTo(this.$tags);
  }

  BindHandlers() {
    this.$deleteButton.on("click", this.Delete.bind(this));
    this.$noConfirmationButton.on("click", this.NoConfirmation.bind(this));
    this.$askConfirmationButton.on("click", this.AskConfirmation.bind(this));
  }

  async Delete() {
    const resRemove = await new ServerReq().RemoveDeleteReasonPreference(
      this.reason.id,
    );

    if (!resRemove?.success) {
      notification(
        System.data.locale.common.notificationMessages.somethingWentWrong,
        "danger",
      );

      return;
    }

    this.$.remove();
    notification(System.data.locale.popup.notificationMessages.removedMessage);
  }

  async NoConfirmation() {
    await this.ChangeState(false);

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
    const data = {
      id: this.reason.id,
      confirmation,
    };

    const resUpdate = await new ServerReq().UpdateDeleteReasonsPreferences(
      data,
    );

    if (!resUpdate?.success) {
      notification(
        System.data.locale.common.notificationMessages.somethingWentWrong,
        "danger",
      );

      throw Error(
        System.data.locale.common.notificationMessages.somethingWentWrong,
      );
    }
  }

  RemoveStateColors() {
    this.$noConfirmationButton.removeClass("is-danger");
    this.$askConfirmationButton.removeClass("is-warning");
  }
}

export default Preference;
