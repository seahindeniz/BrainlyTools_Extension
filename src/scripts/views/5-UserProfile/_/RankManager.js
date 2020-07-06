/* eslint-disable no-await-in-loop */
import {
  Button,
  Checkbox,
  Flex,
  Text,
  Icon,
} from "@/scripts/components/style-guide";
import Build from "@/scripts/helpers/Build";
import sortablejs from "sortablejs";
import notification from "../../../components/notification2";
import Progress from "../../../components/Progress";
import Action from "../../../controllers/Req/Brainly/Action";
import WaitForElements from "../../../helpers/WaitForElements";

class RankManager {
  /**
   * @typedef {{
   *  id?: number,
   *  name?: string,
   *  description?: string,
   * }} RankType
   *
   * @param {*} user
   */
  constructor(user) {
    this.user = user;
    /**
     * @type {{
     *  data: RankType,
     *  checkbox: HTMLInputElement,
     *  rankContainer: HTMLLabelElement,
     * }[]}
     */
    this.ranks = [];

    this.FindTheDeleteRanksForm();
  }

  async FindTheDeleteRanksForm() {
    this.deleteAllRanksForm = await WaitForElements(
      `[action="/ranks/delete_user_special_ranks"]`,
      {
        noError: true,
      },
    );
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
      `<a href="#"><font color="red">${System.constants.config.reasonSign}</font> ${System.data.locale.userProfile.rankManager.title}</a>`,
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
    this.saveButton = new Button({
      size: "s",
      fullWidth: true,
      type: "solid-mint",
      text: System.data.locale.common.save,
    });

    this.$saveButtonContainer.append(this.saveButton.element);
  }

  RenderProgressBar() {
    this.progress = new Progress({
      type: "is-success",
      label: "",
      max: 2,
    });
  }

  RenderSpinner() {
    this.$spinner = $(`
		<div class="sg-spinner-container__overlay">
			<div class="sg-spinner sg-spinner--xsmall"></div>
		</div>`);
  }

