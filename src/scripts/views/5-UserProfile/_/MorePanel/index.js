import {
  ActionListHole,
  ButtonRound,
  ContentBox,
  ContentBoxTitle,
  Text
} from "@style-guide";
import Build from "../../../../helpers/Build";
import IsVisible from "../../../../helpers/IsVisible";
import ManageExtensionUser from "./ManageExtensionUser";
import PointTransferer from "./PointTransferer";
import PrivilegeList from "./PrivilegeList";

export default class MorePanel {
  /**
   * @param {import("../../index").default} main
   */
  constructor(main) {
    this.main = main;
    this.sections = {};

    this.RenderIconButton();
    this.Render();
    this.RenderSections();
    this.BindHandlers();
  }
  RenderIconButton() {
    this.iconButton = ButtonRound({
      color: "black",
      icon: {
        type: "ext-icon",
      },
    });
    this.iconContainer = ActionListHole({
      children: this.iconButton
    });

    this.main.infoBottomList.firstChild.after(this.iconContainer);
  }
  Render() {
    this.container = Build(ContentBox({
      spacedSmall: true,
      spacedBottom: "large",
    }), [
      [
        ContentBoxTitle(),
        Text({
          weight: "bold",
          html: System.data.locale.userProfile.morePanel.title,
          transform: "uppercase",
        }),
      ],
    ]);
  }
  RenderSections() {}
  async RenderSectionsAfterModeratorsResolved() {
    if (
      !System.allModerators.withID[this.main.profileData.id] &&
      this.main.profileData.id !== System.data.Brainly.userData.user.id
    ) {
      //if (System.checkUserP(34))
      //  this.sections.pointTransferer = new PointTransferer(this);
      // TODO: a button that reports user for applying ban
    }
  }
  async RenderSectionsAfterExtensionResolved() {
    if (
      this.main.extensionUser.probatus &&
      this.main.extensionUser.privileges
    )
      this.sections.privilegeList = new PrivilegeList(this);

    if (System.checkUserP([5, 22, 23, 24, 25]))
      this.sections.manageExtensionUser = new ManageExtensionUser(this);
  }
  BindHandlers() {
    this.iconButton.addEventListener("click", this.ShowPanel.bind(this))
  }
  ShowPanel() {
    if (
      IsVisible(this.container) ||
      Object.keys(this.sections).length == 0
    )
      $(this.container).slideUp("fast", () => {
        this.main.HideElement(this.container);
      });
    else {
      this.container.style.display = "none";

      this.main.mainRight.prepend(this.container);
      $(this.container).slideDown("fast");
    }
  }
  async ShowPermissionStatus() {
    if (this.main.extensionUser.probatus) {
      this.iconButton.title = System.data.locale.common.extensionUser;

      this.iconButton.ToggleBorder();
      this.iconButton.icon.TogglePulse();
      this.iconButton.ChangeColor("mint");
      //this.iconButton.icon.ChangeColor("mint");
    }
  }
}
