import CreateElement from "@components/CreateElement";

export default class PopupDiscordSection {
  container: HTMLDivElement;

  constructor() {
    this.Render();
  }

  Render() {
    this.container = CreateElement({
      tag: "div",
      id: "discord-banner",
      children: [
        CreateElement({
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
    });
  }
}
