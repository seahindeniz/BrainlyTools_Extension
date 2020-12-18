import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import IsVisible from "@root/helpers/IsVisible";
import CloseDiscordPopupMessage from "@ServerReq/CloseDiscordPopupMessage";
import { Flex, Spinner, Text, TextBit, Toplayer } from "@style-guide";

export default class DiscordServerPopupMessage {
  private container: import("@style-guide/Flex").FlexElementType;
  private toplayer: Toplayer;
  private spinner?: HTMLDivElement;

  constructor() {
    this.Render();
  }

  private Render() {
    this.container = Flex({
      marginLeft: "s",
      marginBottom: "s",
      className: "ext-discord-popup",
      children: (this.toplayer = new Toplayer({
        lead: true,
        size: "fit-content",
        onClose: this.HandleClose.bind(this),
        children: Build(Flex({ direction: "column" }), [
          TextBit({
            tag: "h1",
            color: "black",
            children: `${System.data.locale.core.discordPopup.discordServer} 🚀`,
          }),
          [
            Flex({ marginTop: "s", marginBottom: "s", direction: "column" }),
            [
              Text({
                weight: "bold",
                color: "blue-dark",
                full: true,
                children: System.data.locale.core.discordPopup.heyUser.replace(
                  "%{nick}",
                  System.data.Brainly.userData.user.nick,
                ),
              }),
              Text({
                whiteSpace: "pre-line",
                children: System.data.locale.core.discordPopup.nextMessage,
              }),
            ],
          ],
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
          [
            Flex({
              marginTop: "s",
              marginRight: "xl",
              justifyContent: "flex-end",
            }),
            Text({
              tag: "a",
              color: "blue-dark",
              target: "_blank",
              size: "small",
              weight: "bold",
              href: "http://bit.ly/3my8Q6i",
              children: `ℹ ${System.data.locale.core.discordPopup.informationLine} 😗`,
            }),
          ],
        ]),
      })),
    });

    document.body.append(this.container);
  }

  private async HandleClose() {
    if (IsVisible(this.spinner)) return;

    this.ShowSpinner();

    const resHidePopup = await CloseDiscordPopupMessage();

    if (resHidePopup.success === false) return;

    this.container.remove();

    this.toplayer = null;
    this.container = null;
  }

  private ShowSpinner() {
    if (!this.spinner) {
      this.RenderSpinner();
    }

    this.toplayer.closeIconContainer.append(this.spinner);
  }

  private RenderSpinner() {
    this.spinner = Spinner({ overlay: true });
  }
}
