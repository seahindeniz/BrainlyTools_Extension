import ext from "../../scripts/utils/ext";
import CheckIfSameDomain from "../../scripts/helpers/CheckIfSameDomain";

export default async (action, data) => {
  let tabs = await ext.tabs.query({});

  tabs.forEach(tab => {
    if (CheckIfSameDomain(tab.url, System.data.meta.location.href)) {
      let message = {
        action,
        url: tab.url,
        data
      };

      ext.tabs.sendMessage(tab.id, message);
    }
  });
}
