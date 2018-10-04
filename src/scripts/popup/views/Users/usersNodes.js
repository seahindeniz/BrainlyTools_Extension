let processUser = user => {
	let time = "";
	let userStatus = "";

	if (user.approved) {
		userStatus += " approved";
	}

	if (user.checkInTime) {
		time = moment(user.checkInTime).fromNow();
		time = System.data.locale.texts.extension_options.manage_users.firstUsageTimeAgoPreTitle.replace("%s", time);

		if (user.approved) {
			userStatus += " active";
		} else {
			userStatus += " banned";
		}
	} else {
		time = System.data.locale.texts.extension_options.manage_users["hasn'tUsed"];
	}

	console.log(user);
	if (!window.fetchedUsers[user.brainlyID]) {
		window.fetchedUsers[user.brainlyID] = user;
		window.fetchedUsers[user.brainlyID].brainlyData = null
	}

	return `
	<div class="level-item is-inline-block has-text-centered">
		<a data-user-id="${user.brainlyID}" id="${user._id}" title="${time}" target="_blank">
			<figure class="image is-48x48${userStatus}">
				<img class="avatar is-rounded" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
			</figure>
			<p class="nick">${user.nick}</p>
		</a>
	</div>`
}

export default data => {
	let strUsers = "";
	if (typeof data === 'object') {
		if (data.constructor === Array) {
			data.reverse().forEach(user => {
				strUsers += processUser(user);
			});
		} else {
			strUsers += processUser(data);
		}
	}
	return strUsers;
}
