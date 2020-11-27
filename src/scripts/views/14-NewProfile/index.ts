import WaitForElement from "@root/helpers/WaitForElement";
import { Flex, Text } from "@style-guide";

export default class NewProfile {
  profileDetailContainer: HTMLDivElement;
  user: { nick: string; id: number };

  constructor() {
    this.Init();
  }

  private async Init() {
    await this.FindContainer();
    this.FindUsername();
    this.RenderOldProfileLink();
  }

  private async FindContainer() {
    const avatarContainer = await WaitForElement(
      `div[class*="UserReputationInfo__avatar"]`,
    );

    this.profileDetailContainer = avatarContainer.parentElement as HTMLDivElement;
  }

  FindUsername() {
    const usernameContainer = this.profileDetailContainer.querySelector<
      HTMLHeadElement
    >(":scope > .sg-headline");

    if (!usernameContainer) throw Error("Can't find username container");

    this.user = {
      nick: usernameContainer.innerText.trim(),
      id: Number(location.pathname.split("/").pop()),
    };
  }

  RenderOldProfileLink() {
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
