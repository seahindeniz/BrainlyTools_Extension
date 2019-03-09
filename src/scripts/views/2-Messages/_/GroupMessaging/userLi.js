export default (user, isGroupMember) => {
	let $conversation = $(`
	<li class="sg-list__element js-conversation${isGroupMember ? "" : " new-user"}" data-user-id="${user.id}">
		<div class="js-conversation-content sg-media sg-media--clickable ">
			<div class="sg-media__aside">
				<div class="sg-avatar">
					<img class="sg-avatar__image" src="${user.avatar}" alt="${user.nick}" title="${user.nick}">
				</div>
			</div>
			<div class="sg-media__wrapper">
				<div class="sg-media__content js-message-content"><h2 class="sg-text sg-text--small sg-text--gray">${user.nick}</h2></div>
				<div class="sg-media__content sg-media__content--small">
					<div class="sg-text sg-text--xsmall sg-text--gray-secondary">
						<ul class="sg-breadcrumb-list sg-breadcrumb-list--adaptive sg-breadcrumb-list--short"></ul>
					</div>
				</div>
			</div>
		</div>
	</li>`);

	let $rankList = $("ul.sg-breadcrumb-list", $conversation);
	let addRank = rank => {
		let color = "#000";
		if (rank.color) {
			color = rank.color;

			if (color.indexOf("rgb") < 0) {
				color = "#" + rank.color;
			}
		}

		$rankList.append(`<li class="sg-breadcrumb-list__element" style="color:${color};">${rank.name}</li>`);
	}

	if (user.ranks != "") {
		if (user.ranks instanceof Array) {
			user.ranks.forEach(rank => {
				addRank(rank);
			});
		} else if (typeof user.ranks == "object") {
			addRank(user.ranks);
		}
	}

	return $conversation
}
