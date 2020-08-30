import ext from "webextension-polyfill";
import CheckIfSameDomain from "../../helpers/CheckIfSameDomain";

export default async (action, data) => {
  const tabs = await ext.tabs.query({});

  tabs.forEach(tab => {
    if (CheckIfSameDomain(tab.url, System.data.meta.location.href)) {
      const message = {
        action,
        url: tab.url,
        data,
      };

      ext.tabs.sendMessage(tab.id, message);
    }
  });
};
