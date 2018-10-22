import Request from "../../controllers/Request";

const UserFinder = $seperator => {
	let searchInput = $(`
		<li class="sg-menu-list__element userFinder" style="display: table; width: 100%;">
			<label class="sg-text sg-text--blue">${System.data.locale.core.UserFinder.profileID}:
				<input type="search" class="sg-input sg-input--small" placeholder="1234567"/>
			</label>
			<div class="sg-text sg-text--peach js-hidden notFound">${System.data.locale.core.notificationMessages.userNotFound}</div>
			<div class="userList"></div>
		</li>`);

	searchInput.insertBefore($seperator);

	$("input", searchInput).on("input", function() {
		let userList = $(".userList", searchInput);
		let $notFound = $(".notFound", searchInput);
		const isPosInt = str => /^\+?\d+$/.test(str);

		if (!this.value || this.value === "" || isPosInt(this.value) || !(~~this.value > 0)) {
			userList.html("");
		} else {
			Request.Brainly("GET", `/api_users/get/${this.value}`, (res) => {
				userList.html("");
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
		}
	});

};

export default UserFinder
