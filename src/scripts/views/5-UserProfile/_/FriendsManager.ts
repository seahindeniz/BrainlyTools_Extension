import Action from "@root/controllers/Req/Brainly/Action";
import Button from "@components/Button";
import notification from "@components/notification2";
import Progress from "@components/Progress";

function FriendsManager() {
  const $profileFriends = $("#profile-friends");

  if (
    $profileFriends.length === 0 ||
    $profileFriends[0].childElementCount === 0
  )
    return;

  const locale = System.data.locale.userProfile;
  const $buttonsContainer = $(`
    <div class="sg-actions-list">
      <div class="sg-actions-list__hole"></div>
      <div class="sg-actions-list__hole"></div>
      <div class="sg-actions-list__hole"></div>
      <div class="sg-actions-list__hole"></div>
    </div>`);

  $buttonsContainer.insertBefore($profileFriends);

  const $showAllFriendsButtonContainer = $(
    "> div:nth-child(1)",
    $buttonsContainer,
  );
  const $showAllFriendsButton = Button({
    type: "solid-blue",
    size: "small",
    text: locale.showAllFriends.text,
    title: locale.showAllFriends.title,
  });

  $showAllFriendsButton.appendTo($showAllFriendsButtonContainer);

  const $removeAllButtonContainer = $("> div:nth-child(2)", $buttonsContainer);
  const $removeAllButton = Button({
    type: "solid-peach",
    size: "small",
    text: locale.removeAllFriends.text,
    title: locale.removeAllFriends.title,
  });

  $removeAllButton.Hide();
  $removeAllButton.appendTo($removeAllButtonContainer);

  const $selectAllButtonContainer = $("> div:nth-child(3)", $buttonsContainer);
  const $selectAllButton = Button({
    type: "solid-blue",
    size: "small",
    text: System.data.locale.common.selectAll,
  });

  $selectAllButton.Hide();
  $selectAllButton.appendTo($selectAllButtonContainer);

  const $removeSelectedButtonContainer = $(
    "> div:nth-child(4)",
    $buttonsContainer,
  );
  const $removeSelectedButton = Button({
    size: "small",
    text: locale.removeSelectedFriends.text,
    title: locale.removeSelectedFriends.title,
  });

  $removeSelectedButton.Hide();
  $removeSelectedButton.appendTo($removeSelectedButtonContainer);

  $selectAllButton.on("click", () => {
    const $checkboxes = $(
      "> div.avatar.all:not(.removed) input:checkbox",
      $profileFriends,
    );
    const selectAllButton = $selectAllButton.get(0);
    // @ts-expect-error
    const { checked } = selectAllButton;

    $checkboxes.prop("checked", !checked);
    // @ts-expect-error
    selectAllButton.checked = !checked;
  });

  const deleteThem = async (idList, progress) => {
    progress.$container.insertAfter("#main-panel > .mint-header__container");

    const doInEachUnfriending = function (count, id) {
      const friend = System.friends.find(f => {
        return Number(f.id) === Number(id);
      });
      const index = System.friends.indexOf(friend);

      if (index > -1) {
        System.friends.splice(index, 1);
      }

      $(`.avatar[data-id="${id}"]`, $profileFriends).addClass("removed");
      progress.update(count);
    };

    if (typeof idList === "boolean")
      await new Action().RemoveAllFriends(doInEachUnfriending);
    else await new Action().RemoveFriends(idList, doInEachUnfriending);

    progress.UpdateLabel(System.data.locale.common.allDone).close();
  };

  $removeSelectedButton.on("click", () => {
    const $checkboxes = $(
      "> div.avatar.all:not(.removed) input:checkbox:checked",
      $profileFriends,
    );
    const idList = $checkboxes
      .map((i, val) => {
        return val.id.replace("check-", "");
      })
      .get();

    if (idList.length === 0) {
      notification({
        html:
          System.data.locale.userProfile.notificationMessages
            .selectAtLeastOneUser,
        type: "info",
      });
    } else if (
      confirm(
        System.data.locale.userProfile.notificationMessages
          .areYouSureDeleteSelectedFriends,
      )
    ) {
      const progress = new Progress({
        type: "success",
        label: System.data.locale.common.progressing,
        max: idList.length,
      });

      deleteThem(idList, progress);
    }
  });
  $removeAllButton.on("click", () => {
    if (
      confirm(
        System.data.locale.userProfile.notificationMessages
          .areYouSureRemoveAllFriends,
      )
    ) {
      const progress = new Progress({
        type: "success",
        label: System.data.locale.common.progressing,
        max: System.friends.length,
      });

      deleteThem(true, progress);
    }
  });
  $showAllFriendsButton.on("click", () => {
    if (!System.friends || System.friends.length === 0) {
      notification({
        html: locale.notificationMessages.youHaveNoFriends,
        type: "info",
      });

      return;
    }

    $profileFriends.html("");
    $selectAllButton.Show();
    $removeAllButton.Show();
    $removeSelectedButton.Show();
    $showAllFriendsButtonContainer.remove();
    System.friends.forEach(friend => {
      let ranks = "";

      friend.ranks.names.forEach(name => {
        const rankData = System.data.Brainly.defaultConfig.config.data.ranks.find(
          rank => {
            return rank.name === name;
          },
        );
        ranks += `<div style="color:#${rankData.color || "000"}">${
          rankData.name
        }</div>`;
      });

      $profileFriends.append(`
        <div class="avatar all" data-id="${friend.id}">
          <a href="${friend.buddyUrl}" title="${friend.nick}" class="person">
          <img src="${System.prepareAvatar(friend)}" alt="${
        friend.nick
      }" title="${friend.nick}"></a>
          <div class="bilgi">
            <div class="nick">${friend.nick}</div>
            <div class="sg-checkbox">
              <input type="checkbox" class="sg-checkbox__element" id="check-${
                friend.id
              }">
              <label class="sg-checkbox__ghost" for="check-${friend.id}">
                <div class="sg-icon sg-icon--adaptive sg-icon--x10">
                  <svg class="sg-icon__svg">
                    <use xlink:href="#icon-check"></use>
                  </svg>
                </div>
              </label>
            </div>
            <div class="rank" style="color: #${`${
              friend.rankColor || "000000"
            }30`};">${ranks}</div>
          </div>
        </div>`);
    });
  });
}

export default FriendsManager;
