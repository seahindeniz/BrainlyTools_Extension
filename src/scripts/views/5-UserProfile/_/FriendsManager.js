import notification from "../../../components/notification";
import Progress from "../../../components/Progress";
import Buttons from "../../../components/Buttons";
import { RemoveFriends, RemoveAllFriends } from "../../../controllers/ActionsOfBrainly";

function FriendsManager() {
	let $profile_friends = $('#profile-friends');

	if ($profile_friends.length > 0 && $profile_friends[0].childElementCount > 0) {
		let _locale = System.data.locale.userProfile;
		let buttonData = [{
				text: _locale.removeAllFriends.text,
				title: _locale.removeAllFriends.title,
				type: "peach removeAll",
				templateClass: "js-hidden"
			},
			{
				text: _locale.showAllFriends.text,
				title: _locale.showAllFriends.title,
				type: "alt showAll"
			},
			{
				text: System.data.locale.common.selectAll,
				type: "alt selectAll",
				templateClass: "js-hidden"
			},
			{
				text: _locale.removeSelectedFriends.text,
				title: _locale.removeSelectedFriends.title,
				type: "dark removeSelected",
				templateClass: "js-hidden"
			}
		];
		let buttons = Buttons('ActionButtonNoIcon', buttonData, `<div class="sg-actions-list__hole{class}">{button}</div>`);
		let $buttonsContainer = $(`<div class="sg-actions-list">${buttons}</div>`);
		let $showAllFriends = $(".showAll", $buttonsContainer);
		let $removeAll = $(".removeAll", $buttonsContainer);
		let $removeSelected = $(".removeSelected", $buttonsContainer);
		let $selectAll = $(".selectAll", $buttonsContainer);

		$buttonsContainer.insertBefore($profile_friends);

		$selectAll.click(() => {
			let $checkboxes = $('> div.avatar.all:not(.removed) input:checkbox', $profile_friends);
			let checked = $selectAll.get(0).checked;

			$checkboxes.prop("checked", !checked);
			$selectAll.get(0).checked = !checked;
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

			if (typeof idList == "boolean") {
				await RemoveAllFriends(doInEachUnfriending);
			} else {
				await RemoveFriends(idList, doInEachUnfriending);
			}

			progress.UpdateLabel(System.data.locale.common.allDone).close();
		};

		$removeSelected.click(() => {
			let $checkboxes = $('> div.avatar.all:not(.removed) input:checkbox:checked', $profile_friends);
			let idList = $checkboxes.map((i, val) => {
				return val.id.replace("check-", "");
			}).get();

			if (idList.length == 0) {
				notification(System.data.locale.userProfile.notificationMessages.selectAtLeasetOneUser, "info");
			} else if (confirm(System.data.locale.userProfile.notificationMessages.areYouSureDeleteSelectedFriends)) {
				let progress = new Progress({
					type: "is-success",
					label: System.data.locale.common.progressing,
					max: idList.length
				});

				deleteThem(idList, progress);
			}
		});
		$removeAll.click(() => {
			if (confirm(System.data.locale.userProfile.notificationMessages.areYouSureRemoveAllFriends)) {
				let progress = new Progress({
					type: "is-success",
					label: System.data.locale.common.progressing,
					max: System.friends.length
				});

				deleteThem(true, progress);
			}
		});
		$showAllFriends.click(() => {
			if (!System.friends || System.friends.length == 0) {
				notification(System.data.locale.userContent.notificationMessages.youHaveNoFriends, "info");
			} else {
				$profile_friends.html("");
				$showAllFriends.parent().remove();
				$selectAll.parent().removeClass('js-hidden');
				if ((profileData && profileData.id == System.data.Brainly.userData.user.id)) {
					$removeAll.parent().removeClass('js-hidden');
					$removeSelected.parent().removeClass('js-hidden');
				}
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
			}
		});
	}
}

export default FriendsManager
