"use strict";

import Dropdown from "../../../../components/Dropdown";
import userLi from "./userLi";

export default $createGroupToplayer => {
  let $findUsersList = $(".find-users-list>ul", $createGroupToplayer);
  let ranks = System.data.Brainly.defaultConfig.config.data.ranks.map((rank) => {
    return {
      value: rank.id,
      text: rank.name
    }
  });
  let $rankSelector = Dropdown({
    label: System.data.locale.messages.groups.userCategories.moderatorRanks.selectRank,
    class: "sg-dropdown--full-width",
    items: ranks
  });

  $rankSelector.on("change", function() {
    if (this.value) {
      $findUsersList.html("");

      let selectedRank = System.data.Brainly.defaultConfig.config.data.ranksWithId[this.value];
      let users = System.allModerators.withRanks[this.value];

      if (users && users.length > 0) {
        users.forEach(({ id, nick, ranks_ids, avatar }) => {

          let userRanks = [];
          let buddyUrl = System.createBrainlyLink("profile", { nick, id });
          avatar = System.prepareAvatar(avatar);

          ranks_ids.forEach(rankId => {
            userRanks.push(System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId]);
          });

          let $li = userLi({
            id,
            nick,
            avatar,
            buddyUrl,
            ranks: userRanks
          });

          $findUsersList.append($li);
        });
      }
    }
  });

  return $rankSelector;
}
