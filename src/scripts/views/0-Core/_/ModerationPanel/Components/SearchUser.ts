import { Avatar, Flex, Input, Text } from "@root/scripts/components/style-guide";
import Action from "@root/scripts/controllers/Req/Brainly/Action";
import Build from "@root/scripts/helpers/Build";
import { FlexElementType } from "@style-guide/Flex";
import debounce from "debounce";
import RemoveJunkNotifications from "../../RemoveJunkNotifications";
import Components from ".";

/* function isPositiveInteger(n: number) {
  return n % (!isNaN(parseFloat(n)) && ~~n >= 0) === 0;
} */

function isPositiveInteger(n) {
  // eslint-disable-next-line no-bitwise
  return n >>> 0 === parseFloat(n);
}

export default class extends Components {
  input: Input;
  userList: FlexElementType;

  constructor(main) {
    super(main);

    this.liLinkContent = `${System.data.locale.messages.groups.userCategories.findUsers.text}:`;

    this.RenderInput();
    this.RenderListItem();
    this.RenderUserList();
    this.BindHandler();
  }

  RenderInput() {
    this.input = new Input({
      type: "search",
      placeholder:
        System.data.locale.messages.groups.userCategories.findUsers.nickOrID,
    });
  }

  RenderLiContent() {
    this.liContent = Build(
      Flex({
        direction: "column",
      }),
      [
        [
          Flex({
            marginBottom: "xxs",
            tag: "label",
          }),
          [
            Flex({
              marginRight: "xs",
              direction: "column",
              children: this.liLink,
              justifyContent: "center",
            }),
            [
              Flex({
                direction: "column",
                justifyContent: "center",
              }),
              this.input,
            ],
          ],
        ],
      ],
    );
  }

  RenderUserList() {
    this.userList = Flex({
      marginTop: "xs",
      marginBottom: "xs",
      direction: "column",
    });

    // Fixed width to avoid too wide result box when a user has too much ranks
    this.userList.style.width = `${this.main.ul.offsetWidth || 293}px`;
  }

  BindHandler() {
    this.input.element.addEventListener(
      "input",
      debounce(this.InputChanged.bind(this), 600),
    );
  }

  InputChanged() {
    this.ShowUserList();
    this.ChangeStatusText(
      System.data.locale.core.notificationMessages.searching,
    );

    if (!this.input.input.value || String(this.input.input.value).length < 2) {
      this.HideUserList();

      return;
    }

    this.StartSearching();
  }

  ShowUserList() {
    this.userList.innerHTML = "";

    this.liContent.append(this.userList);
  }

  HideUserList() {
    this.ChangeStatusText("");
    this.HideElement(this.userList);
  }

  /**
   * @param {string} name
   */
  ChangeStatusText(name = "") {
    if (!name || this.userList.children.length > 0) {
      delete this.userList.dataset.placeholder;

      return;
    }

    this.userList.dataset.placeholder = name;
  }

  async StartSearching() {
    if (isPositiveInteger(this.input.input.value)) await this.FindUserId();

    this.FindUser();
  }

  async FindUserId() {
    const user = await new Action().GetUserProfile(~~this.input.input.value);

    this.ChangeStatusText();

    if (!user || !user.success || !user.data)
      return this.ChangeStatusText(
        System.data.locale.core.notificationMessages.userNotFound,
      );

    this.RenderUser({
      id: user.data.id,
      nick: user.data.nick,
      avatar: System.ExtractAvatarURL(user.data.avatars),
      ranks: user.data.ranks_ids.map(rankId => {
        const rank =
          System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];

        return {
          color: rank.color,
          name: rank.name,
        };
      }),
    });

    return true;
  }

  RenderUser({
    id,
    nick,
    avatar,
    profileUrl: _profileUrl,
    ranks = [],
  }: {
    id?: number;
    nick: string;
    avatar: string;
    profileUrl?: string;
    ranks?: {
      color: string;
      name: string;
    }[];
  }) {
    if (!id && !_profileUrl) return;

    let profileUrl = _profileUrl;

    if (!profileUrl) profileUrl = System.createProfileLink(id, nick);

    const userElement = Build(
      Flex({
        marginBottom: "xs",
        fullWidth: true,
      }),
      [
        [
          Flex({ marginRight: "xs" }),
          Avatar({
            imgSrc: avatar,
            link: profileUrl,
          }),
        ],
        [
          Flex({
            fullWidth: true,
            direction: "column",
            justifyContent: "center",
          }),
          [
            [
              Flex(),
              Text({
                tag: "a",
                text: nick,
                size: "small",
                color: "gray",
                weight: "bold",
                target: "_blank",
                href: profileUrl,
              }),
            ],
            ranks.length > 0 && [
              Flex({ wrap: true }),
              ranks.map((rank, i) => {
                const textElement = Text({
                  html: rank.name + (i + 1 < ranks.length ? "," : ""),
                  size: "xsmall",
                });

                let { color } = rank;

                if (color && !color.includes("rgb") && !color.startsWith("#"))
                  color = `#${rank.color}`;

                textElement.style.color = color;

                return Flex({
                  marginRight: i + 1 < ranks.length ? "xxs" : "",
                  children: textElement,
                });
              }),
            ],
          ],
        ],
      ],
    );

    this.userList.append(userElement);
  }

  async FindUser() {
    const resUserResult = await new Action().FindUser(this.input.input.value);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = resUserResult.replace(
      /onerror="imgError\(this, (?:'|&#039;){1,}\);"/gim,
      "",
    );
    const usersData = tempDiv.querySelectorAll("table div.user-data");

    this.ChangeStatusText();
    RemoveJunkNotifications();

    if (!usersData || usersData.length === 0) {
      this.ChangeStatusText(
        System.data.locale.core.notificationMessages.userNotFound,
      );

      return;
    }

    usersData.forEach(this.FindUserInDiv.bind(this));
  }

  FindUserInDiv(div: HTMLDivElement) {
    const avatar = div.querySelector("img").src;
    const divUserNick = div.querySelector(".user-nick");
    const profileAnchor = divUserNick.querySelector("a");
    const profileUrl = profileAnchor.href;
    const nick = profileAnchor.innerHTML;
    const ranks: NodeListOf<
      HTMLSpanElement | HTMLAnchorElement
    > = divUserNick.querySelectorAll(":scope > [style]");

    this.RenderUser({
      avatar,
      nick,
      profileUrl,
      ranks: Array.from(ranks).map(rankSpan => ({
        color: rankSpan.style.color,
        name: rankSpan.innerText.trim(),
      })),
    });
  }
}
