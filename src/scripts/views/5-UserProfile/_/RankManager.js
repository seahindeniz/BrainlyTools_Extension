import notification from "../../../components/notification";
import WaitForElement from "../../../helpers/WaitForElement";
import { RemoveAllRanks, AddRank } from "../../../controllers/ActionsOfBrainly";
import Progress from "../../../components/Progress";

class RankManager {
  constructor(user) {
    this.user = user;

    this.Find_DeleteRanksForm();
  }
  async Find_DeleteRanksForm() {
    this.deleteAllRanksForm = await WaitForElement(`[action="/ranks/delete_user_special_ranks"]`, 1, true);
    this.deleteAllRanksLi = $(this.deleteAllRanksForm).parent();

    this.Init();
  }
  Init() {
    this.RenderLink();
    this.RenderPanel();
    this.BindEvents();
    this.UpdateInputTitle();
  }
  RenderLink() {
    this.$manageLi = $(`<li></li>`);
    this.$manageLink = $(`<a href="#"><font color="red">${System.constants.config.reasonSign}</font> ${System.data.locale.userProfile.rankManager.title}</a>`);

    this.$manageLink.appendTo(this.$manageLi);
    this.$manageLi.insertBefore(this.deleteAllRanksLi);
  }
  RenderPanel() {
    this.$panel = $(`
		<div class="sg-content-box rankManager">
			<div class="sg-content-box__title sg-content-box__title--spaced-bottom">
				<h2 class="sg-header-secondary">${System.data.locale.userProfile.rankManager.title}</h2>
			</div>
			<div class="sg-content-box__content sg-content-box__content--spaced-bottom-large"></div>
			<div class="sg-content-box__actions sg-content-box__actions--spaced-bottom">
				<div class="sg-spinner-container sg-button-secondary--full-width">
					<button class="sg-button-secondary sg-button-secondary--full-width sg-toplayer__wrapper--no-padding">${System.data.locale.common.save}</button>
				</div>
			</div>
			<div class="sg-content-box__actions sg-content-box__actions--spaced-bottom-large">
				<div class="container progress sg-button-secondary--full-width"></div>
			</div>
		</div>`);
    this.$saveButton = $("button", this.$panel);
    this.$saveButtonContainer = $(".sg-spinner-container", this.$panel);
    this.$progressHole = $(".container.progress", this.$panel);
    this.$rankContainer = $(".sg-content-box__content", this.$panel);
    this.RenderProgressBar();
    this.RenderSpinner();
    this.RenderRanks();
  }
  RenderProgressBar() {
    this.progress = new Progress({
      type: "is-success",
      label: "",
      max: 2
    });
  }
  RenderSpinner() {
    this.$spinner = $(`
		<div class="sg-spinner-container__overlay">
			<div class="sg-spinner sg-spinner--xsmall"></div>
		</div>`);
  }
  RenderRanks() {
    System.data.Brainly.defaultConfig.config.data.ranks.forEach(rank => {
      let userHasRank = this.user.ranks_ids.includes(rank.id);

      if (rank && rank.type == 5) {
        let checkbox = $(`
				<div class="sg-label sg-label--secondary">
					<div class="sg-label__icon">
						<div class="sg-checkbox">
							<input type="checkbox" class="sg-checkbox__element" id="p-${rank.id}"${userHasRank ? " checked" : ""}>
							<label class="sg-checkbox__ghost" for="p-${rank.id}">
								<div class="sg-icon sg-icon--adaptive sg-icon--x10">
									<svg class="sg-icon__svg">
										<use xlink:href="#icon-check"></use>
									</svg></div>
							</label>
						</div>
					</div>
					<label class="sg-label__text" style="color:#${rank.color || "000"};" for="p-${rank.id}" title="${rank.description}">
						<a href="/admin/ranks/edit/${rank.id}" target="_blank">${rank.name}</a>
						${rank.name != rank.description ? `<br><i class="sg-text sg-text--xsmall sg-text--gray">${rank.description}</i>` : ""}
					</label>
				</div>`);

        checkbox.appendTo(this.$rankContainer);
      }
    });
  }
  BindEvents() {
    this.$manageLink.click(e => {
      e.preventDefault();
      this.TogglePanel();
    });
    this.$saveButton.click(this.SaveSelectedRank.bind(this));
    $("a", this.$rankContainer).click(event => {
      if (!event.ctrlKey) {
        event.preventDefault();
        event.currentTarget.parentNode.click();
      }
    });
  }
  TogglePanel() {
    if (this.$panel.is(":visible")) {
      this.ClosePanel();
    } else {
      this.OpenPanel();
    }
  }
  ClosePanel() {
    this.$panel.appendTo("</ div>");
    this.progress.forceClose(true);

  }
  OpenPanel() {
    this.$panel.appendTo(this.$manageLi);
  }
  async SaveSelectedRank() {
    let $selectedRanks = $(`input[type="checkbox"]:checked:not(:disabled)`, this.$rankContainer);
    let formData = {
      key: $(`input[name="data[_Token][key]"]`, this.deleteAllRanksLi).val(),
      fields: $(`input[name="data[_Token][fields]"]`, this.deleteAllRanksLi).val(),
      lock: $(`input[name="data[_Token][lock]"]`, this.deleteAllRanksLi).val()
    }

    this.ShowSpinner();

    if (confirm(System.data.locale.common.notificationMessages.areYouSure)) {
      this.progress.$container.appendTo(this.$progressHole);

      let removeAllRanksXHR = await RemoveAllRanks(window.profileData.id, formData);
      let redirectedUserID = System.ExtractId(removeAllRanksXHR.responseURL);

      if (redirectedUserID != profileData.id) {
        notification(System.data.locale.common.notificationMessages.somethingWentWrongPleaseRefresh, "error");
      } else {
        this.progress.update(1);
        this.progress.UpdateLabel(System.data.locale.userProfile.rankManager.allRanksDeleted);

        if ($selectedRanks.length == 0) {
          this.progress.update(2);
          this.SavingCompleted();
        } else {
          this.progress.setMax($selectedRanks.length + 2);
          await System.Delay(500);
          this.progress.update(2);
          this.progress.UpdateLabel(System.data.locale.userProfile.rankManager.updatingRanks);
          await System.Delay(500);

          $selectedRanks.each(async (i, rankCheckbox) => {
            let rankId = rankCheckbox.id.replace("p-", "");
            let rank = System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];
            await AddRank(window.profileData.id, rankId);

            this.progress.update(i + 3);
            this.progress.UpdateLabel(System.data.locale.userProfile.rankManager.xHasAssigned.replace("%{rank_name}", ` ${rank.name} `));

            if ($selectedRanks.length == i + 1) {
              await System.Delay(500);
              this.SavingCompleted();
            }
          });
        }
      }
    }
  }
  SavingCompleted() {
    this.HideSpinner();
    this.progress.UpdateLabel(System.data.locale.common.allDone);
    notification(System.data.locale.userProfile.notificationMessages.afterSavingCompletedIgnoreNotifications, "success");
  }
  ShowSpinner() {
    this.$spinner.appendTo(this.$saveButtonContainer);
  }
  HideSpinner() {
    this.$spinner.appendTo("</ div>");
  }
  UpdateInputTitle() {
    let formTitle = $(`input[type="submit"]`, this.deleteAllRanksForm);

    formTitle.val(System.data.locale.userProfile.rankManager.removeAllRanks);
  }
}

export default RankManager
