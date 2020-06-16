import {
  ActionListHole,
  Button,
  ContentBox,
  ContentBoxTitle,
  Text,
  Icon,
} from "@style-guide";
import Build from "../../../../helpers/Build";
import IsVisible from "../../../../helpers/IsVisible";
import ManageExtensionUser from "./ManageExtensionUser";
import ReportUser from "./ReportUser";
import PrivilegeList from "./PrivilegeList";

export default class MorePanel {
  /**
   * @param {import("../../index").default} main
   */
  constructor(main) {
    this.main = main;
    this._sections = {};

    this.RenderIconButton();
    this.Render();
    this.RenderSections();
    this.BindHandlers();
  }

  set sections(sections) {
    this._sections = sections;
  }

  get sections() {
    this.ShowPanel();

    return this._sections;
  }

  ShowPanel() {
    this.main.mainRight.append(this.container);
  }

  RenderIconButton() {
    this.iconButton = new Button({
      type: "outline",
      iconOnly: true,
      noClick: true,
      icon: new Icon({
        type: "ext-icon",
        color: "dark",
      }),
    });
    this.iconContainer = ActionListHole({
      children: this.iconButton,
    });

    this.iconButton.Disable();
    this.main.infoBottomList.firstChild.after(this.iconContainer);
  }

  Render() {
    this.container = Build(
      ContentBox({
        spacedSmall: true,
        spacedBottom: "large",
      }),
      [
        [
          ContentBoxTitle(),
          Text({
            weight: "bold",
            html: System.data.locale.userProfile.morePanel.title,
            transform: "uppercase",
          }),
        ],
      ],
    );
  }

  RenderSections() {}
  async RenderSectionsAfterModeratorsResolved() {}
  async RenderSectionsAfterExtensionResolved() {
    if (this.main.extensionUser.probatus && this.main.extensionUser.privileges)
      this.sections.privilegeList = new PrivilegeList(this);

    if (System.checkUserP([5, 22, 23, 24, 25]))
      this.sections.manageExtensionUser = new ManageExtensionUser(this);
  }

  async RenderSectionsAfterAllResolved() {
    /* if (
      !System.allModerators.withID[this.main.profileData.id] &&
      this.main.profileData.id !== System.data.Brainly.userData.user.id
    ) */
    if (false && System.checkUserP(34))
      this.sections.pointTransferer = new ReportUser(this);
  }

  BindHandlers() {
    // this.iconButton.addEventListener("click", this.TogglePanel.bind(this))
  }

  TogglePanel() {
    if (IsVisible(this.container) || Object.keys(this.sections).length == 0)
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
    if (!this.main.extensionUser.probatus) return;

    this.iconButton.element.title = System.data.locale.common.extensionUser;

    this.iconButton.Enable();
    this.iconButton.icon.ChangeColor("mint").TogglePulse();
    this.iconButton.ChangeType({ type: "outline", toggle: "mint" });
    /* this.iconButton.ToggleBorder();
    this.iconButton.icon.TogglePulse();
    this.iconButton.ChangeColor("mint"); */
    // this.iconButton.icon.ChangeColor("mint");
  }
}
