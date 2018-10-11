"use strict";

import ext from "./utils/ext";
import _System from "./controllers/System";
import { storageS, storageL } from "./utils/storage";

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

const onRequest = function(request, sender, sendResponse) {
	if (request.action == "i18n") {
		sendResponse(ext.i18n.getMessage(request.data));
	}
	if (request.action == "storageSet") {
		storageS.get(request.marketKey, res => {
			let data = {};
			data[request.marketKey] = { ...res[request.marketKey], ...request.data };

			storageS.set(data, res => {
				sendResponse("true");
			});
		});
		return true;
	}
	if (request.action == "storageGet") {
		storageS.get(request.marketKey, res => {
			let _res = {};
			if (Object.prototype.toString.call(request.data) === "[object Array]") {
				for (let i = 0, obj;
					(obj = request.data[i]); i++) {
					if (res[request.marketKey])
						_res[obj] = res[request.marketKey][obj];
				}
			} else if (typeof request.data === "string") {
				if (res[request.marketKey])
					_res = res[request.marketKey][request.data];
			}
			sendResponse(_res);
		});
		return true;
	}
	if (request.action == "storageRemove") {
		storageS.remove(request.data, res => {
			sendResponse(res);
		});
		return true;
	}
	if (request.action == "storageSetL") {
		storageL.get(request.marketKey, res => {
			let data = {};
			data[request.marketKey] = { ...res[request.marketKey], ...request.data };

			storageL.set(data, res => {
				sendResponse("true");
			});
		});
		return true;
	}
	if (request.action == "storageGetL") {
		storageL.get(request.marketKey, res => {
			let _res = {};

			if (Object.prototype.toString.call(request.data) === "[object Array]") {
				for (let i = 0, obj;
					(obj = request.data[i]); i++) {
					if (res[request.marketKey])
						_res[obj] = res[request.marketKey][obj];
				}
			} else if (typeof request.data === "string") {
				if (res[request.marketKey]) {
					_res = res[request.marketKey][request.data];
				}
			}
			sendResponse(_res);
		});
		return true;
	}
	if (request.action == "storageRemoveL") {
		storageL.remove(request.data, res => {
			sendResponse(res);
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
		if (request.status === "loading") {
			color = [254, 200, 60, 255]
		}
		if (request.status === "loaded") {
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
		$.ajax({
			method: request.method,
			//type: "POST",
			url: System.data.config.extensionServerAPIURL + request.path,
			headers: request.headers,
			//async: true,
			dataType: "json",
			data: request.data,
			success: res => {
				sendResponse(res)
			}
		}).fail(function(err) {
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
