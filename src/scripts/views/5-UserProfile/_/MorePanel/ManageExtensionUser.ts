import { ContentBoxContent, Text } from "@style-guide";
import type MorePanelClassType from ".";

export default class ManageExtensionUser {
  main: MorePanelClassType;
  container: HTMLDivElement;
  link: import("@style-guide/Text").TextElement<"a">;

  constructor(main: MorePanelClassType) {
    this.main = main;

    this.Render();
    this.BindHandlers();
  }

  Render() {
    this.container = ContentBoxContent({
      spacedBottom: true,
      children: (this.link = Text({
        tag: "a",
        size: "small",
        weight: "bold",
        color: "blue-dark",
        html:
          System.data.locale.userProfile.morePanel.manageExtensionUser.title,
      })),
    });

    this.main.container.append(this.container);
  }

  BindHandlers() {
    this.link.addEventListener("click", this.EditUser.bind(this));
  }

  EditUser() {
    System.OpenExtensionOptions({
      editUser: this.main.main.profileData.id,
    });
  }
}
