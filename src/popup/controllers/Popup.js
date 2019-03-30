import ext from "../../scripts/utils/ext";
import LinkShortener from "../components/LinkShortener";
import ShortenedLinks from "../components/ShortenedLinks";
import ThemeColorChanger from "../components/ThemeColorChanger";
import QuickDeleteButtonsOptions from "../components/QuickDeleteButtonsOptions";
import OtherOptions from "../components/OtherOptions";
import AccountDeleteReports from "../components/AccountDeleteReports";
import DeleteReasonsPreferences from "../components/DeleteReasonsPreferences";
import Announcements from "../components/Announcements";
import Users from "../components/Users";
import { GetUserByID2 } from "../../scripts/controllers/ActionsOfBrainly";
import storage from "../../scripts/helpers/extStorage";

class Popup {
	constructor() {
		this.$body = $("body");
		this.$hero = $("> section.hero", this.$body);
		this.$heroBody = $("> div.hero-body", this.$hero);
		this.$container = $("> div.container", this.$heroBody);
		this.$footer = $("footer.footer", this.$body);
		this.storageData = {};
		this.fetchedUsers = {};

		this.GetParametersFromBackground();
		this.RefreshTimeElements();
		this.BindEvents();

		setInterval(this.RefreshTimeElements.bind(this), 1000);
	}
	async GetParametersFromBackground() {
		this.parameters = await ext.runtime.sendMessage({ action: "INeedParameters" });
	}
	RefreshTimeElements() {
		$("[data-time]", this.$body).each((i, element) => {
			let $element = $(element);
			let time = $($element).data("time");
			let dateLLL = window.moment(time).format('LLL');
			let timeAgoLong = window.moment(time).fromNow();
			let timeAgoShort = window.moment(time).fromNow(true);

			$element.attr("title", `${timeAgoLong}\n${dateLLL}`);
			$element.text(timeAgoShort);
		});
	}
	BindEvents() {
		$(".box > .title", this.$container).on("click", function() {
			$(this).parent().toggleClass("is-active");
		});

		this.$container.on("click", ".message-header > p", function() {
			$(this).parents("article").toggleClass("is-active");
		});
	}
	async PrepareDataBeforeRendering() {
		let marketData = await ext.runtime.sendMessage({ action: "getMarketData" });

		if (!marketData) {
			return this.RenderStatusMessage({
				type: "danger",
				title: System.data.locale.popup.notificationMessages.errorN.replace("%{error_code}", ` 417 `),
				message: System.data.locale.popup.notificationMessages.iCantFechMarketData
			});
		}

		System.data = marketData;
		let storageData = await storage("get", ["user", "themeColor", "quickDeleteButtonsReasons", "extendMessagesBody", "extendMessagesLayout", "notifier", "language"]);
		//console.log("storageData: ", storageData);
		if (!(storageData && storageData.user && storageData.user.user && storageData.user.user.id && storageData.user.user.id == storageData.user.user.id)) {
			this.RenderStatusMessage({
				type: "danger",
				title: System.data.locale.popup.notificationMessages.errorN.replace("%{error_code}", ` 417 `),
				message: System.data.locale.popup.notificationMessages.uncorrectDate
			});
		} else if (!System.data.Brainly.deleteReasons.__withIds) {
			this.RenderStatusMessage({
				type: "danger",
				title: System.data.locale.popup.notificationMessages.errorN.replace("%{error_code}", ` 416 `),
				message: System.data.locale.popup.notificationMessages.preparingUnsuccessful
			});
		} else {
			this.storageData = storageData;

			this.RenderMainUI();
		}
	}
	RenderStatusMessage({ type = "light", title = "", message = "" }) {
		this.$hero.attr("class", `hero is-medium is-bold is-${type}`);
		this.$container.html(`<h1 class="title">${title}</h1><h2 class="subtitle">${message}</h2>`);
	}
	RenderMainUI() {
		let avatar = System.prepareAvatar(System.data.Brainly.userData.user);
		let $layout = $(`
		<div class="column">
			<div class="box">
				<figure class="avatar has-text-centered">
					<img src="${avatar}" title="${System.data.Brainly.userData.user.nick} - ${System.data.Brainly.userData.user.id}@${System.data.meta.marketName}">
				</figure>
			</div>
		</div>`);
		this.$layoutBox = $(">div.box", $layout);

		this.$container
			.html("")
			.append($layout);
		this.$hero.attr("class", `hero is-success is-halfheight`);

		this.PrepareSectionsAndContents();
		this.RenderSections();
		this.ShowFooter();

		if ($("html").is("options"))
			this.$heroBody.css("width", window.outerWidth * .6);
	}
	ShowFooter() {
		this.$footer.removeClass("is-hidden");
		this.RenderFooterInformation();
	}
	RenderFooterInformation() {
		this.$footer.html(`<p class="title is-7 has-text-centered"><a href="https://chrome.google.com/webstore/detail/${System.data.meta.extension.id}" class="has-text-grey" target="_blank">${System.data.meta.manifest.short_name} v${System.data.meta.manifest.version}</a></p>`);
	}
	PrepareSectionsAndContents() {
		this.sections = [
			[
				new LinkShortener().$layout,
				new ShortenedLinks().$layout
			],
			[
				this.RenderTitle(System.data.locale.popup.extensionOptions.title),
				new ThemeColorChanger(this.storageData.themeColor).$layout,
				this.RenderQuickDeleteButtonsOptions(),
				new OtherOptions(this.storageData).$layout
			],
			[
				this.RenderAccountDeleteReports(),
				this.RenderDeleteReasonsPreferences(),
				this.RenderAnnouncements(),
				this.RenderUsers(),
			]
		];

		if (this.sections[2].filter(Boolean).length > 0) {
			this.sections[2].unshift(this.RenderTitle(System.data.locale.popup.extensionManagement.title));
		}

		if ($("html").attr("is") == "options") {
			this.sections[0].splice(0, 1);
		}
	}
	RenderSections() {
		this.sections.forEach(contents => {
			let $section = this.RenderSection();

			if (contents.filter(Boolean).length > 0) {
				contents.forEach($content => {
					$section.append($content)
				});
			}
		});
	}
	RenderSection() {
		let $section = $(`<section></section>`);

		this.$layoutBox.append($section);

		return $section;
	}
	RenderTitle(title) {
		let $title = $(`<h4 class="title is-4 has-text-centered">${title}</h4>`);

		return $title;
	}
	RenderQuickDeleteButtonsOptions() {
		if (System.checkUserP([1, 2, 45])) {
			let quickDeleteButtonsOptions = new QuickDeleteButtonsOptions(this.storageData.quickDeleteButtonsReasons);

			return quickDeleteButtonsOptions.$layout;
		}
	}
	RenderAccountDeleteReports() {
		if (System.checkUserP(12)) {
			let accountDeleteReports = new AccountDeleteReports();

			return accountDeleteReports.$layout;
		}
	}
	RenderDeleteReasonsPreferences() {
		if (System.checkUserP(11)) {
			let deleteReasonsPreferences = new DeleteReasonsPreferences();

			return deleteReasonsPreferences.$layout;
		}
	}
	RenderAnnouncements() {
		if (System.checkUserP(4)) {
			let announcements = new Announcements();

			return announcements.$layout;
		}
	}
	RenderUsers() {
		if (System.checkUserP(5)) {
			let users = new Users();

			return users.$layout;
		}
	}
	ReserveAUser(brainlyID, data) {
		if (!this.fetchedUsers[brainlyID]) {
			data = data || {};
		} else {
			data = { ...this.fetchedUsers[brainlyID], ...data }
		}

		this.fetchedUsers[brainlyID] = data;

		return this.fetchedUsers[brainlyID];
	}
	refreshUsersInformations() {
		Object.keys(this.fetchedUsers).forEach(async brainlyID => {
			let user = await this.GetStoredUser(brainlyID);
			let avatar = System.prepareAvatar(user.brainlyData);

			if (avatar) {
				$(`a[data-user-id="${user.brainlyData.id}"]`, this.$layoutBox).each((i, element) => {
					let $img = $("img.avatar", element);

					$img.attr("src", avatar);

					element.href = System.createProfileLink(user.brainlyData.nick, user.brainlyData.id);

					if (!element.title) {
						element.title = user.brainlyData.nick;
					}
				});
			}
		});
	}
	GetStoredUser(brainlyID) {
		return new Promise(async (resolve, reject) => {
			let user = this.fetchedUsers[brainlyID];

			if (!user || user && !user.brainlyData) {
				let resUser = await GetUserByID2(brainlyID);

				if (!resUser || !resUser.success) {
					let message = `${brainlyID} > ${(resUser.message || "error")}`;

					return reject(message);
				}

				user = this.ReserveAUser(brainlyID, { brainlyData: resUser.data });
			}

			resolve(user);
		});
	}
}

export default Popup
