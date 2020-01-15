import { ActionListHole, Label } from "./style-guide";

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
    this.container = ActionListHole({
      className: "userTag",
      children: this.label = Label({
        type: "strong",
      }),
    });
  }
  RenderExtensionUser() {
    this.label.ChangeColor("mint");
    this.label.ChangeText(System.data.locale.common.extensionUser);
  }
  RenderAssignPermission() {
    this.label.ChangeColor("gray");
    this.label.ChangeText(System.data.locale.core.assignExtensionPermission);
  }
  RenderPrivilegeList() {
    this.$bubble = $(`
		<div class="sg-bubble sg-bubble--blue sg-bubble--left sg-bubble--column-start" styles="position: absolute; z-index: 3; top: -10px; margin-left: -4px;">
			<ul class="sg-list sg-list--spaced-elements"></ul>
		</div>`);
    this.$privilegeList = $("ul", this.$bubble);

    this.container.addEventListener("mouseover", this.ShowPrivilegeList.bind(
      this));
    this.container.addEventListener("mouseleave", this.HidePrivilegeList.bind(
      this));
  }
  RenderPrivileges() {
    if (this.user.privileges.length == 0) {
      this.$privilegeList.append(`
			<li class="sg-list__element">
				<div class="sg-text sg-text--white sg-text--small">${System.data.locale.common.userHasNoPrivilege}</div>
			</li>`);
    } else {
      this.user.privileges.forEach(id => {
        let privilege = System.data.locale.popup.extensionManagement.users
          .privilegeList[id];

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
    if (System.checkUserP([5, 22, 23, 24, 25])) {
      this.label.addEventListener("click", this.EditUser.bind(this));
      this.label.classList.add("sg-media--clickable");
    }
  }
  ShowPrivilegeList() {
    this.container.append(this.$bubble[0]);
  }
  HidePrivilegeList() {
    this.$bubble.appendTo("<div />");
  }
  ExtensionUser() {
    this.container.addEventListener("click", this.EditUser.bind(this));
  }
  AddToUser() {
    this.container.addEventListener("click", this.EditUser.bind(this));
  }
  EditUser() {
    System.OpenExtensionOptions({ editUser: this.userId });
  }
}
export default UserTag
