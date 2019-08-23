import Button from "../../../components/Button";
import notification from "../../../components/notification";
import Progress from "../../../components/Progress";
import Action from "../../../controllers/Req/Brainly/Action";

function FriendsManager() {
  let $profile_friends = $('#profile-friends');

  if ($profile_friends.length > 0 && $profile_friends[0].childElementCount > 0) {
    let _locale = System.data.locale.userProfile;
    let $buttonsContainer = $(`
    <div class="sg-actions-list">
      <div class="sg-actions-list__hole"></div>
      <div class="sg-actions-list__hole"></div>
      <div class="sg-actions-list__hole"></div>
      <div class="sg-actions-list__hole"></div>
    </div>`);

    $buttonsContainer.insertBefore($profile_friends);

    let $showAllFriendsButtonContainer = $("> div:nth-child(1)", $buttonsContainer);
    let $showAllFriendsButton = Button({
      type: "primary-blue",
      size: "small",
      text: _locale.showAllFriends.text,
      title: _locale.showAllFriends.title,
    });;

    $showAllFriendsButton.appendTo($showAllFriendsButtonContainer)

    let $removeAllButtonContainer = $("> div:nth-child(2)", $buttonsContainer);
    let $removeAllButton = Button({
      type: "destructive",
      size: "small",
      text: _locale.removeAllFriends.text,
      title: _locale.removeAllFriends.title
    });

    $removeAllButton.Hide();
    $removeAllButton.appendTo($removeAllButtonContainer);

    let $selectAllButtonContainer = $("> div:nth-child(3)", $buttonsContainer);
    let $selectAllButton = Button({
      type: "primary-blue",
      size: "small",
      text: System.data.locale.common.selectAll
    });

    $selectAllButton.Hide();
    $selectAllButton.appendTo($selectAllButtonContainer);

    let $removeSelectedButtonContainer = $("> div:nth-child(4)", $buttonsContainer);
    let $removeSelectedButton = Button({
      size: "small",
      text: _locale.removeSelectedFriends.text,
      title: _locale.removeSelectedFriends.title
    });

    $removeSelectedButton.Hide();
    $removeSelectedButton.appendTo($removeSelectedButtonContainer);

    $selectAllButton.click(() => {
      let $checkboxes = $('> div.avatar.all:not(.removed) input:checkbox', $profile_friends);
      let selectAllButton = $selectAllButton.get(0);
      let checked = selectAllButton.checked;

      $checkboxes.prop("checked", !checked);
      selectAllButton.checked = !checked;
    });

    let deleteThem = async (idList, progress) => {
      progress.$container.insertAfter("#main-panel > .mint-header__container");

      let doInEachUnfriending = function(count, id) {
        let friend = System.friends.find(f => {
          return f.id == id
        });
        let index = System.friends.indexOf(friend);

        if (index > -1) {
          System.friends.splice(index, 1);
        }

        $(`.avatar[data-id="${id}"]`, $profile_friends).addClass("removed");
        progress.update(count);
      }

      if (typeof idList == "boolean")
        await new Action().RemoveAllFriends(doInEachUnfriending);
      else
        await new Action().RemoveFriends(idList, doInEachUnfriending);

      progress.UpdateLabel(System.data.locale.common.allDone).close();
    };

    $removeSelectedButton.click(() => {
      let $checkboxes = $('> div.avatar.all:not(.removed) input:checkbox:checked', $profile_friends);
      let idList = $checkboxes.map((i, val) => {
        return val.id.replace("check-", "");
      }).get();

      if (idList.length == 0) {
        notification(System.data.locale.userProfile.notificationMessages.selectAtLeastOneUser, "info");
      } else if (confirm(System.data.locale.userProfile.notificationMessages.areYouSureDeleteSelectedFriends)) {
        let progress = new Progress({
          type: "is-success",
          label: System.data.locale.common.progressing,
          max: idList.length
        });

        deleteThem(idList, progress);
      }
    });
    $removeAllButton.click(() => {
      if (confirm(System.data.locale.userProfile.notificationMessages.areYouSureRemoveAllFriends)) {
        let progress = new Progress({
          type: "is-success",
          label: System.data.locale.common.progressing,
          max: System.friends.length
        });

        deleteThem(true, progress);
      }
    });
    $showAllFriendsButton.click(() => {
      if (!System.friends || System.friends.length == 0)
        return notification(System.data.locale.userContent.notificationMessages.youHaveNoFriends, "info");

      $profile_friends.html("");
      $selectAllButton.Show();
      $removeAllButton.Show();
      $removeSelectedButton.Show();
      $showAllFriendsButtonContainer.remove();
      System.friends.forEach(friend => {
        let ranks = "";

        friend.ranks.names.forEach(name => {
          let rankData = System.data.Brainly.defaultConfig.config.data.ranks.find((rank) => {
            return rank.name == name;
          });
          ranks += `<div style="color:#${rankData.color || "000"}">${rankData.name}</div>`;
        });

        $profile_friends.append(`
        <div class="avatar all" data-id="${friend.id}">
          <a href="${friend.buddyUrl}" title="${friend.nick}" class="person">
          <img src="${System.prepareAvatar(friend)}" alt="${friend.nick}" title="${friend.nick}"></a>
          <div class="bilgi">
            <div class="nick">${friend.nick}</div>
            <div class="sg-checkbox">
              <input type="checkbox" class="sg-checkbox__element" id="check-${friend.id}">
              <label class="sg-checkbox__ghost" for="check-${friend.id}">
                <div class="sg-icon sg-icon--adaptive sg-icon--x10">
                  <svg class="sg-icon__svg">
                    <use xlink:href="#icon-check"></use>
                  </svg>
                </div>
              </label>
            </div>
            <div class="rank" style="color: #${(friend.rankColor || '000000') + "30"};">${ranks}</div>
          </div>
        </div>`);
      });
    });
  }
}

export default FriendsManager
