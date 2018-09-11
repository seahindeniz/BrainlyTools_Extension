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

let System = new _System();
window.System = System;

System.init();

/**
 * Preventing the _console method preventer
 */
window._console = console;
/*let _loop_console_expire = MakeExpire();
let _loop_console = setInterval(() => {
	if (_loop_console_expire < new Date().getTime()) {
		clearInterval(_loop_console);
	}
	console = _console;
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
			System.shareGatheredData2Background(() => {
				var evtSharingDone = new Event("shareGatheredData2BackgroundDone", { "bubbles": true, "cancelable": false });
				document.dispatchEvent(evtSharingDone);
			});
		}
	});
}
let processDefaultConfig = (callback) => {
	WaitForFn("Routing", obj => {
		if (obj && obj.b && obj.b.prefix && obj.d && obj.d.c) {
			System.data.Brainly.defaultConfig = window.__default_config;
			System.data.Brainly.defaultConfig.user.ME = JSON.parse(System.data.Brainly.defaultConfig.user.ME);
			System.data.Brainly.Routing.prefix = obj.b.prefix;
			System.data.Brainly.Routing.routes = obj.d.c;
			localStorage.setObject("_Routing", System.data.Brainly.Routing);
			callback && callback();
		} else {
			_console.log("Routing error", obj);
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
				_console.error("Config object not found");
			} else if (!matchSecondConfig || matchSecondConfig.length < 2) {
				_console.error("Second config object not found");
			} else if (!matchAuthJSFile || matchAuthJSFile.length < 1) {
				_console.error("Auth JS file not found");
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

				Request.get(matchAuthJSFile[matchAuthJSFile.length - 1], res1 => {
					let matchRoutes = res1.match(/(routes:.*scheme\:\"http\")/gmi);
					if (!matchRoutes || matchRoutes.length < 1) {
						_console.error("Routes not found", res1);
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
	if (localRouting) {
		System.data.Brainly.Routing = localRouting;
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
				_console.log("User has not signed in yet");
		} else {
			_console.error(json);
		}
	}
	xhr.send(null);
}
let setUserData = (callback) => {
	WaitForFn("window.dataLayer", obj => {
		if (obj && obj[0] && obj[0].user && obj[0].user.isLoggedIn) {
			_console.log("request user data from storage");
			Storage.get(["user", "themeColor", "extendMessagesLayout"], res => {
				_console.log("storageUser: ", res);
				if (res && res.user && res.user.user && res.user.user.id && res.user.user.id == obj[0].user.id) {
					callback && callback(res);
					getUserData();
				} else {
					getUserData(callback, true);
				}
			});
		} else {
			_console.error("User data error. Maybe not logged in", obj);
		}
	});
};
let prepareDeleteButtonSettings = (callback) => {
	Storage.get("quickDeleteButtonsReasons", res => {
		_console.log("quickDeleteButtonsReasons:", res);
		if (res.quickDeleteButtonsReasons) {
			System.data.config.quickDeleteButtonsReasons = res.quickDeleteButtonsReasons;
			callback();
		} else {
			Storage.setL({
				quickDeleteButtonsReasons: System.data.locale.config.quickDeleteButtonsDefaultReasons
			}, () => {
				System.data.config.quickDeleteButtonsReasons = System.data.locale.config.quickDeleteButtonsDefaultReasons
				_console.log("quickDeleteButtonsReasons:", System.data.config.quickDeleteButtonsReasons);
				callback();
			});
		}
	});
}
let prepareDeleteReasons = callback => {
	_console.log("Prepare delete reasons");
	Storage.getL("deleteReasons", res => {
		_console.log(res);
		if (res.deleteReasons) {
			System.data.Brainly.deleteReasons = res.deleteReasons;
			prepareDeleteButtonSettings(callback)
		} else {
			System.getDeleteReasons(deleteReasons => {
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
					System.data.Brainly.deleteReasons = deleteReasons;
					prepareDeleteButtonSettings(callback)
				});
			});
		}
	});
}
let onEventHandler = e => {
	System.shareGatheredData2Background(() => {
		ext.runtime.sendMessage(System.data.meta.extension.id, { action: "shareGatheredData2Background" }, res => {});
	});
}
window.addEventListener('shareGatheredData2Background', onEventHandler);
setMetaData(() => {
	_console.log("MetaData OK!");
	setUserData((resUserData) => {
		_console.log("setUserData OK!");

		themeColorChanger(resUserData.themeColor || "#57b2f8");
		messagesLayoutExtender(resUserData.extendMessagesLayout || false);
		System.data.Brainly.userData = resUserData.user;

		setBrainlyData(() => {
			_console.log("setBrainlyData OK!");
			Inject2body(`/scripts/locales/${System.data.Brainly.userData.user.iso_locale}/locale.js`, () => {
				_console.log("inject locale OK!");
				_console.log(System.data.locale);
				System.Auth((hash) => {
					_console.log("authProcess OK!");

					System.data.Brainly.userData._hash = hash;
					/**
					 * Wait for the declaration of the jQuery object
					 */
					WaitForFn("jQuery", obj => {
						if (obj) {
							_console.log("Jquery OK!");
							//System.shareGatheredData2Background();

							renderUserFinder();
							prepareDeleteReasons(() => {
								_console.log("Delete reasons OK!");
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
										"/scripts/views/4-UserContent/UserContent.css"
									])
								}
							});

							if (System.checkRoute(1, "messages")) {
								Inject2body([
									"/scripts/views/2-Messages/index.js",
									"/scripts/views/2-Messages/Messages.css"
								]);

							}
						}
					});
				});
			});
		});
	});
});
