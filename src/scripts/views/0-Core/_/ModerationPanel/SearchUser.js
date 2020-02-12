import { Avatar, Flex, Input, Text } from "@/scripts/components/style-guide";
import Action from "@/scripts/controllers/Req/Brainly/Action";
import Build from "@/scripts/helpers/Build";
import debounce from "debounce";
import RemoveJunkNotifications from "../RemoveJunkNotifications";
import Components from "./Components";

/**
 * @param {number | string} n
 */
function isPositiveInteger(n) {
  return Number(n) >>> 0 === parseFloat(String(n));
}

export default class extends Components {
  constructor(main) {
    super(main);

    this.liLinkContent =
      `${System.data.locale.messages.groups.userCategories.findUsers.text}:`;

    this.RenderInput();
    this.RenderListItem();
    this.RenderUserList();
    this.BindHandler();
  }
  RenderInput() {
    this.input = Input({
      type: "search",
      placeholder: System.data.locale.messages.groups
        .userCategories.findUsers.nickOrID
    })
  }
  RenderLiContent() {
    this.liContent = Build(Flex({
        direction: "column",
      }),
      [
        [
          Flex({
            marginBottom: "xxs",
            tag: "label",
          }),
          [,
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
              this.input
            ]
          ]
        ]
      ]
    );
  }
  RenderUserList() {
    this.userList = Flex({
      marginTop: "xs",
      marginBottom: "xs",
      direction: "column",
    });

    // Fixed width to avoid too wide result box when a user has too much ranks
    this.userList.style.width = `${this.main.ul.offsetWidth}px`;
  }
  BindHandler() {
    this.input
      .addEventListener("input", debounce(this.InputChanged.bind(this), 600));
  }
  InputChanged() {
    this.ShowUserList();
    this.ChangeStatusText(
      System.data.locale.core.notificationMessages.searching
    );

    if (!this.input.value || String(this.input.value).length < 2)
      return this.HideUserList();

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
    if (!name || this.userList.children.length > 0)
      return delete this.userList.dataset.placeholder;

    this.userList.dataset.placeholder = name;
  }
  async StartSearching() {
    if (isPositiveInteger(this.input.value))
      await this.FindUserId();

    this.FindUser();
  }
  async FindUserId() {
    let user = await new Action().GetUserProfile(~~this.input.value);

    this.ChangeStatusText();

    if (!user || !user.success || !user.data)
      return this.ChangeStatusText(
        System.data.locale.core.notificationMessages.userNotFound
      );

    this.RenderUser({
      id: user.data.id,
      nick: user.data.nick,
      avatar: System.ExtractAvatarURL(user.data.avatars),
      ranks: user.data.ranks_ids.map(rank_id => {
        let rank = System.data.Brainly.defaultConfig.config.data
          .ranksWithId[rank_id];

        return {
          color: rank.color,
          name: rank.name,
        }
      })
    });

    return true;
  }
  /**
   * @param {{
   *  id?: number,
   *  nick: string,
   *  avatar: string,
   *  profileUrl?: string,
   *  ranks?: {
   *    color: string,
   *    name: string,
   *  }[]
   * }} data
   */
  RenderUser({
    id,
    nick,
    avatar,
    profileUrl,
    ranks = [],
  }) {
    if (!id && !profileUrl)
      return;

    if (!profileUrl)
      profileUrl = System.createProfileLink(id, nick);

    let userElement = Build(Flex({
        marginBottom: "xs",
        fullWidth: true,
      }),
      [
        [
          Flex({ marginRight: "xs" }),
          Avatar({
            imgSrc: avatar,
            link: profileUrl,
          })
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
              })
            ],
            ranks.length > 0 && [
              Flex({ wrap: true, }),
              ranks.map((rank, i) => {
                let textElement = Text({
                  html: rank.name + (i + 1 < ranks.length ? "," : ""),
                  size: "xsmall",
                });

                let color = rank.color;

                if (color &&
                  (
                    !color.includes("rgb") &&
                    !color.startsWith("#")
                  )
                )
                  color = `#${rank.color}`;

                textElement.style.color = color;

                return Flex({
                  marginRight: (i + 1 < ranks.length ? "xxs" : ""),
                  children: textElement
                });
              })
            ]
          ]
        ]
      ]
    );

    this.userList.append(userElement);
  }
  async FindUser() {
    let resUserResult = await new Action().FindUser(this.input.value);
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = resUserResult.replace(
      /onerror="imgError\(this, (?:'|\&\#039\;){1,}\);"/gmi, "");
    let usersData = tempDiv.querySelectorAll("table div.user-data");

    this.ChangeStatusText();
    RemoveJunkNotifications();

    if (!usersData || usersData.length === 0)
      return this.ChangeStatusText(
        System.data.locale.core.notificationMessages.userNotFound
      );

    usersData.forEach(this.FindUserInDiv.bind(this));
  }
  /**
   * @param {HTMLDivElement} div
   */
  FindUserInDiv(div) {
    let avatar = div.querySelector("img").src;
    let divUserNick = div.querySelector(".user-nick");
    let profileAnchor = divUserNick.querySelector("a");
    let profileUrl = profileAnchor["href"];
    let nick = profileAnchor.innerHTML;
    /**
     * @type {* | NodeListOf<HTMLSpanElement | HTMLAnchorElement>[]}
     */
    let ranks = divUserNick.querySelectorAll(":scope > [style]");

    if (ranks && ranks.length > 0)
      ranks = Array.from(ranks).map(rankSpan => ({
        color: rankSpan.style.color,
        name: rankSpan.innerText.trim(),
      }))

    this.RenderUser({
      avatar,
      nick,
      profileUrl,
      ranks,
    })
  }
}
