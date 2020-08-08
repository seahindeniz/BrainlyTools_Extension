import _System from "@root/scripts/controllers/System";
import storage from "@root/scripts/utils/storage";
import IsBrainly from "./helpers/IsBrainly";
import ext from "./utils/ext";

// const { chrome } = window;
const BROWSER_ACTION = ext.browserAction;
const RED_BADGE_COLOR: browser.browserAction.ColorValue = [255, 121, 107, 255];

function InitSystem() {
  window.System = new _System();
}

function UpdateBadge(options: {
  id?: number;
  text: string;
  color: browser.browserAction.ColorValue;
}) {
  BROWSER_ACTION.setBadgeText({
    text: options.text,
  });

  if (options.color) {
    BROWSER_ACTION.setBadgeBackgroundColor({
      color: options.color,
    });
  }
}

async function TabRemovedHandler() {
  const tabs = await ext.tabs.query({});
  const brainlyTabs = tabs.filter(tab =>
    System.constants.Brainly.regexp_BrainlyMarkets.test(tab.url),
  );

  if (brainlyTabs.length === 0) {
    UpdateBadge({
      text: "",
      color: "",
    });
    BROWSER_ACTION.disable();
  }
}

async function CheckUpdate() {
  System.Log("Update started");
  const status = await ext.runtime.requestUpdateCheck();

  if (status[0] === "update_available") ext.runtime.reload();
  else console.warn(status);

  chrome.storage.local.clear();

  return status;
}

async function IsTabHasContentScript(tab: browser.tabs.Tab) {
  let status = false;
  /**
   * Scenarios:
   * If contentScript hasn't injected to specified tab, sending a message will return {message: "Could not establish connection. Receiving end does not exist."}
   * ...this means page is can be injected so the promise can be resolved.
   *
   * If contentScript is already injected, that means no need to inject again. Therefore we don't have to wait for success return from contentScript.
   */
  try {
    status = await ext.tabs.sendMessage(tab.id, {
      action: "contentScript>Check if content script injected",
    });
  } catch (_) {
    //
  }

  return status;
}

type ObjectAnyType = {
  [x: string]: any;
};

class Background {
  markets: ObjectAnyType;
  activeSessions: ObjectAnyType;
  popupOpened: number;
  optionsPassedParameters: ObjectAnyType;
  blockedDomains: RegExp;
  manifest: browser._manifest.WebExtensionManifest;

  constructor() {
    this.markets = {};
    this.activeSessions = {};
    this.popupOpened = null;
    this.optionsPassedParameters = {};
    this.blockedDomains = /mc\.yandex\.ru|hotjar\.com|google(-analytics|tagmanager|adservices|tagservices)\.com|kissmetrics\.com|doubleclick\.net|ravenjs\.com|browser\.sentry-cdn\.com|datadome\.co/i;

    this.manifest = ext.runtime.getManifest();

    BROWSER_ACTION.disable();

    InitSystem();
    this.BindListeners();
  }

  BindListeners() {
    ext.runtime.onMessage.addListener(this.MessageRequestHandler.bind(this));
    ext.runtime.onMessageExternal.addListener(
      this.MessageRequestHandler.bind(this),
    );

    ext.windows.onRemoved.addListener(this.RemovedWindowHandler.bind(this));

    ext.tabs.onUpdated.addListener(this.TabUpdatedHandler.bind(this));
    ext.tabs.onRemoved.addListener(TabRemovedHandler);
    ext.tabs.onActivated.addListener(this.TabActivatedHandler.bind(this));
    // ext.tabs.getSelected(null, tabCreated);
    // ext.tabs.onCreated.addListener(tabCreated);

    if (ext.webRequest)
      ext.webRequest.onBeforeRequest.addListener(
        // @ts-ignore
        ({ url, initiator }) => {
          return {
            cancel: IsBrainly(initiator) && this.blockedDomains.test(url),
          };
        },
        { urls: ["<all_urls>"] },
        ["blocking"],
      );
  }

