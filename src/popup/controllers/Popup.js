import LinkShortener from "../components/LinkShortener";
import ThemeColorChanger from "../components/ThemeColorChanger";
import QuickDeleteButtonsOptions from "../components/QuickDeleteButtonsOptions";
import OtherOptions from "../components/OtherOptions";
import DeleteReasonsPreferences from "../components/DeleteReasonsPreferences";
import Announcements from "../components/Announcements";
import Users from "../components/Users";
import { getUserByID2 } from "../../scripts/controllers/ActionsOfBrainly";
import notification from "../components/notification";

class Popup {
	constructor() {
		this.$body = $("body");
		this.$hero = $("> section.hero", this.$body);
		this.$container = $("> div.hero-body > div.container", this.$hero);
		this.$footer = $("footer.footer", this.$body);
		this.storageData = {};
		this.fetchedUsers = {};

		this.Run_BindEventsForCommonUse();
	}
	Run_BindEventsForCommonUse() {
		setInterval(() => {
			$("[data-time]", this.$body).each((i, elm) => {
				elm = $(elm);
				let time = $(elm).data("time");
				let timeLong = moment(time).fromNow(),
					timeShort = moment(time).fromNow(true);
				elm.attr("title", timeLong);
				elm.text(timeShort);
			});
		}, 1000);

		$(".box > .title", this.$container).on("click", function() {
			$(this).parent().toggleClass("is-active");
		});

		this.$container.on("click", ".message-header > p", function() {
			$(this).parents("article").toggleClass("is-active");
		});
	}
	RenderStatusMessage({ type = "light", title = "", message = "" }) {
		this.$hero.attr("class", `hero is-medium is-bold is-${type}`);
		this.$container.html(`<h1 class="title">${title}</h1><h2 class="subtitle">${message}</h2>`);
	}
	RenderMainUI() {
		let $layout = $(`
		<div class="column">
			<div class="box">
				<figure class="avatar has-text-centered">
					<img src="${System.data.Brainly.userData.user.fixedAvatar}" title="${System.data.Brainly.userData.user.nick} - ${System.data.Brainly.userData.user.id}@${System.data.meta.marketName}">
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
	}
	ShowFooter() {
		this.$footer.removeClass("is-hidden");
		this.RenderFooterInformation();
	}
	RenderFooterInformation() {
		this.$footer.html(`<p class="title is-7 has-text-centered"><a href="https://chrome.google.com/webstore/detail/${System.data.meta.extension.id}" class="has-text-grey" target="_blank">Brainly Tools v${System.data.meta.manifest.version}</a></p>`);
	}
	PrepareSectionsAndContents() {
		this.sections = [
			[
				this.RenderLinkShortener(),
				this.RenderTitle(System.data.locale.popup.extensionOptions.title),
				this.RenderThemeColorChanger(),
				this.RenderQuickDeleteButtonsOptions(),
				this.RenderOtherOptions()
			],
			[
				this.RenderTitle(System.data.locale.popup.extensionManagement.title),
				this.RenderDeleteReasonsPreferences(),
				this.RenderAnnouncements(),
				this.RenderUsers(),
			]
		];

		if ($("html").attr("is") == "options") {
			this.sections[0].splice(0, 1);
		}
	}
	RenderSections() {
		this.sections.forEach(contents => {
			let $section = this.RenderSection();

			contents.forEach($content => {
				$section.append($content)
			});
		});
	}
	RenderSection() {
		let $section = $(`<section></section>`);

		this.$layoutBox.append($section);

		return $section;
	}
	RenderLinkShortener() {
		let $linkShortener = new LinkShortener();

		return $linkShortener;
	}
	RenderTitle(title) {
		let $title = $(`<h4 class="title is-4 has-text-centered">${title}</h4>`);

		return $title;
	}
	RenderThemeColorChanger() {
		let $themeColorChanger = new ThemeColorChanger(this.storageData.themeColor);

		return $themeColorChanger;
	}
	RenderQuickDeleteButtonsOptions() {
		if (System.checkUserP([1, 2, 45])) {
			let $quickDeleteButtonsOptions = new QuickDeleteButtonsOptions(this.storageData.quickDeleteButtonsReasons);

			return $quickDeleteButtonsOptions;
		}
	}
	RenderOtherOptions() {
		let $otherOptions = new OtherOptions(this.storageData);

		return $otherOptions;
	}
	RenderDeleteReasonsPreferences() {
		if (System.checkUserP(11)) {
			let $deleteReasonsPreferences = new DeleteReasonsPreferences();

			return $deleteReasonsPreferences;
		}
	}
	RenderAnnouncements() {
		if (System.checkUserP(4)) {
			let $announcements = new Announcements();

			return $announcements;
		}
	}
	RenderUsers() {
		if (System.checkUserP(5)) {
			let $users = new Users();

			return $users;
		}
	}
	ReserveAUser(brainlyID, data) {
		if (!this.fetchedUsers[brainlyID]) {
			if (!data) {
				this.fetchedUsers[brainlyID] = null;
			} else {
				this.fetchedUsers[brainlyID] = data;
				this.fetchedUsers[brainlyID].brainlyData = null;
			}
		}
	}
	refreshUsersInformations() {
		Object.keys(this.fetchedUsers).forEach(async brainlyID => {
			let user = await this.GetStoredUser(brainlyID);
			let avatar = System.prepareAvatar(user.brainlyData);
			console.log(user.brainlyData, avatar);

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
				let resUser = await getUserByID2(brainlyID);

				if (!resUser || !resUser.success) {
					let message = `${brainlyID} > ${(resUser.message || "error")}`;
					notification(message, "warning");
					return reject(message);
				}

				if (user) {
					user.brainlyData = resUser.data;
				} else {
					user = {
						brainlyData: resUser.data
					}
				}
			}

			resolve(user);
		});
	}
}

export default Popup
