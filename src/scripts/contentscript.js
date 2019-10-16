import _System from "./controllers/System";
import InjectToDOM from "./helpers/InjectToDOM";
import IsBrainly from "./helpers/IsBrainly";
import IsIgnoredPath from "./helpers/IsIgnoredPath";
import messagesLayoutExtender from "./helpers/messagesLayoutExtender";
import ThemeColorChanger from "./helpers/ThemeColorChanger";
import WaitForObject from "./helpers/WaitForObject";
import ext from "./utils/ext";

/**
 * @type {_System}
 */
let System;
let MANIFEST = ext.runtime.getManifest();
MANIFEST.URL = ext.extension.getURL("");
MANIFEST.id = ext.runtime.id;
//manifest.clientID = Math.random().toString(36).slice(2);

const html = document.documentElement;

class Contentscript {
  constructor() {
    this.InitIfBrainly();
  }
  InitIfBrainly() {
    const url = new URL(location.href);

    if (
      !IsBrainly(url) ||
      IsIgnoredPath(url)
    )
      return;

    html.brainly_tools = MANIFEST.version;

    this.Init();
    this.InjectCoreIfItIsntInjected();
    this.BindHandlers();
  }
  Init() {
    System = new _System(this);
    System.data.meta.marketName = location.hostname;
    System.data.meta.location = JSON.parse(JSON.stringify(location));
    System.data.meta.manifest = MANIFEST;

    System.data.meta.marketTitle = document.title;
    System.data.meta.extension = {
      id: ext.runtime.id,
      URL: ext.runtime.getURL("").replace(/\/$/, "")
    }
    window.System = System;
  }
  InjectCoreIfItIsntInjected() {
    if (html.getAttribute("extension"))
      System.changeBadgeColor("loaded");
    else {
      System.Log("Content Script OK!");
      System.changeBadgeColor("loading");
      this.InjectCore();
    }
  }
  async InjectCore() {
    require("./helpers/preExecuteScripts");
    document.documentElement.setAttribute("extension", MANIFEST.version);
    InjectToDOM([
      "/scripts/lib/prototypeOverrides.js",
      "/scripts/lib/regex-colorizer.js",
      "/scripts/views/0-Core/index.js"
    ]);

    if (html.id != "html") {
      InjectToDOM("/styles/pages/Core.css", { makeItLastElement: true });
    } else {
      InjectToDOM("/styles/pages/CoreWithStyleGuide.css", { makeItLastElement: true });

      let isContains = await WaitForObject(`document.body.classList.contains("mint")`, { noError: true });

      if (isContains && !document.body.attributes.itemtype)
        InjectToDOM([
          System.constants.Brainly.style_guide.icons,
        ]);
    }
  }
  BindHandlers() {
    window.addEventListener('metaGet', this.SendMetaData.bind(this));
    ext.runtime.onMessage.addListener(this.MessageHandler.bind(this));
    window.addEventListener("message", this.SecondaryMessageHandler.bind(this));
    window.addEventListener('contentscript>Share System.data to background.js:DONE', () => {
      System.toBackground("popup>Get System.data from background")
    });
  }
  SendMetaData(event) {
    window.postMessage({
        action: 'metaSet',
        data: System.data.meta
      },
      event.target.URL);
  }
  MessageHandler(request) {
    if (request.action == "manifest") {
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
    if (request.action === "contentscript>Share System.data to background.js") {
      window.postMessage({
        action: "DOM>Share System.data to background.js"
      }, request.url);

    }
    if (request.action === "extendMessagesLayout") {
      messagesLayoutExtender(request.data);
    }

    if (request.action == "contentscript>Check if content script injected") {
      html = document.documentElement;

      return Promise.resolve(html.getAttribute("extension"));
    }
  }
  SecondaryMessageHandler(event) {
    if (event.source != window)
      return;

    this.MessageHandler(event.data);
  }
}

if (!html.brainly_tools || html.brainly_tools !== MANIFEST.version)
  new Contentscript();