  RenderRanks() {
    /**
     * @type {{ranks: RankType[]}}
     */
    let { ranks } = System.data.Brainly.defaultConfig.config.data;
    ranks = ranks.sort((a, b) => {
      return (
        this.user.ranks_ids.indexOf(b.id) - this.user.ranks_ids.indexOf(a.id)
      );
    });
    ranks = ranks.sort(a => (this.user.ranks_ids.includes(a.id) ? -1 : 1));

    ranks.forEach(
      /**
       * @param {RankType} rank
       */
      (rank, i) => {
        if (!rank || rank.type !== 5) return;

        const userHasRank = this.user.ranks_ids.includes(rank.id);
        const checkbox = Checkbox({
          id: `p-${rank.id}`,
          checked: userHasRank,
        });

        const rankContainer = Build(
          Flex({
            wrap: false,
            tag: "label",
            marginBottom:
              i + 1 !==
              System.data.Brainly.defaultConfig.config.data.ranks.length
                ? "xs"
                : "",
          }),
          [
            [
              Flex({ margin: "xxs", fullWidth: true }),
              [
                [Flex({ marginRight: "xs", alignItems: "center" }), checkbox],
                [
                  Flex({
                    direction:
                      rank.description && rank.name !== rank.description
                        ? "column"
                        : "",
                    alignItems:
                      rank.description && rank.name !== rank.description
                        ? "flex-start"
                        : "center",
                    fullWidth: true,
                  }),
                  [
                    [
                      Flex(),
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
                      }),
                    ],
                    rank.description &&
                      rank.name !== rank.description && [
                        Flex({ fullWidth: true, direction: "column" }),
                        Text({
                          tag: "i",
                          size: "xsmall",
                          color: "gray",
                          html: rank.description,
                        }),
                      ],
                  ],
                ],
                [
                  Flex({ alignItems: "center" }),
                  new Button({
                    iconOnly: true,
                    size: "xs",
                    className: "dragger",
                    type: "transparent-blue",
                    icon: new Icon({
                      type: "menu",
                      color: "blue",
                      size: 14,
                    }),
                  }),
                ],
              ],
            ],
          ],
        );

        this.ranks.push({
          data: rank,
          checkbox: checkbox.firstElementChild,
          rankContainer,
        });
        this.$rankContainer.append(rankContainer);
      },
    );

    // eslint-disable-next-line no-new, new-cap
    new sortablejs(this.$rankContainer[0], {
      animation: 200,
      multiDrag: true,
      handle: ".dragger",
      fallbackTolerance: 3,
      selectedClass: "sg-box--blue-secondary-light",
    });
  }

  BindHandlers() {
    this.$manageLink.click(e => {
      e.preventDefault();
      this.TogglePanel();
    });
    this.saveButton.element.addEventListener(
      "click",
      this.SaveSelectedRank.bind(this),
    );
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
    let selectedRanks = this.ranks.filter(rank => rank.checkbox.checked);

    if (!selectedRanks || selectedRanks.length === 0) {
      notification({
        type: "info",
        html:
          System.data.locale.common.notificationMessages
            .youNeedToSelectAtLeastOne,
      });

      return;
    }

    const getElementIndex = element => {
      return Array.from(element.parentNode.children).indexOf(element);
    };
    selectedRanks = selectedRanks.sort((a, b) => {
      return getElementIndex(a.rankContainer) > getElementIndex(b.rankContainer)
        ? 1
        : -1;
    });

    const tokens = {
      key: $(`input[name="data[_Token][key]"]`, this.deleteAllRanksLi).val(),
      fields: $(
        `input[name="data[_Token][fields]"]`,
        this.deleteAllRanksLi,
      ).val(),
      lock: $(`input[name="data[_Token][lock]"]`, this.deleteAllRanksLi).val(),
    };

    this.ShowSpinner();

    if (!confirm(System.data.locale.common.notificationMessages.areYouSure))
      return;

    this.progress.$container.appendTo(this.$progressHole);

    const removeAllRanksXHR = await new Action().RemoveAllRanks(
      window.profileData.id,
      tokens,
    );
    const redirectedUserID = System.ExtractId(removeAllRanksXHR.url);

    if (redirectedUserID !== profileData.id) {
      notification(
        System.data.locale.common.notificationMessages
          .somethingWentWrongPleaseRefresh,
        "error",
      );
    } else {
      this.progress.update(1);
      this.progress.UpdateLabel(
        System.data.locale.userProfile.rankManager.allRanksDeleted,
      );

      if (selectedRanks.length === 0) {
        this.progress.update(2);
        this.SavingCompleted();
      } else {
        this.progress.setMax(selectedRanks.length + 2);
        await System.Delay(500);
        this.progress.update(2);
        this.progress.UpdateLabel(
          System.data.locale.userProfile.rankManager.updatingRanks,
        );
        await System.Delay(500);

        let i = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const selectedRank of selectedRanks) {
          await new Action().AddRank(
            window.profileData.id,
            selectedRank.data.id,
          );

          i++;
          this.progress.update(i + 3);
          this.progress.UpdateLabel(
            System.data.locale.userProfile.rankManager.xHasAssigned.replace(
              "%{rank_name}",
              ` ${selectedRank.data.name} `,
            ),
          );

          if (selectedRanks.length === i + 1) {
            await System.Delay(500);
            this.SavingCompleted();
          }
        }
      }
    }
  }

  SavingCompleted() {
    this.HideSpinner();
    this.progress.UpdateLabel(System.data.locale.common.allDone);
    notification(
      System.data.locale.userProfile.notificationMessages
        .afterSavingCompletedIgnoreNotifications,
      "success",
    );
  }

  ShowSpinner() {
    this.$spinner.appendTo(this.$saveButtonContainer);
  }

  HideSpinner() {
    this.$spinner.appendTo("</ div>");
  }

  UpdateInputTitle() {
    const formTitle = $(`input[type="submit"]`, this.deleteAllRanksForm);

    formTitle.val(System.data.locale.userProfile.rankManager.removeAllRanks);
  }
}

export default RankManager;