  /**
   * @param {browser.tabs.Tab & {[x: string]: *}} request
   * @param {{ tab: { id: number; }; }} sender
   */
  async MessageRequestHandler(
    request: browser.tabs.Tab & { [x: string]: any },
    sender: { tab: { id: number } },
  ) {
    // console.log("bg:", request);
    if (request.marketName) {
      const market = this.markets[request.marketName];

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
      if (request.action === "storage") {
        return storage[request.data.method]({ ...request.data });
      }
      if (request.action === "enableExtensionIcon") {
        BROWSER_ACTION.enable(sender.tab.id);

        return true;
      }
      if (request.action === "changeBadgeColor") {
        /**
         * @type {browser.browserAction.ColorValue}
         */
        let color: browser.browserAction.ColorValue = [0, 0, 0, 0];

        if (request.data === "loading") {
          color = [254, 200, 60, 255];
        }

        if (request.data === "loaded") {
          color = [83, 207, 146, 255];

          BROWSER_ACTION.enable();
        }

        if (request.data === "error") {
          color = RED_BADGE_COLOR;
        }

        UpdateBadge({
          id: sender.tab.id,
          text: " ",
          color,
        });

        return true;
      }
      if (request.action === "xmlHttpRequest") {
        const { url } = request.data;

        delete request.data.url;

        if (!request.data.headers) request.data.headers = {};

        request.data.headers.accept = "application/json";
        request.data.headers["Content-Type"] = "application/json";

        if (request.data.body instanceof Object)
          request.data.body = JSON.stringify(request.data.body);

        const res = await fetch(url, request.data);

        return res.json();
        /* let ajaxData = {
          type: request.data.method,
          ...request.data
        };

        if (request.data.data) {
          ajaxData.dataType = "json";
          ajaxData.contentType = "application/json; charset=utf-8";
        }

        return $.ajax(ajaxData); */
      }
      if (request.action === "updateExtension") return CheckUpdate();

      if (request.action === "openCaptchaPopup") {
        if (!this.popupOpened) {
          this.CreateWindow({
            url: request.data,
            type: "popup",
            width: 500,
            height: 388,
          });

          return true;
        }
      }
      /* if (request.action === "notifierInit") {
        this.BrainlyNotificationSocket(market, request.data);
      }
      if (request.action === "notifierChangeState") {
        this.BrainlyNotificationSocket(request.data);
      } */
      if (request.action === "background>Inject content script anyway") {
        return this.InjectContentScript(request, true);

        // return Promise.resolve(true);
      }
      if (request.action === "OpenExtensionOptions") {
        ext.runtime.openOptionsPage();

        this.optionsPassedParameters[request.marketName] = {
          ...this.optionsPassedParameters[request.marketName],
          ...request.data,
        };

        return Promise.resolve(true);
      }
      if (request.action === "INeedParameters") {
        const promise = Promise.resolve(
          this.optionsPassedParameters[request.marketName],
        );
        this.optionsPassedParameters[request.marketName] = {};

        return promise;
      }

      if (request.action === "switch or open tab") {
        const window = await ext.windows.getCurrent({ populate: true });
        const targetTab = window.tabs.find(tab => {
          return tab.url.includes(request.data);
        });

        if (targetTab) return ext.tabs.update(targetTab.id, { selected: true });

        return ext.tabs.create({
          url: request.data,
          selected: true,
        });
      }
    }

    return undefined;
  }

  /**
   * @param {{ meta: { marketName: string; }; }} data
   */
  InitMarket(data: { meta: { marketName: string } }) {
    const name = data.meta.marketName;
    this.markets[name] = data;
  }

  async CreateWindow(data) {
    const detail = await ext.windows.create(data);
    this.popupOpened = detail.id;
  }

  RemovedWindowHandler(windowId: number) {
    if (windowId !== this.popupOpened) return;

    this.popupOpened = null;
  }

  /**
   * @param {number} _tabId
   * @param {{ status: string; }} changeInfo
   * @param {browser.tabs.Tab} tab
   */
  TabUpdatedHandler(
    _tabId: number,
    changeInfo: { status: string },
    tab: browser.tabs.Tab,
  ) {
    if (changeInfo.status === "loading") {
      this.ManipulateTab(tab);
    }
  }

  /**
   * @param {{ tabId: number, }} activeInfo
   */
  async TabActivatedHandler(activeInfo: { tabId: number }) {
    const tab = await ext.tabs.get(activeInfo.tabId);

    this.ManipulateTab(tab);
  }

  /**
   * @param {browser.tabs.Tab} tab
   */
  async ManipulateTab(tab: browser.tabs.Tab) {
    if (tab.url && IsBrainly(tab.url)) {
      const tabId = tab.id;

      await this.InjectContentScript(tab);
      const badgeColor = await ext.browserAction.getBadgeBackgroundColor({
        tabId,
      });

      if (badgeColor.every((v, i) => v !== RED_BADGE_COLOR[i])) {
        UpdateBadge({
          text: " ",
          color: RED_BADGE_COLOR,
        });
      }
    }
  }

  async InjectContentScript(tab: browser.tabs.Tab, forceInject?: boolean) {
    try {
      if (!forceInject && (await IsTabHasContentScript(tab))) return false;

      const url = new URL(tab.url);
      const permission = {
        permissions: ["tabs"],
        origins: [`*://${url.hostname}/*`],
      };

      let hasAccess = await ext.permissions.contains(permission);

      if (!hasAccess)
        // @ts-ignore
        hasAccess = await ext.permissions.request(permission);

      if (!hasAccess)
        throw Error(`User doesn't allow extension to work on ${url.hostname}`);

      ext.tabs.executeScript(tab.id, {
        file: "scripts/contentScript.js",
        runAt: "document_start",
        allFrames: false,
      });

      System.Log("Content script injected OK!");
      System.Log(
        `${this.manifest.short_name} running on ${tab.id} - ${tab.url}`,
      );

      return true;
    } catch (error) {
      if (error) console.error(error.message || error);
    }

    return false;
  }
}

// eslint-disable-next-line no-new
new Background();
