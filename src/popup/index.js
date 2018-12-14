"use strict"

import ext from "../scripts/utils/1.ext";
import Storage from "../scripts/helpers/extStorage";
import _System from "../scripts/controllers/System";
import Popup from "./controllers/Popup";

let System = new _System();
window.System = System;
window.isPageBusy = false;

window.onbeforeunload = function() {
	if (window.isPageBusy) {
		return System.data.locale.common.notificationMessages.ongoingProcess;
	}
}

$(onBodyLoad);

async function onBodyLoad() {
	window.popup = new Popup();


	let messageDone = async () => {
		messageDone = $.noop;

		let marketData = await ext.runtime.sendMessage({ action: "getMarketData" });
		if (!marketData) {
			return popup.RenderStatusMessage({
				type: "danger",
				title: "Error 417",
				message: `I can't fetch market data`
			});
		}

		System.data = marketData;
		System.data.Brainly.userData.user.fixedAvatar = System.data.Brainly.userData.user.avatars[100] || `https://${System.data.meta.marketName}/img/avatars/100-ON.png`;

		Storage.get(["user", "themeColor", "quickDeleteButtonsReasons", "extendMessagesBody", "extendMessagesLayout", "notifier", "language"], storageData => {
			//console.log("storageData: ", storageData);
			if (!(storageData && storageData.user && storageData.user.user && storageData.user.user.id && storageData.user.user.id == storageData.user.user.id)) {
				popup.RenderStatusMessage({
					type: "danger",
					title: "Error 417",
					message: `I'm unable to fetch your data from Brainly<br><br>Please go to Brainly's homepage or reload the page`
				});
			} else if (!System.data.Brainly.deleteReasons.__withIds) {
				popup.RenderStatusMessage({
					type: "danger",
					title: "Error 416",
					message: `An error accoured while preparing the delete reasons and fetching from Brainly`
				});
			} else {
				popup.storageData = storageData;
				popup.RenderMainUI();
			}
		});
	}

	popup.RenderStatusMessage({ title: `Please wait..` });

	let tabs = await ext.tabs.query({});

	if (tabs && tabs.length > 0) {
		for (var i = 0, tab; tab = tabs[i]; ++i) {
			if (System.regexp_BrainlyMarkets.test(tab.url)) {
				var message = { action: "shareGatheredData2Background", url: tab.url };

				await ext.tabs.sendMessage(tab.id, message);
				messageDone();
			}
		}
	}
}
