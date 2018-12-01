"use strict"

import ext from "../scripts/utils/ext";
import Storage from "../scripts/helpers/extStorage";
import render from "./views/Body";
import _System from "../scripts/controllers/System";

let System = new _System();
window.System = System;
window.isPageBusy = false;

window.onbeforeunload = function() {
	if (window.isPageBusy) {
		return System.data.locale.common.notificationMessages.ongoingProcess;
	}
}

$(() => {
	var messageDone = () => {
		messageDone = () => {};
		ext.runtime.sendMessage({ action: "getMarketData" }, function(marketData) {
			//console.log(res);
			if (!marketData) {
				render("status", { type: "danger", title: "Error 417", text: `I can't fetch market data` });

				return false;
			}

			System.data = marketData;

			Storage.get(["user", "themeColor", "quickDeleteButtonsReasons", "extendMessagesBody"], res => {
				//console.log("storageUser: ", res);
				if (!(res && res.user && res.user.user && res.user.user.id && res.user.user.id == res.user.user.id)) {
					render("status", { type: "danger", title: "Error 417", text: `I'm unable to fetch your data from Brainly<br><br>Please go to Brainly's homepage or reload the page` });
				} else if (!System.data.Brainly.deleteReasons.__withIds) {
					render("status", { type: "danger", title: "Error 416", text: "An error accoured while preparing the delete reasons and fetching from Brainly" });
				} else {
					render("layout", res);
				}
			});

		});
	}

	render("status", { type: "primary", title: `Please wait..` });
	ext.tabs.query({}, function(tabs) {
		for (var i = 0, tab; tab = tabs[i]; ++i) {
			if (System.regexp_BrainlyMarkets.test(tab.url)) {
				var message = { action: "shareGatheredData2Background", url: tab.url };
				ext.tabs.sendMessage(tab.id, message, res => {
					messageDone();
				});
			}
		}
	});
});
