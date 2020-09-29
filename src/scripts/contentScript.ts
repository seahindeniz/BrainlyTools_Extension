import notification from "@components/notification2";
import _System from "@root/controllers/System";
import ServerReq from "@ServerReq";
import { Text } from "@style-guide";
import ext from "webextension-polyfill";
import InjectToDOM from "../helpers/InjectToDOM";
import IsBrainly from "../helpers/IsBrainly";
import IsIgnoredPath from "../helpers/IsIgnoredPath";
import messagesLayoutExtender from "../helpers/messagesLayoutExtender";
import ThemeColorChanger from "../helpers/ThemeColorChanger";
import WaitForObject from "../helpers/WaitForObject";
import RemoveJunkNotifications from "./views/0-Core/_/RemoveJunkNotifications";

let System: _System;

const manifestData = ext.runtime.getManifest();
const MANIFEST = {
  ...manifestData,
  URL: ext.extension.getURL(""),
  id: ext.runtime.id,
};
// manifest.clientID = Math.random().toString(36).slice(2);

let html = document.documentElement;

function Init() {
  System = new _System();
  System.data.meta.marketName = location.hostname;
  System.data.meta.location = JSON.parse(JSON.stringify(location));
  System.data.meta.manifest = MANIFEST;

  System.data.meta.marketTitle = document.title;
  System.data.meta.extension = {
    id: ext.runtime.id,
    URL: ext.runtime.getURL("").replace(/\/$/, ""),
  };
  window.System = System;

  RemoveJunkNotifications();
}

function InitConsolePreventerPreventer() {
  InjectToDOM("/scripts/lib/preventConsolePreventer.js");
}

function SendMetaData(event) {
  window.postMessage(
    {
      action: "metaSet",
      data: System.data.meta,
    },
    event.target.URL,
  );
}

async function ShortenURL(url: string) {
  try {
    const resCreated = await new ServerReq().CreateShortLink(url);

    if (!resCreated?.success) {
      throw Error("Server failure");
    }

    const shortenedURL = `${
      //
      System.data.config.extension.shortenedLinkURL
    }/${resCreated.shortCode}`;

    await navigator.clipboard.writeText(shortenedURL);

    notification({
      sticky: true,
      text: `${
        //
        System.data.locale.popup.notificationMessages.shortLinkSuccessMessage
      }<br>`,
      children: Text({
        children: shortenedURL,
        color: "peach-dark",
        href: shortenedURL,
        size: "small",
        target: "_blank",
        weight: "bold",
      }),
      type: "success",
    });
  } catch (error) {
    notification({
      text:
        System.data.locale.common.notificationMessages
          .somethingWentWrongPleaseRefresh,
      type: "error",
    });
    console.error(error);
  }
}

class ContentScript {
  constructor() {
    InitConsolePreventerPreventer();
    this.InitIfBrainly();
  }

  InitIfBrainly() {
    const url = new URL(location.href);

    if (!IsBrainly(url) || IsIgnoredPath(url)) return;

    html.dataset.brainly_tools = MANIFEST.version;
    // html.brainly_tools = MANIFEST.version;

    Init();
    this.InjectCoreIfNotInjected();
    this.BindHandlers();
  }

  InjectCoreIfNotInjected() {
    if (html.getAttribute("extension")) System.changeBadgeColor("loaded");
    else {
      System.Log("Content Script OK!");
      System.changeBadgeColor("loading");
      this.InjectCore();

      InjectToDOM("/scripts/lib/css_browser_selector.min.js");
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async InjectCore() {
    // eslint-disable-next-line global-require
    require("../helpers/preExecuteScripts");
    document.documentElement.setAttribute("extension", MANIFEST.version);

    if (html.id !== "html") {
      InjectToDOM("/styles/pages/Core.css", { makeItLastElement: true });
      InjectToDOM(["/scripts/lib/jquery-3.3.1.min.js"]);
    } else {
      InjectToDOM("/styles/pages/CoreWithStyleGuide.css", {
        makeItLastElement: true,
      });

      const isContains = await WaitForObject(
        `document.body.classList.contains("mint")`,
        { noError: true },
      );

      if (isContains && !("itemtype" in document.body.attributes)) {
        InjectToDOM([System.constants.Brainly.style_guide.icons]);
      }
    }

    InjectToDOM([
      "/scripts/lib/prototypeOverrides.js",
      "/scripts/lib/regex-colorizer.js",
      "/scripts/views/0-Core/index.js",
    ]);
  }

  BindHandlers() {
    window.addEventListener("metaGet", SendMetaData.bind(this));
    ext.runtime.onMessage.addListener(this.MessageHandler.bind(this));
    window.addEventListener("message", this.SecondaryMessageHandler.bind(this));
    window.addEventListener(
      "contentScript>Share System.data to background.js:DONE",
      () => {
        System.toBackground("popup>Get System.data from background");
      },
    );
  }

  async MessageHandler(request) {
    if (request.action === "setMarketData") {
      if (request.data) System.data = request.data;
    }

    if (request.action === "shortenUrl") {
      ShortenURL(request.data);
    }

    if (request.action === "manifest") {
      return MANIFEST;
    }
    if (request.action === "previewColor") {
      if (window.coloring) {
        window.coloring.UpdateColor(request.data);
      } else {
        window.coloring = new ThemeColorChanger(request.data, true);
      }
    }
    if (request.action === "changeColors") {
      localStorage.setItem("themeColor", request.data);
      this.MessageHandler({ action: "previewColor", data: request.data });
    }
    if (request.action === "contentScript>Share System.data to background.js") {
      window.postMessage(
        {
          action: "DOM>Share System.data to background.js",
        },
        request.url,
      );
    }
    if (request.action === "extendMessagesLayout") {
      messagesLayoutExtender(request.data);
    }

    if (request.action === "contentScript>Check if content script injected") {
      html = document.documentElement;

      return Promise.resolve(true);
    }

    return Promise.resolve();
  }

  SecondaryMessageHandler(event) {
    if (event.source !== window) return;

    this.MessageHandler(event.data);
  }
}

// if (!html.brainly_tools || html.brainly_tools !== MANIFEST.version)
if (html.dataset.brainly_tools !== MANIFEST.version) {
  // eslint-disable-next-line no-new
  new ContentScript();
}
