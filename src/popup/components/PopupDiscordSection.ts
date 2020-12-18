import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import { Flex, Text } from "@style-guide";

export default class PopupDiscordSection {
  container: import("@style-guide/Flex").FlexElementType;

  constructor() {
    this.Render();
  }

  Render() {
    this.container = Build(Flex({ direction: "column" }), [
      [
        Flex({ grow: true, justifyContent: "center", marginTop: "l" }),
        CreateElement({
          id: "discord-widget",
          tag: "iframe",
          src: `https://discord.com/widget?id=${System.data.Brainly.userData.extension.discordServer}&theme=light`,
          width: "90%",
          height: 230,
          allowtransparency: true,
          frameborder: 1,
          sandbox:
            "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts",
        }),
      ],
      [
        Flex({ marginTop: "s", marginRight: "l", justifyContent: "flex-end" }),
        Text({
          tag: "a",
          color: "blue-dark",
          target: "_blank",
          href: "http://bit.ly/3my8Q6i",
          children: `ℹ ${System.data.locale.core.discordPopup.informationLine} 😗`,
        }),
      ],
    ]);
  }
}
