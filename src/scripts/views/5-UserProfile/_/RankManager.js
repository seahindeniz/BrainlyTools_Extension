import { Checkbox, Flex, Text } from "@/scripts/components/style-guide";
import Build from "@/scripts/helpers/Build";
import Button from "../../../components/Button";
import notification from "../../../components/notification";
import Progress from "../../../components/Progress";
import Action from "../../../controllers/Req/Brainly/Action";
import WaitForElement from "../../../helpers/WaitForElement";

class RankManager {
  constructor(user) {
    this.user = user;

    this.Find_DeleteRanksForm();
  }
  async Find_DeleteRanksForm() {
    this.deleteAllRanksForm = await WaitForElement(
      `[action="/ranks/delete_user_special_ranks"]`, 1, true);
    this.deleteAllRanksLi = $(this.deleteAllRanksForm).parent();

    this.Init();
  }
  Init() {
    this.RenderLink();
    this.RenderPanel();
    this.RenderSaveButton();
    this.RenderProgressBar();
    this.RenderSpinner();
    this.RenderRanks();
    this.BindHandlers();
    this.UpdateInputTitle();
  }
  RenderLink() {
    this.$manageLi = $(`<li></li>`);
    this.$manageLink = $(
      `<a href="#"><font color="red">${System.constants.config.reasonSign}</font> ${System.data.locale.userProfile.rankManager.title}</a>`
    );

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
				<div class="sg-spinner-container sg-box--full"></div>
			</div>
			<div class="sg-content-box__actions sg-content-box__actions--spaced-bottom-large">
				<div class="container progress sg-box--full"></div>
			</div>
		</div>`);
    this.$saveButtonContainer = $(".sg-spinner-container", this.$panel);
    this.$progressHole = $(".container.progress", this.$panel);
    this.$rankContainer = $(".sg-content-box__content", this.$panel);
  }
  RenderSaveButton() {
    this.$saveButton = Button({
      type: "primary-mint",
      size: "small",
      fullWidth: true,
      text: System.data.locale.common.save
    });

    this.$saveButton.appendTo(this.$saveButtonContainer);
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
    System.data.Brainly.defaultConfig.config.data.ranks.forEach((rank, i) => {
      let userHasRank = this.user.ranks_ids.includes(rank.id);

      if (rank && rank.type == 5) {
        let checkboxContainer = Build(Flex({
          wrap: false,
          tag: "label",
          marginBottom: (
            i + 1 !== System.data.Brainly.defaultConfig.config
            .data.ranks.length ? "s" : ""
          ),
        }), [
          [
            Flex({ marginRight: "s" }),
            Checkbox({
              id: `p-${rank.id}`,
              checked: userHasRank
            })
          ],
          [
            Flex({ direction: "column", alignItems: "flex-start" }),
            [
              [
                Flex({ fullWidth: true, direction: "column" }),
                Text({
                  html: rank.name,
                  weight: "bold",
                  color: "blue-dark",
                  href: `/admin/ranks/edit/${rank.id}`,
                  size: "xsmall",
                  title: rank.description,
                  target: "_blank",
                  /* style: {
                    color: `#${rank.color}`
                  } */
                })
              ],
              rank.name != rank.description && [
                Flex({ fullWidth: true, direction: "column" }),
                Text({
                  tag: "i",
                  size: "xsmall",
                  color: "gray",
                  html: rank.description
                })
              ],
            ]
          ]
        ]);

        this.$rankContainer.append(checkboxContainer);
      }
    });
  }
  BindHandlers() {
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
    let $selectedRanks = $(`input[type="checkbox"]:checked:not(:disabled)`,
      this.$rankContainer);
    let tokens = {
      key: $(`input[name="data[_Token][key]"]`, this.deleteAllRanksLi)
        .val(),
      fields: $(`input[name="data[_Token][fields]"]`, this.deleteAllRanksLi)
        .val(),
      lock: $(`input[name="data[_Token][lock]"]`, this.deleteAllRanksLi)
        .val()
    }

    this.ShowSpinner();

    if (confirm(System.data.locale.common.notificationMessages.areYouSure)) {
      this.progress.$container.appendTo(this.$progressHole);

      let removeAllRanksXHR = await new Action().RemoveAllRanks(window
        .profileData.id, tokens);
      let redirectedUserID = System.ExtractId(removeAllRanksXHR.url);

      if (redirectedUserID != profileData.id) {
        notification(System.data.locale.common.notificationMessages
          .somethingWentWrongPleaseRefresh, "error");
      } else {
        this.progress.update(1);
        this.progress.UpdateLabel(System.data.locale.userProfile.rankManager
          .allRanksDeleted);

        if ($selectedRanks.length == 0) {
          this.progress.update(2);
          this.SavingCompleted();
        } else {
          this.progress.setMax($selectedRanks.length + 2);
          await System.Delay(500);
          this.progress.update(2);
          this.progress.UpdateLabel(System.data.locale.userProfile.rankManager
            .updatingRanks);
          await System.Delay(500);

          $selectedRanks.each(async (i, rankCheckbox) => {
            let rankId = rankCheckbox.id.replace("p-", "");
            let rank = System.data.Brainly.defaultConfig.config.data
              .ranksWithId[rankId];
            await new Action().AddRank(window.profileData.id, rankId);

            this.progress.update(i + 3);
            this.progress.UpdateLabel(System.data.locale.userProfile
              .rankManager.xHasAssigned.replace("%{rank_name}",
                ` ${rank.name} `));

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
    notification(System.data.locale.userProfile.notificationMessages
      .afterSavingCompletedIgnoreNotifications, "success");
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
