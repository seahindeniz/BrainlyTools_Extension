"use strict";

import ext from "./utils/ext";
import _System from "./controllers/System";
import storage from "./utils/storage";
import marketKeyFn from "./helpers/marketKey";
import BrainlyNotificationSocket from "./controllers/BrainlyNotificationSocket";

const BROWSER_ACTION = ext.browserAction;
const RED_BADGE_COLOR = [255, 121, 107, 255];
const __c = `font-size: 14px;color: #57b2f8;font-family:century gothic;`;

class Background {
	constructor() {
		this.popupOpened = null;
		this.blockedDomains = /mc.yandex.ru|hotjar.com|google(-analytics|tagmanager|adservices|tagservices).com|kissmetrics.com|doubleclick.net|ravenjs.com/i;

		this.manifest = ext.runtime.getManifest();

		BROWSER_ACTION.disable();

		this.InitSystem();
		this.BindListeners();
	}
	InitSystem() {
		window.System = new _System();
	}
	BindListeners() {
		ext.runtime.onMessage.addListener(this.MessageRequestHandler.bind(this));
		ext.runtime.onMessageExternal.addListener(this.MessageRequestHandler.bind(this));
		chrome.windows.onRemoved.addListener(this.RemovedWindowHandler.bind(this));
		//ext.tabs.onCreated.addListener(tabCreated);
		ext.tabs.onUpdated.addListener(this.TabUpdatedHandler.bind(this));
		ext.tabs.onRemoved.addListener(this.TabRemovedHandler.bind(this));
		ext.tabs.onActivated.addListener(this.TabActivatedHandler.bind(this));
		//ext.tabs.getSelected(null, tabCreated);

		ext.webRequest.onBeforeRequest.addListener(({ url }) => ({ cancel: this.blockedDomains.test(url) }), { urls: ["<all_urls>"] }, ["blocking"]);
	}
	async MessageRequestHandler(request, sender) {
		if (request.action == "storage") {
			return storage[request.method]({
				...request
			});
		}
		if (request.action === "setMarketData") {
			try {
				System.data = request.data;

				return true;
			} catch (error) {
				return error;
			}
		}
		if (request.action === "getMarketData") {
			//await System.delay(500);

			return new Promise(resolve => { resolve(System.data) });
		}
		if (request.action === "enableExtensionIcon") {
			BROWSER_ACTION.enable(sender.tab.id);

			return true;
		}
		if (request.action === "changeBadgeColor") {
			let color = [0, 0, 0, 0];

			if (request.data === "loading") {
				color = [254, 200, 60, 255]
			}

			if (request.data === "loaded") {
				color = [83, 207, 146, 255];

				BROWSER_ACTION.enable();
			}

			this.UpdateBadge({
				id: sender.tab.id,
				text: " ",
				color
			});

			return true;
		}
		if (request.action === "xmlHttpRequest") {
			let ajaxData = {
				method: request.method,
				url: System.data.config.extension.serverAPIURL + request.path,
				headers: request.headers
			};

			if (request.data) {
				ajaxData.data = request.data;
				ajaxData.dataType = "json";
			}

			return $.ajax(ajaxData);
		}
		if (request.action === "updateExtension") {
			return this.CheckUpdate();
		}
		if (request.action === "openCaptchaPopup") {
			if (!this.popupOpened) {
				this.CreateWindow({
					url: request.data,
					type: "popup",
					width: 500,
					height: 388
				});

				return true;
			}
		}
		if (request.action === "notifierInit") {
			let isActive = await storage.get({
				marketKey: marketKeyFn(),
				data: "notifier"
			});

			BrainlyNotificationSocket(isActive);
		}
		if (request.action === "notifierChangeState") {
			BrainlyNotificationSocket(request.data);
		}
		if (request.action === "background>Inject content script anyway") {
			console.log("contenscript injection started");
			this.InjectContentScript(request.data, true);

			return Promise.resolve(true);
		}
	}
	UpdateBadge(options) {
		BROWSER_ACTION.setBadgeText({
			text: options.text
		});

		if (options.color) {
			BROWSER_ACTION.setBadgeBackgroundColor({
				color: options.color
			});
		}
	}
	async CheckUpdate() {
		let status = await ext.runtime.requestUpdateCheck();

		if (status == "update_available") {
			ext.runtime.reload();
		}

		return status;
	}
	async CreateWindow(data) {
		let detail = await ext.windows.create(data);
		this.popupOpened = detail.id;
	}
	RemovedWindowHandler(windowId) {
		if (windowId == this.popupOpened) {
			this.popupOpened = null;
		}
	}
	TabUpdatedHandler(tabId, changeInfo, tab) {
		if (changeInfo.status == "loading") {
			this.ManipulateTab(tab);
		}
	}
	async TabActivatedHandler(activeInfo) {
		let tab = await ext.tabs.get(activeInfo.tabId);

		this.ManipulateTab(tab);
	}
	async TabRemovedHandler(tabId) {
		let tabs = await ext.tabs.query({});
		let brailnyTabs = tabs.filter(tab => System.constants.Brainly.regexp_BrainlyMarkets.test(tab.url));

		if (brailnyTabs.length == 0) {
			this.UpdateBadge({
				text: "",
				color: ""
			});
			BROWSER_ACTION.disable();
		}
	}
	async ManipulateTab(tab) {
		if (tab.url && this.IsBrainlyTab(tab.url)) {
			let tabId = tab.id;

			this.InjectContentScript(tabId);
			let badgeColor = await ext.browserAction.getBadgeBackgroundColor({ tabId });

			if (badgeColor.every((v, i) => v !== RED_BADGE_COLOR[i])) {
				this.UpdateBadge({
					text: " ",
					color: RED_BADGE_COLOR
				});
			}
		}
	}
	IsBrainlyTab(_url) {
		let url = new URL(_url);
		let itIs = System.constants.Brainly.regexp_BrainlyMarkets.test(url.origin);

		return itIs;
	}
	async InjectContentScript(tabId, forceInject) {
		if (!forceInject) {
			await this.CheckThePageWhetherInjected(tabId);
		}

		await chrome.tabs.executeScript(tabId, {
			file: "scripts/contentscript.js",
			runAt: "document_start",
			allFrames: true
		});

		console.info("Content script injected OK!");
		console.info(`%c${this.manifest.short_name}: Initilazing > ${tabId}`, __c);
	}
	CheckThePageWhetherInjected(tabId) {
		return new Promise(async (resolve) => {
			/**
			 * Scenarios:
			 * If contentscript hasn't injected to specified tab, sending a message will return {message: "Could not establish connection. Receiving end does not exist."}
			 * ...this means page is can be injected so the promise can be resolved.
			 *
			 * If contentscript is already injected, that means no need to inject again. Therefore we don't have to wait for success return from contentscript.
			 */
			try {
				await ext.tabs.sendMessage(tabId, { action: "contentscript>Check if content script injected" });
			} catch (_) {
				resolve()
			}
		});
	}
}

new Background();
