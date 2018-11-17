"use strict";

import ext from "./utils/ext";
import _System from "./controllers/System";
import Storage from "./utils/storage";
import marketKeyFn from "./helpers/marketKey";
import BrainlyNotificationSocket from "./controllers/BrainlyNotificationSocket";

/*storageS.set({ color: "#f00" }, function () {
});
storageS.get('color', function (res) {
	console.log('color',res)
});
storageS.remove('color');
storageS.get('color', function (res) {
	console.log('color',res)
});
*/
const __c = `font-size: 14px;color: #57b2f8;font-family:century gothic;`;
//let marketData = null;
const manifest = chrome.runtime.getManifest();
let browserAction = ext.browserAction;

let System = new _System();
window.System = System;

System.init();

let badge_update = opt => {
	browserAction.setBadgeText({
		//tabId: opt.id,
		text: opt.text
	});
	browserAction.setBadgeBackgroundColor({
		//tabId: opt.id,
		color: opt.color
	});
};
browserAction.disable();
let popupOpened = false;

const onRequest = function(request, sender, sendResponse) {
	if (request.action == "i18n") {
		sendResponse(ext.i18n.getMessage(request.data));
	}
	if (request.action == "storageSet") {
		Storage.set({
			...request,
			callback: sendResponse
		});

		return true;
	}
	if (request.action == "storageGet") {
		Storage.get({
			...request,
			callback: sendResponse
		});

		return true;
	}
	if (request.action == "storageRemove") {
		Storage.remove({
			...request,
			callback: sendResponse
		});

		return true;
	}
	if (request.action == "storageSetL") {
		Storage.set({
			local: true,
			...request,
			callback: sendResponse
		});

		return true;
	}
	if (request.action == "storageGetL") {
		Storage.get({
			local: true,
			...request,
			callback: sendResponse
		});

		return true;
	}
	if (request.action == "storageRemoveL") {
		Storage.remove({
			local: true,
			...request,
			callback: sendResponse
		});
		return true;
	}
	if (request.action === "setMarketData") {
		if (request.data) {
			System.data = request.data;
			sendResponse("done");
		} else {
			sendResponse();
		}
	}
	if (request.action === "getMarketData") {
		setTimeout(() => {
			sendResponse(System.data);
		}, 500);
		return true;
	}
	if (request.action === "enableExtensionIcon") {
		browserAction.enable(sender.tab.id);
	}
	if (request.action === "changeBadgeColor") {
		let color = [0, 0, 0, 0];
		if (request.data === "loading") {
			color = [254, 200, 60, 255]
		}
		if (request.data === "loaded") {
			color = [83, 207, 146, 255]
			browserAction.enable();
		}
		badge_update({
			id: sender.tab.id,
			text: " ",
			color: color
		});
	}
	if (request.action === "xmlHttpRequest") {
		let ajaxData = {
			method: request.method,
			url: System.data.config.extension.serverAPIURL + request.path,
			headers: request.headers,
			success: res => {
				sendResponse(res)
			}
		};

		if (request.data) {
			ajaxData.data = request.data;
			ajaxData.dataType = "json";
		}

		$.ajax(ajaxData).fail(function(err) {
			sendResponse(false, err);
		});

		return true;
	}
	if (request.action === "updateExtension") {
		ext.runtime.requestUpdateCheck(function(status) {
			sendResponse(status);

			if (status == "update_available") {
				ext.runtime.reload();
			}
		});

		return true;
	}
	if (request.action === "openCaptchaPopup") {
		let currentWindowID = null;
		if (!popupOpened) {
			popupOpened = true;
			ext.windows.create({
				url: request.data,
				type: "popup",
				width: 500,
				height: 388
			}, detail => {
				currentWindowID = detail.id;
			});
			chrome.windows.onRemoved.addListener(windowId => {
				if (windowId == currentWindowID) {
					popupOpened = false;
					sendResponse("true");
				}
			});

			return true;
		}
	}
	if (request.action === "notifierInit") {
		Storage.get({
			marketKey: marketKeyFn(),
			data: "notifier",
			callback: isActive => {
				console.log("notifierInit:", isActive);
				BrainlyNotificationSocket(isActive);
			}
		});
	}
	if (request.action === "notifierChangeState") {
		BrainlyNotificationSocket(request.data);
		/* console.log(System.data.meta.marketName);
		console.log(System.data.Brainly.defaultConfig.comet.AUTH_HASH);
		console.log(request.data); */
		/* Storage.set({
			marketKey: System.data.meta.marketName,
			data: { notifier: request.data },
			callback: res => {
				console.log("notifierChangeState:", res);
			}
		}); */
	}
}
ext.runtime.onMessage.addListener(onRequest);
ext.runtime.onMessageExternal.addListener(onRequest);

let brainlyURI_regexp = /:\/\/(?:www\.)?((?:eodev|znanija)\.com|zadane\.pl|nosdevoirs\.fr|brainly(?:(?:\-thailand\.com)|(?:\.(?:com+(?:\.br|\.ng|)|co\.(?:id|za)|lat|in|my|ph|ro))))/i;
let blockedDomains = /mc.yandex.ru|hotjar.com|google(-analytics|tagmanager|eadservices).com|kissmetrics.com|doubleclick.net|ravenjs.com/i;

let blockRequest = req => {
	return {
		cancel: blockedDomains.test(req.url)
	};
};
let blocking_init = () => {
	if (ext.webRequest.onBeforeRequest.hasListener(blockRequest)) {
		ext.webRequest.onBeforeRequest.removeListener(blockRequest);
	}
	ext.webRequest.onBeforeRequest.addListener(blockRequest, {
		urls: ["<all_urls>"]
	}, ["blocking"]);
};
let get_brainly_from_tabs = (tabs, callback) => {
	let result = null;
	let len = tabs.length;
	if (len > 0) {
		for (let i = 0, tab;
			(tab = tabs[i]); i++) {
			if (tab.url) {
				let url = new URL(tab.url);
				let match_it = brainlyURI_regexp.test(url.host);
				match_it && (result = tab, callback && callback(tab));
			}
		}
	} else if (!len && typeof tabs === "object") {
		if (tabs.url) {
			let url = new URL(tabs.url);
			let match_it = brainlyURI_regexp.test(url.origin);
			match_it && (result = tabs, callback && callback(tabs));
		}
	}
	return result;
};
let redBadgeColor = [255, 121, 107, 255];
let tabCreated = tabs => {
	get_brainly_from_tabs(tabs, tab => {
		console.log(tab);
		blocking_init();
		chrome.browserAction.getBadgeBackgroundColor({ tabId: tab.id }, (badgeColor) => {
			if (badgeColor.every((v, i) => v !== redBadgeColor[i])) {
				badge_update({
					id: tab.id,
					text: " ",
					color: [255, 121, 107, 255]
				});
			}
		});
		console.info(`%c${manifest.short_name} > Initilazing`, __c);
	});
};
/*ext.tabs.query({
	active: true,
	currentWindow: true
}, function () {
	console.log(this);
});*/
//ext.tabs.onCreated.addListener(tabCreated);
ext.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	//console.log("this:", tabId, changeInfo, tab);
	if (changeInfo.status == "loading")
		tabCreated(tab);
});
ext.tabs.onActivated.addListener(activeInfo => {
	ext.tabs.get(activeInfo.tabId, tabCreated);
});

//ext.tabs.getSelected(null, tabCreated);
