"use strict";

window.performanceStartTiming = performance.now();

import _System from "../../controllers/System";
import ext from "../../utils/ext";
import MakeExpire from "../../helpers/MakeExpire";
import WaitForFn from "../../helpers/WaitForFn";
import Inject2body from "../../helpers/Inject2body";
import Storage from "../../helpers/extStorage";
import themeColorChanger from "../../helpers/themeColorChanger";
import messagesLayoutExtender from "../../helpers/messagesLayoutExtender";
import Request from "../../controllers/Request";
import renderUserFinder from "../../components/UserFinder"
import renderAnnouncements from "../../components/Announcements"
import { GetDeleteReasons } from "../../controllers/ActionsOfServer"

let System = new _System();
window.System = System;

System.init();

/**
 * Preventing the Console method preventer
 */
window.Console = console;
/*let _loopConsole_expire = MakeExpire();
let _loopConsole = setInterval(() => {
	if (_loopConsole_expire < new Date().getTime()) {
		clearInterval(_loopConsole);
	}
	console = Console;
});*/

let setMetaData = callback => {
	let extension_URL = new URL(document.currentScript.src);
	System.data.meta = {
		marketTitle: document.title,
		extension: {
			id: extension_URL.host,
			URL: extension_URL.origin
		}
	}
	/**
	 * Get and prepare the meta data requested from contentscript.js 
	 */
	var evtMetaGet = new Event("metaGet", { "bubbles": true, "cancelable": false });
	document.dispatchEvent(evtMetaGet);
	window.addEventListener('message', e => {
		if (e.data.action == "metaSet") {
			window.System.data.meta = { ...window.System.data.meta, ...e.data.data }
			callback && callback();
		}
		if (e.data.action == "shareGatheredData2Background") {
			prepareDeleteReasons(() => {
				System.shareGatheredData2Background(() => {
					var evtSharingDone = new Event("shareGatheredData2BackgroundDone", { "bubbles": true, "cancelable": false });
					document.dispatchEvent(evtSharingDone);
				});
			});
		}
	});
}

