import notification from "../../../components/notification";
import Toplayer from "../../../components/Toplayer";
import ServerReq from "@ServerReq";

export default () => {
  let announcements = System.data.Brainly.userData.extension.announcements;

  if (!announcements || announcements.length == 0)
    return false;

  let $overlay = $(`<div class="announcementOverlay"></div>`);
  let announcementToplayer = new Toplayer({
    size: null,
    header: `<h2 class="sg-header-secondary" title="${System.data.locale.core.announcements.title}">${System.data.locale.core.announcements.text}</h2>`
  });

  announcementToplayer.$toplayer.appendTo($overlay);
  $overlay.appendTo(window.selectors.toplayerContainer);

  let $announcementContainer = $("div.sg-toplayer__wrapper > div.sg-content-box > div.sg-content-box__content:not(:first-child)", announcementToplayer.$toplayer);

  announcements.reverse().forEach(announcement => {
    let time = new Date(announcement.time).toLocaleDateString(System.data.Brainly.defaultConfig.locale.LANGUAGE, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
    $announcementContainer.append(`
			<article class="announcement" id="${announcement._id}">
				<div class="sg-content-box sg-content-box--spaced">
					<div class="sg-content-box__title">
						<button class="sg-button-secondary sg-button-secondary--small sg-button-secondary--dark js-read" title="${System.data.locale.core.announcements.markAsRead}">
							<span class="sg-button-secondary__icon">
								<div class="sg-icon sg-icon--x10 sg-icon--adaptive">
									<svg class="sg-icon__svg">
										<use xlink:href="#icon-check"></use>
									</svg>
								</div>
							</span>
						</button>
						<div>
							<div class="sg-text sg-text--small sg-text--emphasised sg-text--gray announcementTitle" title="${$(`<div>${announcement.title}</div>`).text()}">${announcement.title}</div>
							<div class="sg-text sg-text--xsmall sg-text--emphasised sg-text--gray">
								<time>${time}</time>
							</div>
						</div>
					</div>
					<div class="sg-content-box__content">
						<div class="sg-text">${announcement.content}</div>
					</div>
				</div>
				<div class="sg-horizontal-separator sg-horizontal-separator--spaced"></div>
			</article>`);
  });

  let $closeIcon = $(".sg-toplayer__close", announcementToplayer.$toplayer);

  $closeIcon.click(() => {
    $overlay.toggleClass("js-closed");
  });

  $(announcementToplayer.$toplayer).on("click", ".js-read:not(.sg-button-secondary--disabled)", async function() {
    let that = $(this);
    let $article = that.parents("article.announcement");
    let id = $article.attr("id");

    that.addClass("sg-button-secondary--disabled").attr("disabled", "true");

    let resReaded = await new ServerReq().AnnouncementRead(id);

    if (resReaded && resReaded.success) {
      that.removeClass("sg-button-secondary--dark");
    } else {
      notification(System.data.locale.common.notificationMessages.operationError, "error");
      that.removeClass("sg-button-secondary--disabled").removeAttr("disabled");
    }
  });

  return $overlay;
}
