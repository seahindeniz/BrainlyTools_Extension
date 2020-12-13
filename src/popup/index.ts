import ext from "webextension-polyfill";
import _System from "../controllers/System";
import Popup from "./controllers/Popup";

const System = new _System();

window.System = System;
window.isPageBusy = false;

window.addEventListener("beforeunload", event => {
  if (window.isPageBusy) {
    event.returnValue =
      System.data.locale.common.notificationMessages.ongoingProcess;

    event.preventDefault();
  }
});

async function onBodyLoad() {
  window.popup = new Popup();

  System.data.locale = await System.PrepareLanguageFile(navigator.language);

  popup.RenderStatusMessage({
    title: `${System.data.locale.popup.notificationMessages.pleaseWait}..`,
  });

  let isBrainlyPageFound = false;
  const currentWindow = await ext.windows.getCurrent();
  const tabs = await ext.tabs.query({});

  if (currentWindow && tabs && tabs.length > 0) {
    let activeBrainlyTab = tabs.find(
      tab =>
        tab.active &&
        tab.windowId === currentWindow.id &&
        System.constants.Brainly.regexp_BrainlyMarkets.test(tab.url),
    );

    if (!activeBrainlyTab) {
      const activeBrainlyTabId = await System.toBackground(
        "lastUpdatedBrainlyTabId",
      );

      activeBrainlyTab = tabs.find(tab => tab.id === activeBrainlyTabId);
    }

    if (activeBrainlyTab) {
      const activeTabUrl = new URL(activeBrainlyTab.url);
      const targetMarketDomain = activeTabUrl.hostname;

      System.data.meta.marketName = targetMarketDomain;

      let lastUpdatedTabId = await System.toBackground("lastUpdatedTabId");

      if (!lastUpdatedTabId) {
        console.warn("Can't find last updated tab, falling back to active");

        lastUpdatedTabId = activeBrainlyTab.id;
      }

      const tab = tabs.find(_tab => _tab.id === lastUpdatedTabId);

      if (tab) {
        isBrainlyPageFound = true;

        const message = {
          action: "contentScript>Share System.data to background.js",
          url: tab.url,
        };

        try {
          await ext.tabs.sendMessage(tab.id, message);
        } catch (error) {
          try {
            await System.toBackground(
              "background>Inject content script anyway",
              tab,
            );
            await ext.tabs.sendMessage(tab.id, message);
          } catch (secondError) {
            popup.RenderStatusMessage({
              type: "danger",
              title: System.data.locale.popup.notificationMessages.errorN.replace(
                "%{error_code}",
                ` 404 `,
              ),
              message: System.data.locale.popup.notificationMessages.incorrectData.replace(
                /%{market_domain_name}/gi,
                targetMarketDomain,
              ),
            });
          }
        }
      }
    }
  }

  window.chrome.runtime.onMessage.addListener(request => {
    if (request.action === "popup>Get System.data from background") {
      popup.PrepareDataBeforeRendering(request.marketName);
    }
  });

  if (!isBrainlyPageFound) {
    popup.RenderStatusMessage({
      type: "danger",
      title: System.data.locale.popup.notificationMessages.errorN.replace(
        "%{error_code}",
        ` 404 `,
      ),
      message: System.data.locale.popup.notificationMessages.openABrainlyPage,
    });
  }
}

$(onBodyLoad);