/*window.addEventListener('message', e => {
	if (e.data.action == "shareGatheredData2Background") {
		console.log("contentscript ile paylaş", e.data);
		prepareDeleteReasons(() => {
			System.shareGatheredData2Background(() => {
				console.log("background ile paylaşıldı");
				ext.runtime.sendMessage(System.data.meta.extension.id, { action: "shareGatheredData2Background" }, res => {});
			});
		});
	}
});*/
let processDefaultConfig = (callback) => {
	WaitForFn("Routing", obj => {
		if (obj && obj.b && obj.b.prefix && obj.d && obj.d.c) {
			System.data.Brainly.defaultConfig = window.__default_config;
			System.data.Brainly.defaultConfig.user.ME = JSON.parse(System.data.Brainly.defaultConfig.user.ME);
			System.data.Brainly.Routing.prefix = obj.b.prefix;
			System.data.Brainly.Routing.routes = obj.d.c;
			localStorage.setObject("_Routing", System.data.Brainly.Routing);
			localStorage.setObject("__default_config", System.data.Brainly.defaultConfig);
			callback && callback();
		} else {
			Console.log("Routing error", obj);
		}
	})
}
let getDefaultConfig = callback => {
	Request.get("/question/add", res => {
		if (res && res != "") {
			let matchConfig = (/(\{\s{1,}.*[\S\s]*\}\s{1,}\}\;)\s{1,}\<\/script/gmi).exec(res);
			let matchSecondConfig = (/\.config \= (.*)\;/gmi).exec(res);
			let matchAuthJSFile = res.match(/(\/sf\/js\/bundle\/include_auth\_[a-z\_\-]{1,}\-[a-z0-9]{1,}\.min\.js)/gmi);

			if (!matchConfig || matchConfig.length < 2) {
				Console.error("Config object not found");
			} else if (!matchSecondConfig || matchSecondConfig.length < 2) {
				Console.error("Second config object not found");
			} else if (!matchAuthJSFile || matchAuthJSFile.length < 1) {
				Console.error("Auth JS file not found");
			} else {
				System.data.Brainly.defaultConfig = new Function(`return ${matchConfig[matchConfig.length - 1]}`)();
				System.data.Brainly.defaultConfig.user.ME = JSON.parse(System.data.Brainly.defaultConfig.user.ME);
				System.data.Brainly.defaultConfig.config = JSON.parse(matchSecondConfig[matchSecondConfig.length - 1]);
				System.data.Brainly.defaultConfig.config.data.ranksWithId = {};
				for (let i = 0, rank;
					(rank = System.data.Brainly.defaultConfig.config.data.ranks[i]); i++) {
					System.data.Brainly.defaultConfig.config.data.ranksWithId[rank.id] = {
						name: rank.name,
						color: rank.color,
						type: rank.type,
					};
				}
				window.defaultConfig = System.data.Brainly.defaultConfig;
				localStorage.setObject("__default_config", System.data.Brainly.defaultConfig);

				Request.get(matchAuthJSFile[matchAuthJSFile.length - 1], res1 => {
					let matchRoutes = res1.match(/(routes:.*scheme\:\"http\")/gmi);
					if (!matchRoutes || matchRoutes.length < 1) {
						Console.error("Routes not found", res1);
					} else {
						let _Routing = new Function(`return {${matchRoutes[matchRoutes.length - 1]}}`)();
						System.data.Brainly.Routing.prefix = _Routing.prefix;
						System.data.Brainly.Routing.routes = _Routing.routes;
						localStorage.setObject("_Routing", System.data.Brainly.Routing);
						callback && callback();
					}
				});
			}
		}

	});
}
let setBrainlyData = callback => {
	let localRouting = localStorage.getObject("_Routing");
	let __default_config = localStorage.getObject("__default_config");
	if (localRouting && __default_config) {
		System.data.Brainly.Routing = localRouting;
		window.defaultConfig = System.data.Brainly.defaultConfig = __default_config;
		callback && callback();
		if (document.head.innerHTML.match(/__default_config/gmi)) {
			processDefaultConfig()
		} else {
			getDefaultConfig();
		}
	} else if (document.head.innerHTML.match(/__default_config/gmi)) {
		processDefaultConfig(callback)
	} else {
		getDefaultConfig(callback);
	}

}
let getUserData = (callback, resetThemeColor) => {
	var url = "/api/28/api_users/me";
	var xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.onload = function() {
		var json = JSON.parse(xhr.responseText);
		if (xhr.readyState == 4 && xhr.status == "200") {
			if (json.success && json.success == true) {
				/*if (resetThemeColor) {
					json.data.themeColor = "#57b2f8";
					themeColorChanger(json.data.themeColor);
				}*/
				//System.data.Brainly.userData = json.data;
				Storage.set({ user: json.data }, function() {
					callback && callback({ user: json.data });
				});
			} else
				Console.log("User has not signed in yet");
		} else {
			Console.error(json);
		}
	}
	xhr.send(null);
}
let setUserData = (callback) => {
	WaitForFn("window.dataLayer", obj => {
		if (obj && obj[0] && obj[0].user && obj[0].user.isLoggedIn) {
			Storage.get(["user", "themeColor", "extendMessagesLayout"], res => {
				if (res && res.user && res.user.user && res.user.user.id && res.user.user.id == obj[0].user.id) {
					callback && callback(res);
					getUserData();
				} else {
					getUserData(callback, true);
				}
			});
		} else {
			Console.error("User data error. Maybe not logged in", obj);
		}
	});
};
let prepareDeleteButtonSettings = (callback) => {
	Storage.get("quickDeleteButtonsReasons", res => {
		if (res.quickDeleteButtonsReasons) {
			System.data.config.quickDeleteButtonsReasons = res.quickDeleteButtonsReasons;
			callback();
		} else {
			Storage.setL({
				quickDeleteButtonsReasons: System.data.config.marketConfig.quickDeleteButtonsDefaultReasons
			}, () => {
				System.data.config.quickDeleteButtonsReasons = System.data.config.marketConfig.quickDeleteButtonsDefaultReasons;
				callback();
			});
		}
	});
}
let prepareDeleteReasons = callback => {
	Storage.getL("deleteReasons", res => {
		if (res.deleteReasons) {
			System.data.Brainly.deleteReasons = res.deleteReasons;
			prepareDeleteButtonSettings(callback)
		} else {
			GetDeleteReasons(deleteReasons => {
				let deleteReasonsKeys = Object.keys(deleteReasons);
				deleteReasons.__withTitles = {};
				deleteReasonsKeys.forEach(reasonKey => {
					let reason = deleteReasons[reasonKey];
					deleteReasons.__withTitles[reasonKey] = {
						__categories: {}
					};
					reason.forEach(elm => {
						deleteReasons.__withTitles[reasonKey].__categories[elm.id] = elm;
						elm.subcategories.forEach(subcategory => {
							subcategory.category_id = elm.id;
							let title = subcategory.title == "" ? elm.text : subcategory.title;
							title = title.trim();
							deleteReasons.__withTitles[reasonKey][title] = subcategory;
						});
					});
				});
				Storage.setL({
					deleteReasons
				}, () => {
					System.data.Brainly.deleteReasons = deleteReasons;
					prepareDeleteButtonSettings(callback)
				});
			});
			/*GetDeleteReasons(deleteReasons => {
				Object.keys(deleteReasons).forEach(reasonTypeKey => {
					let categories = deleteReasons[reasonTypeKey];
					Console.log(categories);
					deleteReasons[reasonTypeKey] = {
						__withTitles : {
							__categories: {}
						},
						...categories
					};
					categories.forEach(category => {
						deleteReasons[reasonTypeKey].__withTitles.__categories[category.id] = category;
						category.subcategories.forEach(reason => {
							reason.category_id = category.id;
							let title = reason.title == "" ? category.text : reason.title;
							title = title.trim();
							deleteReasons[reasonTypeKey].__withTitles[title] = reason;
						});
						//delete category.subcategories;
					});
				});
				Console.log(deleteReasons);
				Storage.setL({
					deleteReasons
				}, () => {
					System.data.Brainly.deleteReasons.__withTitles = deleteReasons;
					prepareDeleteButtonSettings(callback)
				});
			});*/
			/*			GetDeleteReasons(deleteReasons => {
				Object.keys(deleteReasons).forEach(reasonKey => {
					let reason = deleteReasons[reasonKey];
					deleteReasons[reasonKey] = {
						__categories: {}
					};
					reason.forEach(elm => {
						deleteReasons[reasonKey].__categories[elm.id] = elm;
						elm.subcategories.forEach(subcategory => {
							subcategory.category_id = elm.id;
							let title = subcategory.title == "" ? elm.text : subcategory.title;
							title = title.trim();
							deleteReasons[reasonKey][title] = subcategory;
						});
						delete elm.subcategories;
					});
				});
				Storage.setL({
					deleteReasons
				}, () => {
					System.data.Brainly.deleteReasons.__withTitles = deleteReasons;
					prepareDeleteButtonSettings(callback)
				});
			});*/
		}
	});
}

setMetaData(() => {
	Console.log("MetaData OK!");
	setUserData((resUserData) => {
		Console.log("setUserData OK!");

		themeColorChanger(resUserData.themeColor || "#57b2f8");
		messagesLayoutExtender(resUserData.extendMessagesLayout || false);
		System.data.Brainly.userData = resUserData.user;

		setBrainlyData(() => {
			Console.log("setBrainlyData OK!");
			/*if (Sistem.depo.current_locale) {
				return Sistem.depo.current_locale;
			} else {
				let locale = window.__default_config;
				locale && (locale = locale.MARKET);
				//console.log("market: ", locale);
				!locale && (locale = document.head.querySelector('meta[name="market"]'), locale && (locale = locale.getAttribute("content")));
				//console.log("meta: ", locale);
				!locale && (locale = window.siteLocale, locale && (locale = locale.replace(/.*[-_]/, "")));
				//console.log("sitelocale: ", locale);
				Sistem.depo.current_locale = locale;
				return locale;
			}*/

			Inject2body(`/config/${location.hostname}.json`, configData => {
				System.data.config.marketConfig = configData;

				Inject2body(`/scripts/locales/${"en_US"||System.data.Brainly.defaultConfig.locale.LANGUAGE}/locale.json`, localeData => {
					System.data.locale = localeData;

					Console.info("Locale inject OK!");
					System.shareGatheredData2Background(() => {
						System.Auth((hash) => {
							Console.log("authProcess OK!");

							System.data.Brainly.userData._hash = hash;
							/**
							 * Wait for the declaration of the jQuery object
							 */
							WaitForFn("jQuery", obj => {
								if (obj) {
									Console.log("Jquery OK!");
									System.changeBadgeColor("loaded");
									renderUserFinder();
									renderAnnouncements();
									prepareDeleteReasons(() => {
										Console.log("Delete reasons OK!");
										if (System.checkRoute(1, "") || System.checkRoute(1, "task_subject_dynamic")) {
											Inject2body([
												"/scripts/lib/jquery-observe-2.0.3.min.js",
												"/scripts/views/1-Root/index.js",
												"/scripts/views/1-Root/Root.css"
											])
										}
										if (System.checkRoute(1, "task_view")) {
											Inject2body([
												"/scripts/lib/jquery-observe-2.0.3.min.js",
												"/scripts/views/3-Task/index.js",
												"/scripts/views/3-Task/Task.css"
											])
										}
										if (System.checkRoute(2, "user_content") && !System.checkRoute(4, "comments_tr")) {
											Inject2body([
												"/scripts/views/4-UserContent/index.js",
												System.data.Brainly.style_guide.css,
												"/scripts/views/4-UserContent/UserContent.css"
											])
										}
										if (System.checkRoute(2, "archive_mod")) {
											Inject2body([
												"/scripts/lib/jquery-observe-2.0.3.min.js",
												"/scripts/views/6-ArchiveMod/index.js",
												System.data.Brainly.style_guide.css,
												System.data.Brainly.style_guide.icons,
												"/scripts/views/6-ArchiveMod/ArchiveMod.css"
											])
										}
									});

									if (System.checkRoute(1, "messages")) {
										Inject2body([
											"/scripts/lib/jquery-observe-2.0.3.min.js",
											"/scripts/views/2-Messages/index.js",
											"/scripts/views/2-Messages/Messages.css"
										]);
									}
									if (System.checkRoute(1, "user_profile") || (System.checkRoute(1, "users") && System.checkRoute(2, "view"))) {
										Inject2body([
										"/scripts/views/5-UserProfile/index.js",
										System.data.Brainly.style_guide.css,
										"/scripts/views/5-UserProfile/UserProfile.css"
										]);
									}
									if (System.checkRoute(2, "view_user_warns")) {
										Inject2body([
										"/scripts/views/7-UserWarnings/index.js",
										System.data.Brainly.style_guide.css,
										"/scripts/views/7-UserWarnings/UserWarnings.css"
										]);
									}
								}
							});
						});
					});
				});
			});
		});
	});
});
