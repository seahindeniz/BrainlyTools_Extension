import { MetaDataType } from "@root/controllers/System";
import PrepareDeleteReasons from "../../../../controllers/PrepareDeleteReasons";

const MetaGet = (): Promise<MetaDataType> => {
  return new Promise((resolve, reject) => {
    const evtMetaGet = new Event("metaGet", {
      bubbles: true,
      cancelable: false,
    });

    document.dispatchEvent(evtMetaGet);
    window.addEventListener("message", async e => {
      if (!e) {
        reject(Error("Didn't receive any event data"));
        return;
      }

      if (e.data.action === "metaSet") {
        resolve(e.data.data);

        return;
      }

      if (e.data.action === "DOM>Share System.data to background.js") {
        await PrepareDeleteReasons(true);
        await System.ShareSystemDataToBackground();

        const evtSharingDone = new Event(
          "contentScript>Share System.data to background.js:DONE",
          { bubbles: true, cancelable: false },
        );
        document.dispatchEvent(evtSharingDone);
      }
    });
  });
};

export default async function setMetaData() {
  const scriptSrc = (document.currentScript as HTMLScriptElement).src;
  System.data.meta = await MetaGet();

  const extensionURL = new URL(scriptSrc);
  System.data.meta = {
    marketTitle: document.title,
    extension: {
      id: extensionURL.host,
      URL: extensionURL.origin,
    },
    ...System.data.meta,
  };
}
