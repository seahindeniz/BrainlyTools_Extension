"use strict";

window.performanceStartTiming = performance.now();

import _System from "../../controllers/System";
import WaitForObject from "../../helpers/WaitForObject";
import InjectToDOM from "../../helpers/InjectToDOM";
import storage from "../../helpers/extStorage";
import themeColorChanger from "../../helpers/themeColorChanger";
import messagesLayoutExtender from "../../helpers/messagesLayoutExtender";
import renderExtraItemsForModerationPanel from "./_/ExtraItemsForModerationPanel";
import renderAnnouncements from "./_/Announcements";
//import renderChatPanel from "./_/ChatPanel";
import RenderMenuButtonFixer from "./_/MenuButtonFixer";
import { Auth } from "../../controllers/ActionsOfServer";
import { getAllModerators } from "../../controllers/ActionsOfBrainly"
import PrepareDeleteReasons from "../../controllers/PrepareDeleteReasons"
import notification from "../../components/notification";
import SetMetaData from "./_/SetMetaData";
import SetUserData from "./_/SetUserData";
import SetBrainlyData from "./_/SetBrainlyData";
import fetchFriends from "./_/fetchFriends";
import "../../helpers/preventConsolePreventer";

let System = new _System();
window.System = System;

window.selectors = {
	toplayerContainer: "body > div.js-page-wrapper"
}

window.onbeforeunload = function() {
	if (window.isPageProcessing) {
		let message = System.data.locale.common.notificationMessages.ongoingProcess;

		if (typeof window.isPageProcessing == "string") {
			message = window.isPageProcessing;
		}

		return message;
	}
}

class Core {
	constructor() {
		this.Pipeline();
	}
	async Pipeline() {
		await SetMetaData();

		this.userData = await SetUserData();
		this.UserDataLoaded();

		await SetBrainlyData();

		await this.SetMarketConfig();
		await this.PrepareLanguageData();

		await System.ShareSystemDataToBackground();

		await Auth();
		await this.CheckForNewUpdate();

		System.toBackground("notifierInit", true);

		await WaitForObject("jQuery");
		Console.info("Jquery OK!");

		this.RenderEventCelebrating();
		this.LoadComponentsForAllPages();
		this.InjectFilesToPage();
		this.InjectFilesToPageAfter_FriendsListLoaded();
		this.InjectFilesToPageAfter_DeleteReasonsLoaded();
	}
	UserDataLoaded() {
		themeColorChanger(this.userData.themeColor || "#57b2f8");
		messagesLayoutExtender(this.userData.extendMessagesLayout || false);
	}
	async SetMarketConfig() {
		System.data.config.marketConfig = await InjectToDOM(`/config/${location.hostname}.json`);

		return Promise.resolve();
	}
	async PrepareLanguageData() {
		let language = await storage("get", "language");

		if (!language) {
			language = System.data.Brainly.defaultConfig.locale.LANGUAGE;

			if (!language) {
				throw new Error("Language cannot be saved in storage. This is probably a defaultConfig error");
			}

			storage("set", { language });
		}

		System.data.locale = await System.prepareLangFile(language);
		Console.info("Locale inject OK!");

		return Promise.resolve();
	}
	CheckForNewUpdate() {
		return new Promise((resolve, reject) => {
			if (System.data.Brainly.userData.extension.newUpdate) {
				System.updateExtension();
				notification(System.data.locale.core.notificationMessages.updateNeeded, "info", true);
				reject(System.data.locale.core.notificationMessages.updateNeeded);
			} else {
				resolve();
			}
		});
	}
	async RenderEventCelebrating() {
		/*let _date = new Date();
		if (_date.getMonth() == 9 && _date.getDate() == 31) {
			renderHalloween();
		}*/
		/* await InjectToDOM("/scripts/lib/snowstorm.min.js");
		await WaitForObject("snowStorm");
		snowStorm.snowColor = '#57b2f8';
		snowStorm.flakesMaxActive = 32;
		snowStorm.excludeMobile = false; */
	}
	LoadComponentsForAllPages() {
		renderExtraItemsForModerationPanel();
		renderAnnouncements();
		//renderChatPanel();
		RenderMenuButtonFixer();
	}
	InjectFilesToPage() {
		if (System.checkRoute(2, "view_user_warns")) {
			InjectToDOM([
				"/scripts/views/7-UserWarnings/index.js",
				System.constants.Brainly.style_guide.css,
				System.constants.Brainly.style_guide.icons,
				"/styles/pages/UserWarnings.css",
				"/styles/pages/oldLayoutFixes.css"
			]);
		}

		if (System.checkRoute(2, "supervisors")) {
			InjectToDOM([
				"/scripts/views/8-Supervisors/index.js",
				System.constants.Brainly.style_guide.css,
				System.constants.Brainly.style_guide.icons,
				"/styles/pages/Supervisors.css",
				"/styles/pages/oldLayoutFixes.css"
			]);
		}

		if (System.checkRoute(2, "uploader")) {
			InjectToDOM([
				"/scripts/views/9-Uploader/index.js",
				System.constants.Brainly.style_guide.css,
				System.constants.Brainly.style_guide.icons,
				"/styles/pages/Uploader.css"
			]);
		}
	}
	async InjectFilesToPageAfter_FriendsListLoaded() {
		await fetchFriends();
		Console.info("Fetching friends OK!");

		if (System.checkRoute(1, "messages")) {
			getAllModerators();
			InjectToDOM([
				"/scripts/lib/jquery-observe-2.0.3.min.js",
				"/scripts/lib/jquery-ui.min.js",
				"/scripts/views/2-Messages/index.js",
				"/styles/pages/Messages.css"
			]);
		}

		if (
			System.checkRoute(1, "user_profile") ||
			(
				System.checkRoute(1, "users") &&
				System.checkRoute(2, "view")
			)
		) {
			InjectToDOM([
				"/scripts/views/5-UserProfile/index.js",
				System.constants.Brainly.style_guide.css,
				System.constants.Brainly.style_guide.icons,
				"/styles/pages/UserProfile.css",
				"/styles/pages/oldLayoutFixes.css"
			]);
		}
	}
	async InjectFilesToPageAfter_DeleteReasonsLoaded() {
		await PrepareDeleteReasons();
		Console.info("Delete reasons OK!");

		if (System.checkRoute(1, "") || System.checkRoute(1, "task_subject_dynamic")) {
			InjectToDOM([
				"/scripts/lib/jquery-observe-2.0.3.min.js",
				"/scripts/views/1-Home/index.js",
				"/styles/pages/Home.css"
			])
		}

		if (System.checkRoute(1, "task_view")) {
			InjectToDOM([
				"/scripts/lib/jquery-observe-2.0.3.min.js",
				"/scripts/views/3-Task/index.js",
				"/styles/pages/Task.css"
			])
		}

		if (System.checkRoute(2, "user_content")) {
			InjectToDOM([
				"/scripts/views/4-UserContent/index.js",
				System.constants.Brainly.style_guide.css,
				System.constants.Brainly.style_guide.icons,
				"/styles/pages/UserContent.css",
				"/styles/pages/oldLayoutFixes.css"
			])
		}

		if (System.checkRoute(2, "archive_mod")) {
			InjectToDOM([
				"/scripts/lib/jquery-observe-2.0.3.min.js",
				"/scripts/views/6-ArchiveMod/index.js",
				System.constants.Brainly.style_guide.css,
				System.constants.Brainly.style_guide.icons,
				"/styles/pages/ArchiveMod.css",
				"/styles/pages/oldLayoutFixes.css"
			])
		}
	}
}
new Core();
