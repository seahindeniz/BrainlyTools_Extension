import { GetAllModerators } from "../../../../../../controllers/ActionsOfBrainly";

const ERROR = "sg-box--peach";
const USER_NOT_FOUND = "sg-box--dark";
const SUCCESS = "sg-box--blue-secondary";

class User {
  constructor(data) {
    this.data = data;

    this.Render();
    this.FillData();
    this.RenderSpinner();
  }
  Render() {
    this.$ = $(`
		<li class="sg-list__element">
			<div class="sg-spinner-container sg-box--full">
				<div class="sg-box sg-box--no-min-height sg-box--xxsmall-padding sg-box--no-border sg-box--full">
					<div class="sg-box__hole">
						<div class="sg-actions-list sg-actions-list--no-wrap">
							<div class="sg-actions-list__hole">
								<div data-test="ranking-item-avatar" class="sg-avatar sg-avatar--normal sg-avatar--spaced">
									<a href="">
										<img class="sg-avatar__image" src="">
									</a>
								</div>
							</div>
							<div class="sg-actions-list__hole sg-actions-list__hole--grow">
								<div class="sg-content-box">
									<div class="sg-content-box__content sg-content-box__content--full">
										<a href="" class="sg-text sg-text--link-unstyled sg-text--bold">
											<span class="sg-text sg-text--small sg-text--gray sg-text--bold"></span>
										</a>
									</div>
									<div class="sg-content-box__content sg-content-box__content--full">
										<ul class="sg-breadcrumb-list sg-text--xsmall"></ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</li>`);

    this.$avatar = $("img", this.$);
    this.$box = $(".sg-box", this.$);
    this.$rankList = $("ul", this.$);
    this.$profileLink = $("a", this.$);
    this.$nick = $("> .sg-text", this.$profileLink);
    this.$spinnerContainer = $(".sg-spinner-container", this.$);
  }
  FillData() {
    let avatar = System.prepareAvatar(this.data);
    let profileLink = System.createProfileLink(this.data);
    let ranks = [];

    if (this.data.ranks_ids && this.data.ranks_ids.length > 0) {
      this.data.ranks_ids.forEach(rankId => {
        let current_rank = System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];

        if (current_rank || rankId == 12) {
          ranks.push(`<li class="sg-breadcrumb-list__element" style="color:#${(current_rank.color || "000")};">${current_rank.name}</li>`);
        }
      });
    }

    this.$nick.text(this.data.nick);
    this.$avatar.attr("src", avatar);
    this.$rankList.html(ranks.join(""));
    this.$profileLink.attr("href", profileLink);
  }
  RenderSpinner() {
    this.$spinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner sg-spinner--small"></div></div>`);
  }
  ShowSpinner() {
    this.$spinner.appendTo(this.$spinnerContainer);
  }
  HideSpinner() {
    this.$spinner.appendTo("<div />");
  }
  Mark(status) {
    let _class = SUCCESS;

    if (status == 500) {
      _class = USER_NOT_FOUND;
    } else if (status) {
      _class = ERROR;
    }

    this.RemoveMarks();
    this.$box.addClass(_class);
  }
  RemoveMarks() {
    this.$box.removeClass(`${ERROR} ${SUCCESS} ${USER_NOT_FOUND}`);
  }
}
class RankSection {
  constructor(main) {
    this.main = main;
    this.userElements = {};
    this.selectedUsersFromRanks = [];

    this.RenderRankSection();
    this.RenderRanks();
    this.RenderRanksSpinner();
    this.RenderUserSectionSpinner();
    this.RenderUserSection()
    this.BindEvents();
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
    System.data.Brainly.defaultConfig.config.data.ranks.forEach(this.RenderRank.bind(this));
  }
  RenderRank(rank) {
    if (rank.type > 3) {
      let $rank = $(`<option value="${rank.id}"${rank.color?` class="sg-box--xxsmall-padding" style="color:#${rank.color};"`:""}>${rank.name}</option>`);

      $rank.appendTo(this.$rankSelect);
    }
  }
  RenderRanksSpinner() {
    this.$ranksSpinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`);
  }
  RenderUserSectionSpinner() {
    this.$userSectionSpinner = $(`<div class="sg-spinner-container__overlay"><div class="sg-spinner"></div></div>`);
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
    this.$userSectionSpinnerContainer = $(".sg-spinner-container", this.$userSectionContainer);

    this.$userSectionContainer.appendTo(this.$);
  }
  async RenderModerators() {
    $(this.$userSection).html("");
    this.ShowUserSectionSpinner();
    await GetAllModerators({
      each: this.RenderUser.bind(this)
    });
    this.HideUserSectionSpinner();
    this.ChangeRank();
  }
  RenderUser(data) {
    let user = this.userElements[data.id];

    if (!user) {
      this.userElements[data.id] = new User(data);
    } else {
      user.data = data;

      user.FillData();
    }
  }
  BindEvents() {
    this.$rankSelect.change(this.ChangeRank.bind(this));
  }
  ChangeRank() {
    /**
     * @type {HTMLCollection[]}
     */
    let selectedRankOptions = this.$rankSelect.prop("selectedOptions");

    if (selectedRankOptions.length > 0) {
      selectedRankOptions = [...selectedRankOptions];
      let findTheAllValue = selectedRankOptions.filter(selectedRankOption => selectedRankOption.value == "all");

      this.ClearUserList();

      if (findTheAllValue.length > 0)
        this.RenderUsersOfRank();
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
  RenderUsersOfRank(rankId) {
    if (System.allModerators) {
      System.allModerators.list.forEach(user => {
        if (!rankId || user.ranks_ids.includes(rankId)) {
          this.ShowUser(user);
          this.selectedUsersFromRanks.push(user.id);
        }
      });
    }
  }
  ShowUser(userData) {
    let user = this.userElements[userData.id];

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
      let user = this.userElements[id];

      user.ShowSpinner();
      user.RemoveMarks();
    });
  }
  HideUsersSpinners() {
    this.selectedUsersFromRanks.forEach(id => this.userElements[id].HideSpinner());
  }
  BeforeSending(data) {}
  MessageSend(data) {
    let user = this.userElements[data.id];

    user.HideSpinner();
    user.Mark(data.exception_type);
  }
}

export default RankSection
