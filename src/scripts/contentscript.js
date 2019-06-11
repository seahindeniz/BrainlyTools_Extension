import _System from "./controllers/System";
import InjectToDOM from "./helpers/InjectToDOM";
import IsBrainly from "./helpers/IsBrainly";
import IsIgnoredPath from "./helpers/IsIgnoredPath";
import messagesLayoutExtender from "./helpers/messagesLayoutExtender";
import ThemeColorChanger from "./helpers/ThemeColorChanger";
import WaitForObject from "./helpers/WaitForObject";
import ext from "./utils/ext";

let manifest = ext.runtime.getManifest();
manifest.URL = ext.extension.getURL("");
manifest.id = ext.runtime.id;
//manifest.clientID = Math.random().toString(36).slice(2);

const html = document.documentElement;

if (!html.brainly_tools || html.brainly_tools !== manifest.version)
  InitIfTabIsBrainly();

function InitIfTabIsBrainly() {
  const url = new URL(location.href);

  if (
    !IsBrainly(url) ||
    IsIgnoredPath(url)
  )
    return;

  html.brainly_tools = manifest.version;

  Init();
  console.log("Content Script OK!");
}

async function Init() {
  let System = new _System();
  System.data.meta.marketName = location.hostname;
  System.data.meta.location = JSON.parse(JSON.stringify(location));
  System.data.meta.manifest = manifest;

  System.data.meta.marketTitle = document.title;
  System.data.meta.extension = {
    id: ext.runtime.id,
    URL: ext.runtime.getURL("").replace(/\/$/, "")
  }
  window.System = System;

  let html = document.documentElement;

  if (html.getAttribute("extension"))
    System.changeBadgeColor("loaded");
  else {
    System.changeBadgeColor("loading");
    require("./helpers/preExecuteScripts");
    document.documentElement.setAttribute("extension", manifest.version);
    InjectToDOM([
      "/scripts/lib/prototypeOverrides.js",
      "/scripts/lib/regex-colorizer.js",
      "/scripts/views/0-Core/index.js"
    ]);
    InjectToDOM("/styles/pages/Core.css", { makeItLastElement: true })

    if (html.id == "html") {
      InjectToDOM([
        "/styles/style-guide.css"
      ], { makeItLastElement: true });
      await System.Delay(10);
      InjectToDOM("/styles/pages/oldLayoutFixes.css", { makeItLastElement: true });

      WaitForObject(`document.body.classList.contains("mint")`, { noError: true }).then(isContains => {
        if (isContains && !document.body.attributes.itemtype) {
          InjectToDOM([
            System.constants.Brainly.style_guide.icons
          ]);
        }
      });
    }
  }

  ext.runtime.onMessage.addListener(MessageHandler);

  window.addEventListener('contentscript>Share System.data to background.js:DONE', () => {
    System.toBackground("popup>Get System.data from background")
  });

  window.addEventListener('metaGet', e => {
    window.postMessage({
        action: 'metaSet',
        data: System.data.meta
      },
      e.target.URL);
  });
  window.addEventListener("message", event => {
    if (event.source != window)
      return;

    MessageHandler(event.data);
  });
}

function MessageHandler(request) {
  if (request.action == "manifest") {
    return manifest;
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
    MessageHandler({ action: "previewColor", data: request.data });
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
