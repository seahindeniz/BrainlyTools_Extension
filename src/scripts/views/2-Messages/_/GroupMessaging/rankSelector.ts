import Dropdown from "../../../../components/Dropdown";
import userLi from "./userLi";

export default $findUsersList => {
  const ranks = System.data.Brainly.defaultConfig.config.data.ranks.map(
    rank => {
      return {
        value: rank.id,
        text: rank.name,
      };
    },
  );
  const $rankSelector = Dropdown({
    label:
      System.data.locale.messages.groups.userCategories.moderatorRanks
        .selectRank,
    class: "sg-dropdown--full-width",
    items: ranks,
  }) as JQuery<HTMLSelectElement>;

  $rankSelector.on("change", function () {
    if (this.value) {
      $findUsersList.html("");

      /* const selectedRank =
        System.data.Brainly.defaultConfig.config.data.ranksWithId[this.value]; */
      const users = System.allModerators.withRanks[this.value];

      if (users && users.length > 0) {
        users.forEach(({ id, nick, ranks_ids, avatar }) => {
          const userRanks = [];
          const buddyUrl = System.createBrainlyLink("profile", { nick, id });
          // eslint-disable-next-line no-param-reassign
          avatar = System.prepareAvatar(avatar);

          ranks_ids.forEach(rankId => {
            userRanks.push(
              System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId],
            );
          });

          const $li = userLi({
            id,
            nick,
            avatar,
            buddyUrl,
            ranks: userRanks,
          });

          $findUsersList.append($li);
        });
      }
    }
  });

  return $rankSelector;
};
