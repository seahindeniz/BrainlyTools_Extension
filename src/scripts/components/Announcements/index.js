import makeToplayer from "../../components/Toplayer";

export default () => {
	let announcements = System.data.Brainly.userData.extension.announcements;
	if (announcements && announcements.length > 0) {
		let $overlay = $(`<div class="announcementOverlay"></div>`);
		let $announcementToplayer = makeToplayer("small",
			`<h2 class="sg-header-secondary" title="${System.data.locale.texts.announcements.description}">${System.data.locale.texts.announcements.title}</h2>`);

		$announcementToplayer.appendTo($overlay);
		$overlay.appendTo("body > div.page-wrapper.js-page-wrapper > section > div.js-toplayers-container");
		
		let $announcementContainer = $("div.sg-toplayer__wrapper > div.sg-content-box > div.sg-content-box__content", $announcementToplayer)
		announcements.reverse().forEach(announcement => {
			console.log(announcement);
			let time = new Date(announcement.time).toLocaleDateString(System.data.Brainly.defaultConfig.locale.LANGUAGE, {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "numeric",
				minute: "numeric"
			});
			$announcementContainer.append(`
			<article class="task brn-stream-question" data-id="${announcement._id}">
				<div class="sg-content-box sg-content-box--spaced">
					<div class="sg-content-box__title">
						<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--dark js-read" title="${System.data.locale.texts.announcements.mark_as_read.long}">
							<span class="sg-button-secondary__icon">
								<div class="sg-icon sg-icon--x14 sg-icon--adaptive" style="margin-right: 7px;">
									<svg class="sg-icon__svg">
										<use xlink:href="#icon-check"></use>
									</svg>
								</div>
							</span>${System.data.locale.texts.announcements.mark_as_read.short}
						</button>
						<span class="sg-text sg-text--small sg-text--emphasised sg-text--gray">
							<time>${time}</time>
						</span>
					</div>
					<div class="sg-content-box__content">
						<div class="sg-text">${announcement.content}</div>
					</div>
				</div>
				<div class="sg-horizontal-separator sg-horizontal-separator--spaced"></div>
			</article>`);
		});
		return $overlay;
	} else return false;
}
