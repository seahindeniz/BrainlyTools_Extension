import WaitForElement from "@root/helpers/WaitForElement";
import { Flex, Text } from "@style-guide";

export default class NewProfile {
  private usernameContainer: HTMLElement;
  private profileDetailContainer: HTMLDivElement;
  private user: { nick: string; id: number };

  constructor() {
    this.Init();
  }

  private async Init() {
    await this.FindUsernameContainer();
    this.FindProfileDetailContainer();
    this.SetUserData();
    this.RenderOldProfileLink();
  }

  private async FindUsernameContainer() {
    this.usernameContainer = await WaitForElement(
      `div[class*="ProfilePage__asideContent"] h1.sg-headline`,
    );

    if (!this.usernameContainer) throw Error("Can't find username container");
  }

  private FindProfileDetailContainer() {
    this.profileDetailContainer = this.usernameContainer
      .parentElement as HTMLDivElement;

    if (!this.profileDetailContainer)
      throw Error("Can't find profile details container");
  }

  private SetUserData() {
    this.user = {
      nick: this.usernameContainer.innerText.trim(),
      id: Number(location.pathname.split("/").pop()),
    };
  }

  private RenderOldProfileLink() {
    const oldProfileLink = System.createProfileLink(this.user);
    const oldProfileLinkContainer = Flex({
      marginTop: "s",
      children: Text({
        size: "small",
        weight: "bold",
        href: oldProfileLink,
        color: "blue-dark",
        children: System.data.locale.userProfile.goToOldProfilePage,
      }),
    });

    this.profileDetailContainer.append(oldProfileLinkContainer);
  }
}

// eslint-disable-next-line no-new
new NewProfile();
