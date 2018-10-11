let processAnnouncement = announcement => {
	let timeLong = moment(announcement.time).fromNow(),
		timeShort = moment(announcement.time).fromNow(true);

	if (!window.fetchedUsers[announcement.user_id.brainlyID]) {
		window.fetchedUsers[announcement.user_id.brainlyID] = null;
	}

	let readers = "";

	if (announcement.readed_by instanceof Array && announcement.readed_by.length > 0) {
		announcement.readed_by.forEach(reader => {
			//console.log(reader);
			!window.fetchedUsers[reader.user_id.brainlyID] && (window.fetchedUsers[reader.user_id.brainlyID] = null);
			let time = moment(reader.time).format('LLLL');;
			readers += `
			<a class="level-item is-inline-block" data-user-id="${reader.user_id.brainlyID}" title="${System.data.locale.popup.extensionManagement.announcements.readedOn.replace("%{date}}", time)}" target="_blank">
				<figure class="image is-24x24">
					<img class="avatar is-rounded" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
				</figure>
			</a>`;
		});
	}

	return `
	<article class="media" id="${announcement._id}">
		<figure class="media-left">
			<p class="image is-32x32">
				<a href="#" data-user-id="${announcement.user_id.brainlyID}" target="_blank">
					<img class="avatar" src="https://${System.data.meta.marketName}/img/avatars/100-ON.png">
				</a>
			</p>
		</figure>
		<div class="media-content">
			<div class="content">
				<span class="announcementTitle">${announcement.title}</span></span> 
				<a href="${System.createProfileLink(announcement.user_id.nick,announcement.user_id.brainlyID)}" target="_blank"><small>@${announcement.user_id.nick}</small></a> 
				<small title="${timeLong}" data-time="${announcement.time}">${timeShort}</small>
				<i class="fas fa-eye${announcement.published?"":"-slash"}" title="${System.data.locale.popup.notificationMessages[announcement.published ? "published" : "unpublished"]}"></i>
				<br>
				<div class="announcementContent">${announcement.content}</div>
			</div>
			<nav class="level">
				<div class="level-left">${readers}</div>
			</nav>
		</div>
		<div class="media-right">
			<a href="#" class="icon has-text-danger remove" title="${System.data.locale.common.delete}">
				<i class="fas fa-lg fa-times"></i>
			</a><br>
			<a href="#" class="icon has-text-info edit" title="${System.data.locale.common.edit}">
				<i class="fas fa-pencil-alt"></i>
			</a><br>
			<a href="#" class="icon has-text-success publish" data-published="${announcement.published}" title="${System.data.locale.popup.notificationMessages[announcement.published ? "unpublish" : "publish"]}">
				<i class="fas fa-eye${announcement.published?"-slash":""}"></i>
			</a>
		</div>
	</article>`
}

export default data => {
	let strAnnouncements = "";
	if (typeof data === 'object') {
		if (data.constructor === Array) {
			data.reverse().forEach(announcement => {
				strAnnouncements += processAnnouncement(announcement);
			});
		} else {
			strAnnouncements += processAnnouncement(data);
		}
	}
	return strAnnouncements;
}
