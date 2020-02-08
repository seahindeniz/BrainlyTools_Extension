import ext from "./utils/ext";
import _System from "./controllers/System";
import storage from "./utils/storage";
import NotifierSocket from "./controllers/NotifierSocket";

// @ts-ignore
let chrome = window.chrome;

const BROWSER_ACTION = ext.browserAction;
const RED_BADGE_COLOR = [255, 121, 107, 255];

class Background {
  constructor() {
    this.markets = {};
    this.activeSessions = {};
    this.popupOpened = null;
    this.optionsPassedParameters = {};
    this.blockedDomains =
      /mc\.yandex\.ru|hotjar\.com|google(-analytics|tagmanager|adservices|tagservices)\.com|kissmetrics\.com|doubleclick\.net|ravenjs\.com|browser\.sentry-cdn\.com/i;

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
    ext.runtime.onMessageExternal.addListener(this.MessageRequestHandler.bind(
      this));
    chrome.windows.onRemoved.addListener(this.RemovedWindowHandler.bind(
      this));
    //ext.tabs.onCreated.addListener(tabCreated);
    ext.tabs.onUpdated.addListener(this.TabUpdatedHandler.bind(this));
    ext.tabs.onRemoved.addListener(this.TabRemovedHandler.bind(this));
    ext.tabs.onActivated.addListener(this.TabActivatedHandler.bind(this));
    //ext.tabs.getSelected(null, tabCreated);

    ext.webRequest.onBeforeRequest.addListener(({ url, initiator }) => {
      return {
        cancel: this.IsBrainly(initiator) && this.blockedDomains.test(
          url)
      };
    }, { urls: ["<all_urls>"] }, ["blocking"]);
  }
  async MessageRequestHandler(request, sender) {
    //console.log("bg:", request);
    if (request.marketName) {
      let market = this.markets[request.marketName];

      if (request.action === "setMarketData") {
        try {
          this.InitMarket(request.data);

          return true;
        } catch (error) {
          return error;
        }
      }
      if (request.action === "getMarketData") {
        return Promise.resolve(market);
      }
      if (request.action == "storage") {
        return storage[request.data.method]({ ...request.data });
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

        if (request.data === "error") {
          color = RED_BADGE_COLOR;
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
          type: request.data.method,
          method: request.data.method,
          url: market.config.extension.serverAPIURL + request.data.path,
          headers: request.data.headers
        };

        if (request.data.data) {
          ajaxData.data = request.data.data;
          ajaxData.dataType = "json";
          ajaxData.contentType = "application/json; charset=utf-8";
        }

        return $.ajax(ajaxData);
      }
      if (request.action === "updateExtension")
        return this.CheckUpdate();

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
        this.BrainlyNotificationSocket(market, request.data);
      }
      if (request.action === "notifierChangeState") {
        this.BrainlyNotificationSocket(request.data);
      }
      if (request.action === "background>Inject content script anyway") {
        this.InjectContentScript(request.data, true);

        return Promise.resolve(true);
      }
      if (request.action === "OpenExtensionOptions") {

        ext.runtime.openOptionsPage();

        this.optionsPassedParameters[request.marketName] = {
          ...this.optionsPassedParameters[request.marketName],
          ...request.data
        };

        return Promise.resolve(true);
      }
      if (request.action === "INeedParameters") {
        let promise = Promise.resolve(this.optionsPassedParameters[request
          .marketName]);
        this.optionsPassedParameters[request.marketName] = {};

        return promise;
      }
    }
  }
  InitMarket(data) {
    let name = data.meta.marketName;
    this.markets[name] = data;
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
    System.Log("update started");
    let status = await ext.runtime.requestUpdateCheck();

    console.log(status);
    if (status[0] == "update_available")
      ext.runtime.reload();

    chrome.storage.local.clear();

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
    let brailnyTabs = tabs.filter(tab => System.constants.Brainly
      .regexp_BrainlyMarkets.test(tab.url));

    if (brailnyTabs.length == 0) {
      this.UpdateBadge({
        text: "",
        color: ""
      });
      BROWSER_ACTION.disable();
    }
  }
  async ManipulateTab(tab) {
    if (tab.url && this.IsBrainly(tab.url)) {
      let tabId = tab.id;

      this.InjectContentScript(tabId);
      let badgeColor = await ext.browserAction
        .getBadgeBackgroundColor({ tabId });

      if (badgeColor.every((v, i) => v !== RED_BADGE_COLOR[i])) {
        this.UpdateBadge({
          text: " ",
          color: RED_BADGE_COLOR
        });
      }
    }
  }
  IsBrainly(_url) {
    if (!_url)
      return false;

    let url = new URL(_url);
    let index = System.constants.Brainly.brainlyMarkets.indexOf(url.hostname);

    return index >= 0;
  }
  async InjectContentScript(tabId, forceInject) {
    if (!forceInject) {
      await this.CheckThePageWhetherInjected(tabId);
    }

    await chrome.tabs.executeScript(tabId, {
      file: "scripts/contentScript.js",
      runAt: "document_start",
      allFrames: true
    });

    System.Log("Content script injected OK!");
    System.Log(`%c${this.manifest.short_name}: Initilazing > ${tabId}`);
  }
  CheckThePageWhetherInjected(tabId) {
    return new Promise(async (resolve) => {
      /**
       * Scenarios:
       * If contentScript hasn't injected to specified tab, sending a message will return {message: "Could not establish connection. Receiving end does not exist."}
       * ...this means page is can be injected so the promise can be resolved.
       *
       * If contentScript is already injected, that means no need to inject again. Therefore we don't have to wait for success return from contentScript.
       */
      try {
        await ext.tabs.sendMessage(
          tabId, { action: "contentScript>Check if content script injected" }
        );
      } catch (_) {
        resolve()
      }
    });
  }
  BrainlyNotificationSocket(market, isActive) {
    if (false)
      if (isActive === null || isActive) {
        let activeSession = this.activeSessions[market.meta.marketName];
        let config = market.Brainly.defaultConfig;
        let authHash = config.comet.AUTH_HASH || config.user.ME.auth.comet
          .authHash;

        if (!activeSession || activeSession.authHash != authHash) {
          this.activeSessions[market.meta.marketName] = new NotifierSocket(
            market);
        }
      }
  }
}

new Background();
