import WaitForElement from "../../../helpers/WaitForElement";
import QuickDeleteButtons from "./QuickDeleteButtons";

export default async function startObservingForDeleteButtons(feeds_parent) {
  $(feeds_parent).observe('added', selectors.feed_item + ':not(.js-extension)', e => {
    if (e.addedNodes && e.addedNodes.length > 0)
      e.addedNodes.forEach(node => new QuickDeleteButtons(node));
  });

  let feed_item = await WaitForElement(`${selectors.feed_item}:not(.js-extension)`, true);

  if (feed_item)
    feed_item.forEach(node => new QuickDeleteButtons(node));
}
