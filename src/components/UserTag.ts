import { UserDetailsType } from "@root/controllers/Req/Server";
import { LabelElementType } from "@style-guide/Label";
import HideElement from "../helpers/HideElement";
import {
  ActionListHole,
  Bubble,
  Label,
  List,
  ListItem,
  Text,
} from "./style-guide";

class UserTag {
  throttled: boolean;
  userId: number;
  user: UserDetailsType;

  container: HTMLElement;
  label: LabelElementType;
  privilegeList: HTMLUListElement;
  bubble: HTMLDivElement;

  constructor(userId, user) {
    this.throttled = false;
    this.userId = userId;
    this.user = user;

    this.Render();

    if (!this.user.probatus) {
      if (System.checkUserP([5, 22])) this.RenderAssignPermission();
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
        type: "solid",
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
    this.privilegeList = List({
      spaced: true,
    });
    this.bubble = Bubble({
      color: "blue",
      alignment: "start",
      direction: "left",
      style: {
        position: "absolute",
        zIndex: 3,
        top: "-10px",
        marginLeft: "-4px",
      },
      children: this.privilegeList,
    });

    this.container.addEventListener(
      "mouseover",
      this.ShowPrivilegeList.bind(this),
    );
    this.container.addEventListener(
      "mouseleave",
      this.HidePrivilegeList.bind(this),
    );
  }

  RenderPrivileges() {
    if (this.user.privileges.length === 0) {
      const privilegeElement = ListItem({
        children: Text({
          size: "small",
          color: "white",
          children: System.data.locale.common.userHasNoPrivilege,
        }),
      });

      this.privilegeList.append(privilegeElement);

      return;
    }

    this.user.privileges.forEach(id => {
      const privilege =
        System.data.locale.popup.extensionManagement.users.privilegeList[id];

      const privilegeElement = ListItem({
        iconSmall: true,
        title: privilege.description,
        children: Text({
          size: "small",
          color: "white",
          children: privilege.title,
        }),
      });

      this.privilegeList.append(privilegeElement);
      // TODO test this
      /* this.$privilegeList.append(`
				<li class="sg-list__element" title="${privilege.description}">
					<div class="sg-list__icon sg-list__icon--spacing-right-small">
						<div class="sg-icon sg-icon--white sg-icon--x14">
							<svg class="sg-icon__svg">
								<use xlink:href="#icon-arrow_right"></use>
							</svg>
						</div>
					</div>
					<div class="sg-text sg-text--white sg-text--small">${privilege.title}</div>
				</li>`); */
    });
  }

  BindHandlers() {
    if (System.checkUserP([5, 22, 23, 24, 25])) {
      this.label.addEventListener("click", this.EditUser.bind(this));
      this.label.classList.add("sg-media--clickable");
    }
  }

  ShowPrivilegeList() {
    this.container.append(this.bubble);
  }

  HidePrivilegeList() {
    HideElement(this.bubble);
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
export default UserTag;
