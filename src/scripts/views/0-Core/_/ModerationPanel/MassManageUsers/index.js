import debounce from "debounce";
import Modal from "../../../../../components/Modal";
import Action from "../../../../../controllers/Req/Brainly/Action";

/**
 * @typedef {import("../../../../../controllers/Req/Brainly/Action/index").UserProfile} UserProfile
 * @type {import("../../../../../controllers/System").default}
 */
let System;
let SetSystem = () => !System && (System = window.System);

class MassManageUsers {
  constructor() {
    /**
     * @type {number[]}
     */
    this.idList = [];
    /**
     * @type {Object<string, null|UserProfile>}
     */
    this.users = {};
    /**
     * @type {UserProfile[]}
     */
    this.fetchedUsers = [];

    SetSystem();
    this.RenderLi();
    this.RenderModal();
    this.RenderUserList();
    this.BindHandlers();
  }
  RenderLi() {
    this.$li = $(`
		<li class="sg-menu-list__element" style="display: table; width: 100%;">
			<span class="sg-menu-list__link sg-text--link">${System.data.locale.core.massManageUsers.text}</span>
		</li>`);
  }
  RenderModal() {
    let nUsers = System.data.locale.core.pointChanger.nUsers.replace("%{n}", ` <span>0</span> `);
    this.modal = new Modal({
      header: `
      <div class="sg-actions-list sg-actions-list--space-between">
				<div class="sg-actions-list__hole">
					<div class="sg-label sg-label--small sg-label--secondary">
						<div class="sg-text sg-text--peach">${System.data.locale.core.massManageUsers.text}</div>
					</div>
				</div>
			</div>`,
      content: `
      <div class="sg-content-box">
				<div class="sg-content-box__content sg-content-box__content--spaced-top">
          <div class="sg-actions-list sg-actions-list--no-wrap">
            <div class="sg-actions-list__hole" style="width: 30em;min-width: 30em;max-width: 30em;">
              <textarea class="sg-textarea sg-textarea--full-width sg-textarea--tall sg-textarea--resizable-vertical" placeholder="${System.data.locale.common.profileLinksOrIds}"></textarea>
            </div>
          </div>
				</div>
				<div class="sg-content-box__actions">
					<div class="sg-actions-list sg-actions-list--no-wrap">
						<div class="sg-actions-list__hole">
							<p class="sg-text sg-text--xsmall">${nUsers}</p>
						</div>
					</div>
        </div>
			</div>`,
      size: "90prc sg-toplayer--fit-content"
    });

    this.$idInput = $("textarea", this.modal.$content);
    this.$inputActionList = $(".sg-content-box__content > .sg-actions-list", this.modal.$content);
    this.$numberOfUsers = $(".sg-content-box__actions .sg-actions-list > .sg-actions-list__hole > .sg-text > span", this.modal.$content);
  }
  RenderUserList() {
    this.$userListContainer = $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--container">
      <div class="sg-content-box__actions sg-textarea sg-textarea--tall sg-textarea--resizable-vertical"></div>
    </div>`);

    this.$userList = $(".sg-content-box__actions", this.$userListContainer);
  }
  BindHandlers() {
    this.modal.$close.click(this.modal.Close.bind(this.modal));
    this.$li.on("click", "span", this.modal.Open.bind(this.modal));
    this.$idInput.on("input", debounce(() => this.UpdateInput(), 700));
    this.$idInput.on("change", this.InputChanged.bind(this));
  }
  UpdateInput() {
    this.FixNumberLines();
    this.ParseIds();
    this.UpdateNumberOfUsers();
    this.FetchUserDetails();
  }
  FixNumberLines() {
    let value = this.$idInput.val();
    let cursorPosition = ~~(this.$idInput.prop("selectionStart") + 1);
    let newValue = value.replace(/(\d{1,})+(?:([a-z])| {1,})/gm, "$1\n$2");

    this.$idInput
      .val(newValue)
      .prop("selectionStart", cursorPosition)
      .prop("selectionEnd", cursorPosition)
      .focus();
  }
  ParseIds() {
    let value = this.$idInput.val();
    let valueList = value.split(/\r\n|\n/g);
    this.idList = System.ExtractIds(valueList);
    this.idList = [...new Set(this.idList)];
  }
  UpdateNumberOfUsers() {
    this.$numberOfUsers.text(this.idList.length);
  }
  InputChanged() {
    this.UpdateInput();
  }
  async FetchUserDetails() {
    if (this.idList.length > 0) {
      let idList = this.FilterFetchedUserIds();

      if (idList.length > 0) {
        let resUsers = await new Action().GetUsers(idList);

        if (resUsers && resUsers.success) {
          this.fetchedUsers = resUsers.data;

          this.RenderUsers();
        }
      }
    }
  }
  FilterFetchedUserIds() {
    if (this.users.length == 0)
      return this.idList;

    return this.idList.filter(id => {
      let _user = this.users[id];

      if (!_user)
        this.users[id] = null;

      return !_user
    });
  }
  RenderUsers() {
    this.fetchedUsers.forEach(this.RenderUser.bind(this));
    this.ShowUserList();
    console.log(this.users);
  }
  /**
   * @param {UserProfile} user
   */
  RenderUser(user) {
    this.users[user.id] = user;
    let avatar = System.prepareAvatar(user);
    let profileLink = System.createProfileLink(user);
    console.log(user);
    let $user = $(`
    <div class="sg-box sg-box--xxsmall-padding sg-box--no-min-height sg-box--navyblue-secondary sg-box--no-border">
      <div class="sg-box__hole">
        <div class="sg-actions-list">
          <div class="sg-actions-list__hole">
            <div class="sg-avatar sg-avatar--spaced">
              <a href="${profileLink}">
                <img class="sg-avatar__image" src="${avatar}">
              </a>
            </div>
          </div>
          <div class="sg-actions-list__hole">
            <a href="${profileLink}" class="sg-text sg-text--link-unstyled sg-text--bold">
              <span class="sg-text sg-text--small sg-text--gray sg-text--bold">${user.nick}</span>
            </a>
          </div>
        </div>
      </div>
    </div>`);

    $user.appendTo(this.$userList);
  }
  ShowUserList() {
    this.$userListContainer.appendTo(this.$inputActionList);
  }
}

export default MassManageUsers
