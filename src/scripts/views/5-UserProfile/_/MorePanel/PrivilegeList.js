import {
  ContentBox,
  ContentBoxContent,
  List,
  ListItem,
  Text
} from "../../../../components/style-guide";
import Build from "../../../../helpers/Build";
import IsVisible from "../../../../helpers/IsVisible";

export default class PrivilegeList {
  /**
   * @param {import(".").default} main
   */
  constructor(main) {
    this.main = main;

    this.Render();
    this.RenderList();
    this.RenderPrivileges();
    this.BindHandlers();
  }
  Render() {
    this.container = Build(ContentBoxContent({
      spacedBottom: true,
    }), [
      [
        this.wrapper = ContentBox(), [
          [
            ContentBoxContent(),
            this.link = Text({
              type: "a",
              size: "small",
              weight: "bold",
              color: "blue-dark",
              html: System.data.locale.userProfile.morePanel.privileges
                .title,
            })
          ],
        ]
      ]
    ]);

    this.main.container.append(this.container);
  }
  RenderList() {
    this.privilegeListContainer = ContentBoxContent({
      children: this.privilegeList = List(),
    });
  }
  RenderPrivileges() {
    this.main.main.extensionUser.privileges.forEach(
      this.RenderPrivilege.bind(this)
    );
  }
  /**
   * @param {0} id
   */
  RenderPrivilege(id) {
    let privilege = System.data.locale.popup.extensionManagement.users
      .privilegeList[id];

    let privilegeItem = ListItem({
      icon: {
        color: "lavender",
      },
      iconSmall: true,
      children: Text({
        size: "xsmall",
        html: privilege.title,
        title: privilege.description,
      })
    });

    this.privilegeList.append(privilegeItem);
  }
  BindHandlers() {
    this.link.addEventListener("click", this.TogglePrivilegesList.bind(this));
  }
  TogglePrivilegesList() {
    if (IsVisible(this.privilegeListContainer))
      $(this.privilegeListContainer).slideUp("fast", () => {
        this.main.main.HideElement(this.privilegeListContainer);
      });
    else {
      this.privilegeListContainer.style.display = "none";

      this.wrapper.append(this.privilegeListContainer);
      $(this.privilegeListContainer).slideDown("fast");
    }
  }
}
