import WaitForElm from "../../helpers/WaitForElm";
import { getUserByID, RemoveFriend } from "../../controllers/ActionsOfBrainly";
import { passUser } from "../../controllers/ActionsOfServer";
import UserNoteBox from "../../components/UserNoteBox";
import UserPreviousNicks from "../../components/UserPreviousNicks";
import UserDescription from "../../components/UserDescription";
import UserFlag from "../../components/UserFlag";
import Notification from "../../components/Notification";
import Progress from "../../components/Progress";
import Buttons from "../../components/Buttons";

System.pageLoaded("User Profile inject OK!");

WaitForElm("#main-right", targetElm => {
	if (profileData && profileData.id && profileData.nick) {
		let $userNoteContainer = $(`<div class="userNoteContainer"><h3 class="bold dark_grey" title="${System.data.locale.common.personalNote.title}">${System.data.locale.common.personalNote.placeholder}</h3></div>`);

		$userNoteContainer.prependTo(targetElm);
		let userGender = null,
			serverData = null;
		let renderFlags = () => {
			if (userGender && serverData && serverData.probatus) {
				let $flag = UserFlag(userGender, "img");

				$flag.prependTo("#main-left > div.personal_info");
				$("#main-left span.ranking").css("width", "100%").append(UserFlag(userGender, "tag")).children("h2").css("float", "left");
			}
		}

		passUser(profileData.id, profileData.nick, user => {
			if (user) {
				serverData = user;

				renderFlags();
				UserNoteBox(user).appendTo($userNoteContainer);
				UserPreviousNicks(user).insertBefore("#main-left > div.personal_info > div.helped_info");
			}
		});
		getUserByID(profileData.id, res => {
			if (res && res.success) {
				userGender = res.data.gender || 0;

				renderFlags();
				UserDescription(res.data.description);
			}
		});

		let $profile_friends = $('#profile-friends');
		if ($profile_friends.length > 0 && $profile_friends[0].childElementCount > 0) {
			let _locale = System.data.locale.userProfile;
			let buttonData = [{
					text: _locale.removeAllFriends.text,
					title: _locale.removeAllFriends.title,
					type: "peach removeAll"
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

			let deleteThem = (idList, progress) => {
				progress.container.insertAfter("#main-panel > .mint-header__container");

				RemoveFriend(idList, {
					success: () => {
						progress.updateLabel(System.data.locale.common.allDone).close();
					},
					each: (i, id) => {
						let friend = System.friends.find(f => {
							return f.id == id
						});
						let index = System.friends.indexOf(friend);

						if (index > -1) {
							System.friends.splice(index, 1);
						}

						$(`.avatar[data-id="${id}"]`, $profile_friends).addClass("removed");
						progress.update(i);
					}
				});
			};

			$removeSelected.click(() => {
				let $checkboxes = $('> div.avatar.all:not(.removed) input:checkbox:checked', $profile_friends);
				let idList = $checkboxes.map((i, val) => {
					return val.id.replace("check-", "");
				}).get();

				if (idList.length == 0) {
					Notification(System.data.locale.userProfile.notificationMessages.selectAtLeasetOneUser, "info");
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
					Notification(System.data.locale.userContent.notificationMessages.youHaveNoFriends, "info");
				} else {
					$profile_friends.html("");
					$showAllFriends.parent().remove();
					$selectAll.parent().removeClass('js-hidden');
					$removeSelected.parent().removeClass('js-hidden');
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

	} else {
		Console.error("Can't find the user profile data");
	}
});
