import CreateElement from "@/scripts/components/CreateElement";
import Build from "@/scripts/helpers/Build";
import Action from "@BrainlyAction";
import { Flex, Input } from "@style-guide";
import Components from "./Components";

let $userList;

const isPosInt = str => (/^\+?\d+$/).test(str);
const userLi = ({ id, nick, avatar, buddyUrl, ranks }) => {
  let $userBox = $(`
	<div class="sg-content-box sg-content-box--full">
		<div class="sg-content-box__content sg-content-box__content--spaced-top-small">
			<div class="sg-actions-list">
				<div class="sg-actions-list__hole">
					<div class="sg-avatar sg-avatar--normal sg-avatar--spaced">
						<a href="${buddyUrl}" style="text-align: center;">
							<img class="sg-avatar__image" src="${avatar}">
						</a>
					</div>
				</div>
        <div class="sg-actions-list__hole sg-actions-list__hole--grow">
          <a href="${buddyUrl}" class="sg-text sg-text--link">
            <span class="sg-text sg-text--small sg-text--gray sg-text--emphasised">${nick}</span>
          </a>
					<div class="sg-text--xsmall rankList"></div>
				</div>
			</div>
		</div>
	</div>`);

  let $rankList = $("div.rankList", $userBox);
  let addRank = rank => {
    let color = "#000";
    if (rank.color) {
      color = rank.color;

      if (color.indexOf("rgb") < 0) {
        color = "#" + rank.color;
      }
    }

    $rankList.append(`<span style="color:${color};">${rank.name}</span>`);
  }

  if (ranks != "") {
    if (ranks instanceof Array) {
      ranks.forEach(rank => {
        addRank(rank);
      });
    } else if (typeof ranks == "object") {
      addRank(ranks);
    }
  }

  $userBox.appendTo($userList);
}

export default class extends Components {
  constructor(main) {
    super(main);

    this.liLinkContent =
      `${System.data.locale.messages.groups.userCategories.findUsers.text}:`;

    this.RenderInput();
    this.RenderListItem();
    this.Render();
    this.BindHandler();
  }
  RenderInput() {
    this.input = Input({
      type: "search",
      placeholder: System.data.locale.messages.groups
        .userCategories
        .findUsers.nickOrID
    })
  }
  RenderLiContent() {
    this.liContent = Build(CreateElement({
      tag: "label",
    }), [
      [
        Flex({
          marginBottom: "xxs",
        }),
        [,
          Flex({
            children: this.liLink,
            direction: "column",
            marginRight: "xs",
          }),
          [
            Flex({
              direction: "column",
            }),
            this.input
          ]
        ]
      ]
    ]);
  }
  Render() {
    this.userList = document.createElement("div");
    this.userList.className = "userList js-hidden";
    $userList = $(this.userList);

    this.liContent.appendChild(this.userList);
  }
  BindHandler() {
    this.input.addEventListener("input", this.InputChanged.bind(this));
  }
  InputChanged() {
    let delayTimer;
    let value = this.input.value;

    $userList.html("");
    $userList.attr("data-placeholder", System.data.locale.core
      .notificationMessages.searching);
    $userList.removeClass("js-hidden");

    clearTimeout(delayTimer);

    if (!value || value == "") {
      $userList.attr("data-placeholder", "");
      $userList.addClass("js-hidden");
    } else {
      delayTimer = setTimeout(async () => {
        if (isPosInt(value)) {
          let user = await new Action().GetUserProfile(~~value);

          if (!user || !user.success || !user.data) {
            $userList.attr("data-placeholder", System.data.locale
              .core.notificationMessages.userNotFound);
          } else {
            let ranks = [];
            let avatar = System.prepareAvatar(user.data);
            let buddyUrl = System.createBrainlyLink(
              "profile", {
                nick: user.data.nick,
                id: user.data
                  .id
              });

            user.data.ranks_ids.forEach(rankId => {
              ranks.push(System.data.Brainly.defaultConfig
                .config.data.ranksWithId[rankId]);
            });

            userLi({
              id: user.data.id,
              nick: user.data.nick,
              avatar,
              buddyUrl,
              ranks
            });
          }
        }

        let resUserResult = await new Action().FindUser(value);
        let $userContainers = $('td', resUserResult);

        if (!$userContainers || $userContainers.length == 0) {
          $userList.attr("data-placeholder", System.data.locale.core
            .notificationMessages.userNotFound);
        } else {
          $userContainers.each(function(i, $userContainer) {
            let avatar = $('.user-data > a > img',
              $userContainer).attr('src');
            let $userLink = $(
              '.user-data > div.user-nick > a.nick',
              $userContainer);
            let nick = $userLink.text();
            let buddyUrl = $userLink.attr('href');
            let id = System.ExtractId(buddyUrl);
            let rankList = $(
              'div.user-data > div.user-nick > a:nth-child(3), div.user-data > div.user-nick > span',
              $userContainer);
            let ranks = "";

            if (rankList.length == 1) {
              ranks = {
                name: rankList.text(),
                color: rankList.css("color")
              };
            } else if (rankList.length > 1) {
              ranks = [];
              rankList.each((i, rank) => {
                ranks.push({
                  name: rank.innerText,
                  color: rank.style.color
                });
              });
            }

            if (avatar == '/img/') {
              avatar = '/img/avatars/100-ON.png';
            }

            userLi({
              id,
              nick,
              avatar,
              buddyUrl,
              ranks
            });
          });
        }
      }, 600);
    }
  }
}
