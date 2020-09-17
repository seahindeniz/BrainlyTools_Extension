import CreateElement from "@components/CreateElement";
import Build from "@root/helpers/Build";
import InsertAfter from "@root/helpers/InsertAfter";
import WaitForElement from "@root/helpers/WaitForElement";
import { Flex, Text } from "@style-guide";

export default class TodaysActions {
  #userInfoContainer: NodeListOf<HTMLElement>;
  #container: HTMLAnchorElement;

  constructor() {
    this.Init();
  }

  private async Init() {
    if (Number.isNaN(System.data.Brainly.userData.user.mod_actions_count))
      return;

    await this.FindUserBoxes();
    this.Render();
  }

  private async FindUserBoxes() {
    this.#userInfoContainer = await WaitForElement(
      "div.game-box__element > div.game-box__user-info",
      { multiple: true },
    );
  }

  private Render() {
    this.#container = Build(
      CreateElement({
        href: `/moderation_new/view_moderator/${System.data.Brainly.userData.user.id}`,
        tag: "a",
        target: "_blank",
      }),
      [
        [
          Flex({
            marginTop: "xxs",
          }),
          [
            [
              Flex({
                marginRight: "xxs",
              }),
              Text({
                children: `${System.data.locale.home.todaysActions}:`,
                color: "gray",
                size: "xsmall",
                transform: "capitalize",
              }),
            ],
            Text({
              children: System.data.Brainly.userData.user.mod_actions_count,
              color: "gray",
              size: "xsmall",
              weight: "bold",
            }),
          ],
        ],
      ],
    );

    const clone = this.#container.cloneNode() as HTMLDivElement;
    clone.innerHTML = this.#container.innerHTML;

    const nodes = [this.#container, clone];

    this.#userInfoContainer.forEach(userInfoContainer => {
      const node = nodes.shift();

      if (!node) return;

      InsertAfter(node, userInfoContainer.firstElementChild);
    });
  }
}
