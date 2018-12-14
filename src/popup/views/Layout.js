"use strict"

import ext from "../../scripts/utils/ext";
import renderThemeColor from "./ThemeColor";
import renderDeleteButtonOptions from "./DeleteButtonOptions";
import renderOtherOptions from "./OtherOptions";
import renderAnnouncements from "./Announcements";
import renderManageDeleteReasons from "./ManageDeleteReasons";
import renderUsers from "./Users";
import { CreateShortLink } from "../../scripts/controllers/ActionsOfServer";
import notification from "../components/notification"

const Layout = res => {
	System.data.Brainly.userData.user.fixedAvatar = System.data.Brainly.userData.user.avatars[100] || `https://${System.data.meta.marketName}/img/avatars/100-ON.png`;
	let $layout = $(`
						<section class="section-1">
							<div id="linkShorter" class="column">
								<div class="field is-grouped">
									<div class="control">
										<button class="button is-link" title="${System.data.locale.popup.createShortLinkButton.title}">${System.data.locale.popup.createShortLinkButton.text}</button>
									</div>
									<div class="control is-expanded has-icons-left has-icons-right is-hidden js-input">
										<input class="input is-success" type="text" readonly>
										<span class="icon is-small is-left">
											<i class="fas fa-globe"></i>
										</span>
										<p class="help is-success">${System.data.locale.popup.notificationMessages.shortLinkSuccessMessage}</p>
									</div>
								</div>
							</div>

							<h4 class="title is-4 has-text-centered">${System.data.locale.popup.extensionOptions.title}</h4>

							<div id="themeColor" class="column is-narrow">
								<article class="message is-info">
									<div class="message-header">
										<p>${System.data.locale.popup.extensionOptions.themeColor.title}</p>
									</div>
									<div class="message-body"></div>
								</article>
							</div>
							<div id="quickDeleteButtons" class="column is-narrow"></div>
							<div id="otherOptions" class="column is-narrow">
								<article class="is-dark">
									<div class="message-header">
										<p>${System.data.locale.popup.extensionOptions.otherOptions.title}</p>
									</div>
									<div class="message-body"></div>
								</article>
							</div>
						</section>
						<section class="section-2"></section>
				`);
	let $section1 = $("section.section-1", $layout);
	let $section2 = $("section.section-2", $layout);

	/* renderThemeColor(res.themeColor, $themeColorLayout => {
		$("#themeColor .message-body", $layout).append($themeColorLayout);
	}); */
	$("#themeColor .message-body", $layout).append(renderThemeColor(res.themeColor));

	if (System.checkUserP([1, 2, 45])) {
		renderDeleteButtonOptions(res.quickDeleteButtonsReasons, $deleteButtonOptionsLayout => {
			$("#quickDeleteButtons", $layout).append($deleteButtonOptionsLayout);
		});
	}
	renderOtherOptions(res, $otherOptionsLayout => {
		$("#otherOptions .message-body", $layout).append($otherOptionsLayout);
	});

	if (System.checkUserP([4, 5])) {
		$(`<h4 class="title is-4 has-text-centered">${System.data.locale.popup.extensionManagement.title}</h4>`).appendTo($section2);

		renderManageDeleteReasons($manageDeleteReasonsLayout => {
			$section2.append($manageDeleteReasonsLayout);
		});

		if (System.checkUserP(4)) {
			let $announcementsLayout = renderAnnouncements();

			$section2.append($announcementsLayout);
		}

		if (System.checkUserP(5)) {
			let $usersLayout = renderUsers();

			$section2.append($usersLayout);
		}
	}

	let $shorterInputContainer = $("#linkShorter .js-input", $layout),
		input = $("input.input", $shorterInputContainer);

	input.click(() => input.select());

	const LinkShortenerHandler = function() {
		let that = $(this);

		that.addClass("is-loading").attr("disabled", "true");
		ext.tabs.query({ active: true, currentWindow: true }, async function callback(tabs) {
			var currentTab = tabs[0];
			let url = currentTab.url;
			let resCreated = await CreateShortLink({ url });

			if (!resCreated) {
				notification("Server error", "danger");
				that.removeClass("is-loading").removeAttr("disabled");
			} else {
				if (!resCreated.success || !resCreated.shortCode) {
					notification(resCreated.message || "Unknown error", "danger");
					that.removeClass("is-loading");
					!resCreated.message && that.removeAttr("disabled");
				} else {
					let shortLink = System.data.config.extension.serverURL + "/l/" + resCreated.shortCode;

					input.val(shortLink);

					$shorterInputContainer.removeClass("is-hidden");
					that.removeClass("is-loading").removeAttr("disabled");

					const selected =
						document.getSelection().rangeCount > 0 ?
						document.getSelection().getRangeAt(0) :
						false;
					input.select();
					document.execCommand('copy');
					if (selected) {
						document.getSelection().removeAllRanges();
						document.getSelection().addRange(selected);
					}
				}
			}
		});
	}

	$("#linkShorter button", $layout).on("click", LinkShortenerHandler);
	return $layout;
}

export default Layout
