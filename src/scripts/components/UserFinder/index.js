import Request from "../../controllers/Request";

const UserFinder = () => {
	let searchInput,
		brn_moderation_panel = $(".brn-moderation-panel__list > ul, #moderate-functions > ul");

	if (brn_moderation_panel) {
		searchInput = $(`
		<li class="sg-menu-list__element userFinder" style="display: table; width: 100%;">
			<label class="sg-text sg-text--blue">${System.data.locale.texts.globals.enterId}:
				<input type="number" class="sg-input sg-input--small" placeholder="1234567"/>
			</label>
			<div class="sg-text sg-text--peach js-hidden notFound">${System.data.locale.texts.globals.errors.userNotFound}</div>
			<div class="userList"></div>
		</li>`);
		searchInput.prependTo(brn_moderation_panel);
		$("input", searchInput).on("input", function() {
			let userList = $(".userList", searchInput);
			let $notFound = $(".notFound", searchInput);
			if (!this.value || this.value === "" || !(this.value > 0)) {
				userList.html("");
			} else {
				Request.BrainlyReq("GET", `/api_users/get/${this.value}`, (res) => {
					userList.html("");
					if (res.success && res.data) {
						$notFound.addClass("js-hidden")
						let profileLink = System.createBrainlyLink("profile", { nick: data.nick, id: data.id });

						let ranks = [];
						res.data.ranks_ids.forEach(rankId => {
							let current_rank = System.data.Brainly.defaultConfig.config.data.ranksWithId[rankId];
							ranks.push(`<span class="" style="color:#${(current_rank.color || "000")};">${current_rank.name}</span>`);
						});

						let avatar = "/img/avatars/100-ON.png";
						if (res.data.avatar) {
							avatar = res.data.avatar[64] || res.data.avatar[100];
						}
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
	}
};

export default UserFinder
