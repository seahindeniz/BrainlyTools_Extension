"use strict";

window.performanceStartTiming = performance.now();
import _System from "../../controllers/System";
import WaitForObject from "../../helpers/WaitForObject";
import InjectToBody from "../../helpers/InjectToBody";
import Storage from "../../helpers/extStorage";
import storage from "../../helpers/_extStorage";
import themeColorChanger from "../../helpers/themeColorChanger";
import messagesLayoutExtender from "../../helpers/messagesLayoutExtender";
import renderExtraItemsForModerationPanel from "./_/ExtraItemsForModerationPanel"
import renderAnnouncements from "../../components/Announcements"
import renderChatPanel from "../../components/ChatPanel"
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

System.init();

main();

async function main() {
	await SetMetaData();
	let resUserData = await SetUserData();
	Console.info("SetUserData OK!");

	themeColorChanger(resUserData.themeColor || "#57b2f8");
	messagesLayoutExtender(resUserData.extendMessagesLayout || false);
	System.data.Brainly.userData = resUserData.user;

	await SetBrainlyData();
	Console.info("SetBrainlyData OK!");

	System.data.meta.storageKey = System.data.meta.marketName + "_" + ((window.dataLayer && window.dataLayer.length > 0 && window.dataLayer[0].user.id) || System.data.Brainly.userData.user.id);

	let configData = await InjectToBody(`/config/${location.hostname}.json`);
	System.data.config.marketConfig = configData;

	let language = await storage("get", "language");

	if (!language) {
		language = System.data.Brainly.defaultConfig.locale.LANGUAGE;

		if (!language) {
			console.log("Language cannot be saved in storage. Probably a defaultConfig error");

			return false;
		}

		Storage.set({ language });
	}

	let localeData = await System.prepareLangFile(language);
	System.data.locale = localeData;

	Console.info("Locale inject OK!");

	await System.shareGatheredData2Background();
	console.log("Data shared with background services OK!");

	let hash = await Auth();
	Console.info("authProcess OK!");
	System.data.Brainly.userData._hash = hash;

	System.toBackground("notifierInit", true);

	if (System.data.Brainly.userData.extension.newUpdate) {
		notification(System.data.locale.core.notificationMessages.updateNeeded, "info", true);
		System.updateExtension();
	} else {
		/**
		 * Wait for the declaration of the jQuery object
		 */
		await WaitForObject("jQuery");
		Console.info("Jquery OK!");

		/*let _date = new Date();
		if (_date.getMonth() == 9 && _date.getDate() == 31) {
			renderHalloween();
		}*/

		renderExtraItemsForModerationPanel();
		renderAnnouncements();
		renderChatPanel();
		initAfter_FriendsLoaded();
		initAfter_DeleteReasonsLoaded();
		//initAfter_FriendsLoaded_DeleteReasonsLoaded();

		if (System.checkRoute(2, "view_user_warns")) {
			InjectToBody([
				"/scripts/views/7-UserWarnings/index.js",
				System.data.Brainly.style_guide.css,
				"/styles/pages/UserWarnings.css",
				"/styles/pages/oldLayoutFixes.css"
			]);
		}

		if (System.checkRoute(2, "supervisors")) {
			InjectToBody([
				"/scripts/views/8-Supervisors/index.js",
				System.data.Brainly.style_guide.css,
				"/styles/pages/Supervisors.css",
				"/styles/pages/oldLayoutFixes.css"
			]);
		}
	}
}

async function initAfter_FriendsLoaded() {
	await fetchFriends();
	Console.info("Fetching friends OK!");

	if (System.checkRoute(1, "messages")) {
		getAllModerators();
		InjectToBody([
			"/scripts/lib/jquery-observe-2.0.3.min.js",
			"/scripts/lib/jquery-ui.min.js",
			"/scripts/views/2-Messages/index.js",
			"/styles/pages/Messages.css"
		]);
	}

	if (System.checkRoute(1, "user_profile") || (System.checkRoute(1, "users") && System.checkRoute(2, "view"))) {
		InjectToBody([
			"/scripts/views/5-UserProfile/index.js",
			System.data.Brainly.style_guide.css,
			"/styles/pages/UserProfile.css",
			"/styles/pages/oldLayoutFixes.css"
		]);
	}
}

async function initAfter_DeleteReasonsLoaded() {
	await PrepareDeleteReasons();
	Console.info("Delete reasons OK!");

	if (System.checkRoute(1, "") || System.checkRoute(1, "task_subject_dynamic")) {
		InjectToBody([
			"/scripts/lib/jquery-observe-2.0.3.min.js",
			"/scripts/views/1-Home/index.js",
			"/styles/pages/Home.css"
		])
	}

	if (System.checkRoute(1, "task_view")) {
		InjectToBody([
			"/scripts/lib/jquery-observe-2.0.3.min.js",
			"/scripts/views/3-Task/index.js",
			"/styles/pages/Task.css"
		])
	}

	if (System.checkRoute(2, "user_content")) {
		InjectToBody([
			"/scripts/views/4-UserContent/index.js",
			System.data.Brainly.style_guide.css,
			"/styles/pages/UserContent.css",
			"/styles/pages/oldLayoutFixes.css"
		])
	}

	if (System.checkRoute(2, "archive_mod")) {
		InjectToBody([
			"/scripts/lib/jquery-observe-2.0.3.min.js",
			"/scripts/views/6-ArchiveMod/index.js",
			System.data.Brainly.style_guide.css,
			System.data.Brainly.style_guide.icons,
			"/styles/pages/ArchiveMod.css",
			"/styles/pages/oldLayoutFixes.css"
		])
	}
}

function initAfter_FriendsLoaded_DeleteReasonsLoaded() {}
