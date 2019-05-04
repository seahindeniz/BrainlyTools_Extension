class UserTag {
  constructor(userId, user) {
    this.throttled = false;
    this.userId = userId;
    this.user = user;

    this.Render();

    if (!this.user.probatus) {
      if (System.checkUserP([5, 22]))
        this.RenderAssignPermission();
    } else {
      this.RenderExtensionUser();

      if (this.user.privileges) {
        this.RenderPrivilegeList();
        this.RenderPrivileges();
      }
    }

    this.BindHandlers();
  }
  Render() {
    this.$ = $(`
		<div class="sg-actions-list__hole userTag">
			<div class="sg-badge">
				<div class="sg-text sg-text--xsmall sg-text--white sg-text--emphasised"></div>
			</div>
		</div>`);

    this.$badge = $(".sg-badge", this.$);
    this.$text = $(".sg-text", this.$badge);
    this.$actionList = $(".sg-actions-list", this.$);
  }
  RenderExtensionUser() {
    this.$badge.addClass("sg-badge--lavender");
    this.$text.text(System.data.locale.common.extensionUser);
  }
  RenderAssignPermission() {
    this.$badge.addClass("sg-badge--gray-secondary");
    this.$text.text(System.data.locale.core.assignExtensionPermission);
  }
  RenderPrivilegeList() {
    this.$bubble = $(`
		<div class="sg-bubble sg-bubble--blue sg-bubble--left sg-bubble--column-start" styles="position: absolute; z-index: 3; top: -10px; margin-left: -4px;">
			<ul class="sg-list sg-list--spaced-elements"></ul>
		</div>`);
    this.$privilegeList = $("ul", this.$bubble);

    this.$.mouseover(this.ShowPrivilegeList.bind(this));
    this.$.mouseleave(this.HidePrivilegeList.bind(this));
  }
  RenderPrivileges() {
    if (this.user.privileges.length == 0) {
      this.$privilegeList.append(`
			<li class="sg-list__element">
				<div class="sg-text sg-text--white sg-text--small">${System.data.locale.common.userHasNoPrivilege}</div>
			</li>`);
    } else {
      this.user.privileges.forEach(id => {
        let privilege = System.data.locale.popup.extensionManagement.users.privilegeList[id];

        this.$privilegeList.append(`
				<li class="sg-list__element" title="${privilege.description}">
					<div class="sg-list__icon sg-list__icon--spacing-right-small">
						<div class="sg-icon sg-icon--white sg-icon--x14">
							<svg class="sg-icon__svg">
								<use xlink:href="#icon-arrow_right"></use>
							</svg>
						</div>
					</div>
					<div class="sg-text sg-text--white sg-text--small">${privilege.title}</div>
				</li>`);
      });
    }
  }
  BindHandlers() {
    if (System.checkUserP([5, 22, 23, 24, 25]))
      this.$badge.click(this.EditUser.bind(this)).addClass("sg-media--clickable");
  }
  ShowPrivilegeList() {
    this.$bubble.appendTo(this.$);
  }
  HidePrivilegeList() {
    this.$bubble.appendTo("<div />");
  }
  ExtensionUser() {
    this.$.on("click", this.EditUser.bind(this));
  }
  AddToUser() {
    this.$.on("click", this.EditUser.bind(this));
  }
  EditUser() {
    System.OpenExtensionOptions({ editUser: this.userId });
  }
}
export default UserTag
