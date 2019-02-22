"use strict";

import { findUser, getUserByID } from "../../../../controllers/ActionsOfBrainly";

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
					<a class="sg-link sg-link--unstyled" href="${buddyUrl}">
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

const UserFinder = $seperator => {
	let $userFinder = $(`
	<li class="sg-menu-list__element userFinder" style="display: table; width: 100%;">
		<label class="sg-menu-list__link">${System.data.locale.messages.groups.userCategories.findUsers.text}:
			<input type="search" class="sg-input sg-input--small" placeholder="${System.data.locale.messages.groups.userCategories.findUsers.nickOrID}"/>
		</label>
		<div class="userList js-hidden" data-placeholder=""></div>
	</li>`);

	$userFinder.insertBefore($seperator);

	$userList = $(".userList", $userFinder);
	let delayTimer;

	$("input", $userFinder).on("input", function() {
		let value = this.value;

		$userList.html("");
		$userList.attr("data-placeholder", System.data.locale.core.notificationMessages.searching);
		$userList.removeClass("js-hidden");

		clearTimeout(delayTimer);

		if (!value || value == "") {
			$userList.attr("data-placeholder", "");
			$userList.addClass("js-hidden");
		} else {
			delayTimer = setTimeout(async () => {
				if (isPosInt(value)) {
					let user = await getUserByID(value);

					if (!user || !user.success || !user.data) {
						$userList.attr("data-placeholder", System.data.locale.core.notificationMessages.userNotFound);
					} else {
						let ranks = [];
						let avatar = System.prepareAvatar(user.data);
						let buddyUrl = System.createBrainlyLink("profile", { nick: user.data.nick, id: user.data.id });

						user.data.ranks_ids.forEach(rankId => {
							ranks.push(System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId]);
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

				let resUserResult = await findUser(value);
				let $userContainers = $('td', resUserResult);

				if (!$userContainers || $userContainers.length == 0) {
					$userList.attr("data-placeholder", System.data.locale.core.notificationMessages.userNotFound);
				} else {
					$userContainers.each(function(i, $userContainer) {
						let avatar = $('.user-data > a > img', $userContainer).attr('src');
						let $userLink = $('.user-data > div.user-nick > a.nick', $userContainer);
						let nick = $userLink.text();
						let buddyUrl = $userLink.attr('href');
						let id = System.ExtractId(buddyUrl);
						let rankList = $('div.user-data > div.user-nick > a:nth-child(3), div.user-data > div.user-nick > span', $userContainer);
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
	});

};

export default UserFinder
