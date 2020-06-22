import WaitForElements from "../../../helpers/WaitForElements";
import QuickDeleteButtons from "./QuickDeleteButtons";

/**
 * @param {HTMLDivElement} feedsParent
 */
export default async function startObservingForDeleteButtons(feedsParent) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length === 0) return;

      mutation.addedNodes.forEach(node => {
        if (
          !(node instanceof HTMLDivElement) ||
          node?.dataset?.test !== "feed-item" ||
          node.classList.contains(".js-extension")
        )
          return;

        console.log(node);
        // eslint-disable-next-line no-new
        new QuickDeleteButtons(node);
      });
    });
  });

  observer.observe(feedsParent, { childList: true });
  /* $(feedsParent).observe(
    "added",
    `${selectors.feed_item}:not(.js-extension)`,
    e => {
      if (e.addedNodes && e.addedNodes.length > 0)
        e.addedNodes.forEach(node => new QuickDeleteButtons(node));
    },
  ); */

  const feedItem = await WaitForElements(
    `${selectors.feed_item}:not(.js-extension)`,
  );

  if (feedItem) feedItem.forEach(node => new QuickDeleteButtons(node));
}
