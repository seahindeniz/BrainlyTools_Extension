import ServerReq from "@root/controllers/Req/Server";
import type MassMessageSenderClassType from "../..";
import User from "./User";

class RankSection {
  main: MassMessageSenderClassType;
  userElements: {
    [id: number]: User;
  };

  selectedUsersFromRanks: number[];

  $: JQuery<HTMLElement>;
  $rankSelect: JQuery<HTMLElement>;
  $ranksSpinnerContainer: JQuery<HTMLElement>;
  $ranksSpinner: JQuery<HTMLElement>;
  $userSectionSpinner: JQuery<HTMLElement>;
  $userSectionContainer: JQuery<HTMLElement>;
  $userSection: JQuery<HTMLElement>;
  $userSectionSpinnerContainer: JQuery<HTMLElement>;

  constructor(main: MassMessageSenderClassType) {
    this.main = main;
    this.userElements = {};
    this.selectedUsersFromRanks = [];

    this.RenderRankSection();
    this.RenderRanks();
    this.RenderRanksSpinner();
    this.RenderUserSectionSpinner();
    this.RenderUserSection();
    this.BindHandlers();
  }

  RenderRankSection() {
    this.$ = $(`
		<div class="sg-actions-list">
			<div class="sg-actions-list__hole sg-actions-list__hole--equal-width">
				<div class="sg-spinner-container sg-content-box--full">
					<div class="sg-select sg-textarea--xxtall sg-textarea--full-width">
						<select multiple class="sg-select__element sg-textarea--xxtall sg-badge--large">
							<option selected value="all" class="sg-box--xxsmall-padding">${System.data.locale.supervisors.allRanks}</option>
						</select>
					</div>
				</div>
			</div>
		</div>`);

    this.$rankSelect = $("select", this.$);
    this.$ranksSpinnerContainer = $(".sg-spinner-container", this.$);
  }

  RenderRanks() {
    System.data.Brainly.defaultConfig.config.data.ranks.forEach(
      this.RenderRank.bind(this),
    );
  }

  RenderRank(rank) {
    if (rank.type > 3) {
      const $rank = $(
        `<option value="${rank.id}"${
          rank.color
            ? ` class="sg-box--xxsmall-padding" style="color:#${rank.color};"`
            : ""
        }>${rank.name}</option>`,
      );

      $rank.appendTo(this.$rankSelect);
    }
  }

  RenderRanksSpinner() {
    this.$ranksSpinner = $(
      `<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`,
    );
  }

  RenderUserSectionSpinner() {
    this.$userSectionSpinner = $(
      `<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`,
    );
  }

  RenderUserSection() {
    this.$userSectionContainer = $(`
		<div class="sg-actions-list__hole sg-actions-list__hole--equal-width">
			<div class="sg-spinner-container sg-content-box--full">
				<div class="sg-select sg-textarea--xxtall sg-textarea--full-width" style="overflow: auto; padding: 3px;">
					<ul class="sg-list sg-list--spaced-elements"></ul>
				</div>
			</div>
		</div>`);

    this.$userSection = $("ul", this.$userSectionContainer);
    this.$userSectionSpinnerContainer = $(
      ".sg-spinner-container",
      this.$userSectionContainer,
    );

    this.$userSectionContainer.appendTo(this.$);
  }

  async RenderModerators() {
    $(this.$userSection).html("");
    this.ShowUserSectionSpinner();
    await new ServerReq().GetAllModerators({
      each: this.RenderUser.bind(this),
    });
    this.HideUserSectionSpinner();
    this.ChangeRank();
  }

  RenderUser(data) {
    const user = this.userElements[data.id];

    if (!user) {
      this.userElements[data.id] = new User(data);
    } else {
      user.data = data;

      user.FillData();
    }
  }

  BindHandlers() {
    this.$rankSelect.on("change", this.ChangeRank.bind(this));
  }

  ChangeRank() {
    let selectedRankOptions: HTMLOptionElement[] = this.$rankSelect.prop(
      "selectedOptions",
    );

    if (selectedRankOptions.length > 0) {
      selectedRankOptions = [...selectedRankOptions];
      const findTheAllValue = selectedRankOptions.filter(
        selectedRankOption => selectedRankOption.value === "all",
      );

      this.ClearUserList();

      if (findTheAllValue.length > 0) this.RenderUsersOfRank();
      else {
        selectedRankOptions.forEach(selectedRankOption => {
          this.RenderUsersOfRank(~~selectedRankOption.value);
        });
      }
    }
  }

  ClearUserList() {
    this.selectedUsersFromRanks = [];

    $("> *", this.$userSection).appendTo("<div />");
  }

  async RenderUsersOfRank(rankId?: number) {
    if (!System.allModerators) return;

    System.allModerators.list.forEach(user => {
      if (!rankId || user.ranks_ids.includes(rankId)) {
        this.ShowUser(user);
        this.selectedUsersFromRanks.push(user.id);
      }
    });
  }

  ShowUser(userData) {
    const user = this.userElements[userData.id];

    user.$.appendTo(this.$userSection);
  }

  get idList() {
    return this.selectedUsersFromRanks;
  }

  ShowSpinner() {
    this.ShowRanksSpinner();
    this.ShowUsersSpinners();
  }

  HideSpinner() {
    this.HideRanksSpinner();
    this.HideUsersSpinners();
  }

  ShowRanksSpinner() {
    this.$ranksSpinner.appendTo(this.$ranksSpinnerContainer);
  }

  HideRanksSpinner() {
    this.main.HideElement(this.$ranksSpinner);
  }

  ShowUserSectionSpinner() {
    this.$userSectionSpinner.appendTo(this.$userSectionSpinnerContainer);
  }

  HideUserSectionSpinner() {
    this.main.HideElement(this.$userSectionSpinner);
  }

  ShowUsersSpinners() {
    this.selectedUsersFromRanks.forEach(id => {
      const user = this.userElements[id];

      user.ShowSpinner();
      user.RemoveMarks();
    });
  }

  HideUsersSpinners() {
    this.selectedUsersFromRanks.forEach(id =>
      this.userElements[id].HideSpinner(),
    );
  }

  MessageSent(data) {
    const user = this.userElements[data.id];

    user.HideSpinner();
    user.Mark(data.exception_type);
  }
}

export default RankSection;
