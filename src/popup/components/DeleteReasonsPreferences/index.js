/* eslint-disable no-underscore-dangle */
import ServerReq from "@ServerReq";
import bulmahead from "../../../scripts/lib/bulmahead";
import Preference from "./Preference";
import notification from "../notification";

class DeleteReasonsPreferences {
  constructor() {
    this.selectedReasons = [];
    /**
     * @type {{
     *  reasonID: number,
     *  confirmation: boolean,
     * }[]}
     */
    this.preferences = [];

    this.Render();
    this.FetchPreferences();
    this.BindHandlers();
  }

  Render() {
    this.$layout = $(`
		<div id="DeleteReasonsPreferences" class="column is-narrow">
			<article class="message is-danger">
				<div class="message-header">
					<p>${
            System.data.locale.popup.extensionManagement
              .DeleteReasonsPreferences.text
          }</p>
				</div>
				<div class="message-body">
					<div class="field">
						<div class="field-label has-text-centered">
							<label class="label">${
                System.data.locale.popup.extensionOptions.quickDeleteButtons
                  .question
              }</label>
							<div class="field is-grouped is-grouped-multiline" data-type="question"></div>
						</div>
						<div class="field-label has-text-centered">
							<label class="label">${
                System.data.locale.popup.extensionOptions.quickDeleteButtons
                  .answer
              }</label>
							<div class="field is-grouped is-grouped-multiline" data-type="answer"></div>
						</div>
						<div class="field-label has-text-centered">
							<label class="label">${
                System.data.locale.popup.extensionOptions.quickDeleteButtons
                  .comment
              }</label>
							<div class="field is-grouped is-grouped-multiline" data-type="comment"></div>
						</div>
						<div class="field-body">
							<div class="field is-grouped">
								<div class="control is-expanded">
									<div class="dropdown">
										<div class="dropdown-trigger">
											<input id="prova" class="input" type="text" placeholder="${
                        System.data.locale.popup.extensionManagement
                          .DeleteReasonsPreferences.findReason
                      }" aria-haspopup="true" aria-controls="prova-menu">
										</div>
										<div class="dropdown-menu" id="prova-menu" role="menu" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<p class="help">${
            System.data.locale.popup.extensionManagement
              .DeleteReasonsPreferences.explaining.line1
          }</br></br>
					${System.data.locale.popup.extensionManagement.DeleteReasonsPreferences.explaining.line2
            .replace(
              /%\{exclamation-circle\}/,
              '<span class="icon is-small"><i class="fas fa-exclamation-circle"></i></span>',
            )
            .replace(
              /%\{exclamation-triangle\}/,
              '<span class="icon is-small"><i class="fas fa-exclamation-triangle"></i></span>',
            )}</p>
				</div>
			</article>
		</div>`);

    this.$input = $("#prova", this.$layout);
    this.$menu = $("#prova-menu", this.$layout);
  }

  async FetchPreferences() {
    try {
      const resRemove = await new ServerReq().GetDeleteReasonPreferences();

      if (!resRemove?.success) throw Error("Can't find any preferences");

      this.preferences = resRemove.data;

      this.InitStoredPreferences();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      notification(error.message, "danger");
    }
  }

  async InitStoredPreferences() {
    if (this.preferences.length === 0) return;

    this.preferences.forEach(preference => {
      const reason =
        System.data.Brainly.deleteReasons.__withIds.__all[preference.reasonID];

      if (reason) {
        const category =
          System.data.Brainly.deleteReasons.__withIds.__all[reason.category_id];
        const categoryText = category.text;
        const label = `${categoryText} › ${reason.title}`;

        const deleteReasonsPreference = new Preference(
          reason,
          label,
          preference.confirmation,
        );

        deleteReasonsPreference.$.appendTo(
          $(`.field[data-type="${reason.type}"]`, this.$layout),
        );
        this.selectedReasons.push(reason.id);
      } else {
        new ServerReq().RemoveDeleteReasonPreference(preference.reasonID);
      }
    });
  }

  BindHandlers() {
    bulmahead(
      this.$input.get(0),
      this.$menu.get(0),
      this.SearchDeleteReason.bind(this),
      this.ReasonSelected.bind(this),
    );
  }

  SearchDeleteReason(value) {
    return new Promise(resolve => {
      return resolve(
        (() => {
          const reasonList = [];

          $.each(
            System.data.Brainly.deleteReasons.__withTitles,
            (type, reasons) => {
              $.each(reasons, (reasonKey, reason) => {
                if (
                  reasonKey.indexOf("__") < 0 &&
                  new RegExp(value, "i").test(reasonKey) &&
                  this.selectedReasons.indexOf(reason.id) < 0
                ) {
                  const typeT =
                    System.data.locale.popup.extensionOptions
                      .quickDeleteButtons[type];
                  const categoryName =
                    System.data.Brainly.deleteReasons.__withIds[type]
                      .__categories[reason.category_id].text;

                  reasonList.push({
                    type,
                    prelabel: `${typeT} › `,
                    label: `${categoryName} › ${reason.title}`,
                    reason,
                    value: reason.title,
                  });
                }
              });
            },
          );

          return reasonList;
        })(),
      );
    });
  }

  ReasonSelected(data) {
    const deleteReasonsPreference = new Preference(data.reason, data.label);

    deleteReasonsPreference.$.appendTo(
      $(`.field[data-type="${data.type}"]`, this.$layout),
    );
    this.$input.val("");
  }
}

export default DeleteReasonsPreferences;
