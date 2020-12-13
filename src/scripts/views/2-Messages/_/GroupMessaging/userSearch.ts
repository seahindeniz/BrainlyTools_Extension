import Action from "@BrainlyAction";
import userLi from "./userLi";

const isPosInt = str => /^\+?\d+$/.test(str);

export default $findUsersList => {
  const $idInput = $(
    `<input type="text" class="sg-input sg-input--small sg-input--full-width" placeholder="${System.data.locale.messages.groups.userCategories.findUsers.nickOrID}" />`,
  ) as JQuery<HTMLInputElement>;
  let delayTimer;

  $idInput.on("input", function () {
    // let $notFound = $(".notFound", searchInput);
    let { value } = this;

    clearTimeout(delayTimer);

    if (!value || value === "") {
      $findUsersList.html("");
    } else {
      delayTimer = setTimeout(async () => {
        $findUsersList.html("");

        value = value.trim();
        this.value = value;

        if (isPosInt(value)) {
          const user = await new Action().GetUserProfile(value);

          if (user.success && user.data) {
            const ranks = [];
            const avatar = System.prepareAvatar(user.data);
            const buddyUrl = System.createBrainlyLink("profile", {
              nick: user.data.nick,
              id: user.data.id,
            });

            user.data.ranks_ids.forEach(rankId => {
              ranks.push(
                System.data.Brainly.defaultConfig.config.data.ranksWithId[
                  rankId
                ],
              );
            });

            const $li = userLi({
              id: user.data.id,
              nick: user.data.nick,
              avatar,
              buddyUrl,
              ranks,
            });

            $findUsersList.append($li);
          }
        }

        const resResults = await new Action().FindUser(value);

        const $userContainers = $("td", resResults);

        $userContainers.each((i, $userContainer) => {
          let avatar = $(".user-data > a > img", $userContainer).attr("src");
          const $userLink = $(
            ".user-data > div.user-nick > a.nick",
            $userContainer,
          );
          const nick = $userLink.text();
          const buddyUrl = $userLink.attr("href");
          const id = System.ExtractId(buddyUrl);
          const rankList = $(
            "div.user-data > div.user-nick > a:nth-child(3), div.user-data > div.user-nick > span",
            $userContainer,
          );
          let ranks;

          if (rankList.length === 1) {
            ranks = {
              name: rankList.text(),
              color: rankList.css("color"),
            };
          } else if (rankList.length > 1) {
            ranks = [];
            rankList.each((_, rank) => {
              ranks.push({
                name: rank.innerText,
                color: rank.style.color,
              });
            });
          }

          if (avatar === "/img/") {
            avatar = "/img/avatars/100-ON.png";
          }

          const $li = userLi({
            id,
            nick,
            avatar,
            buddyUrl,
            ranks,
          });

          $findUsersList.append($li);
        });
      }, 600);
    }
  });

  return $idInput;
};
