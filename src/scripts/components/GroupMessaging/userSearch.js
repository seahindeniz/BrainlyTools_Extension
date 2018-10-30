"use strict";

import { findUser, getUserByID } from "../../controllers/ActionsOfBrainly";
import userLi from "./userLi";

const isPosInt = str => /^\+?\d+$/.test(str);
const idSearch = n => {
	Request.BrainlyAPI("GET", `/api_users/get/${n}`, (res) => {
		$findUsersList.html("");
		if (res.success && res.data) {
			$notFound.addClass("js-hidden");

			let profileLink = System.createBrainlyLink("profile", { nick: res.data.nick, id: res.data.id });
			let ranks = [];
			let avatar = System.prepareAvatar(res.data);

			res.data.ranks_ids.forEach(rankId => {
				let current_rank = System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];
				ranks.push(`<span class="" style="color:#${(current_rank.color || "000")};">${current_rank.name}</span>`);
			});

			userList.append(`
			<div class="sg-content-box sg-content-box--full">
				<div class="sg-content-box__content sg-content-box__content--spaced-top-small">
					<div class="sg-actions-list">
						<div class="sg-actions-list__hole">
							<div class="sg-avatar sg-avatar--normal sg-avatar--spaced">
								<a href="${profileLink}" style="text-align: center;">
									<img class="sg-avatar__image" src="${avatar}">
								</a>
							</div>
						</div>
						<div class="sg-actions-list__hole sg-actions-list__hole--grow">
							<a class="sg-link sg-link--unstyled" href="${profileLink}">
								<span class="sg-text sg-text--small sg-text--gray sg-text--emphasised">${res.data.nick}</span>
							</a>
							<div class="sg-text--xsmall rankList">${ranks.join(", ")}</div>
						</div>
					</div>
				</div>
			</div>`);
		} else {
			$notFound.removeClass("js-hidden");
		}
	});
};

export default $createGroupToplayer => {

	let $idInput = $(`<input type="text" class="sg-input sg-input--small sg-input--full-width" placeholder="${System.data.locale.messages.groups.userCategories.findUsers.nickOrID}" />`);
	let delayTimer;

	$idInput.on("input", function() {
		let $findUsersList = $(".find-users-list>ul", $createGroupToplayer);
		//let $notFound = $(".notFound", searchInput);
		let value = this.value;

		clearTimeout(delayTimer);

		if (!value || value === "") {
			$findUsersList.html("");
		} else {
			delayTimer = setTimeout(() => {
				$findUsersList.html("");
				if (isPosInt(value)) {
					getUserByID(value, res => {
						if (res.success && res.data) {
							let ranks = [];
							let avatar = System.prepareAvatar(res.data);
							let buddyUrl = System.createBrainlyLink("profile", { nick: res.data.nick, id: res.data.id });

							res.data.ranks_ids.forEach(rankId => {
								ranks.push(System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId]);
							});

							let $li = userLi({
								id: res.data.id,
								nick: res.data.nick,
								avatar,
								buddyUrl,
								ranks
							});

							$findUsersList.append($li);
						}
					});
				}

				findUser(value, res => {
					let $userContainers = $('td', res);

					$userContainers.each(function(i, $userContainer) {
						let avatar = $('.user-data > a > img', $userContainer).attr('src');
						let $userLink = $('.user-data > div.user-nick > a.nick', $userContainer);
						let nick = $userLink.text();
						let buddyUrl = $userLink.attr('href');
						//let kisi_id = url.match(/\-(\d{1,})/)[1];
						let id = ~~(buddyUrl.replace(/.*\-/gi, ""))
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

						let $li = userLi({
							id,
							nick,
							avatar,
							buddyUrl,
							ranks
						});

						$findUsersList.append($li);
					});
				});
			}, 600);
		}
	});

	return $idInput
}
