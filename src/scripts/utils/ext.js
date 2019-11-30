import webExt from "webextension-polyfill";

/**
 * @type {browser}
 */
const ext = webExt;

export default ext;

/* const apis = [
  'alarms',
  'bookmarks',
  'browserAction',
  'commands',
  'contextMenus',
  'cookies',
  'downloads',
  'events',
  'extension',
  'extensionTypes',
  'history',
  'i18n',
  'idle',
  'notifications',
  'pageAction',
  'runtime',
  'storage',
  'tabs',
  'webNavigation',
  'webRequest',
  'windows',
]

class Extension {
  constructor() {
    this.api = undefined;
    const _this = this;
    console.log(this);

    apis.forEach(function(api) {
      _this[api] = null;
      try {
        if (window.chrome[api]) {
          _this[api] = window.chrome[api];
        }
      } catch (e) {}
      try {
        if (window[api]) {
          _this[api] = window[api];
        }
      } catch (e) {}
      try {
        if (browser[api]) {
          _this[api] = browser[api];
        }
      } catch (e) {}
      try {
        _this.api = browser.extension[api];
      } catch (e) {}
    });
    try {
      if (browser && browser.runtime) {
        this.runtime = browser.runtime;
      }
    } catch (e) {}
    try {
      if (browser && browser.browserAction) {
        this.browserAction = browser.browserAction;
      }
    } catch (e) {};
  }
}

export default new Extension(); */
