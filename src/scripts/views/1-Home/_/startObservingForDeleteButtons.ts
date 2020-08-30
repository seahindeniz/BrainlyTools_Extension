import WaitForElement from "@root/helpers/WaitForElement";
import QuickDeleteButtons from "./QuickDeleteButtons";

function processNodeElement(node: HTMLElement) {
  if (
    node?.dataset?.test === "feed-item" &&
    !node.classList.contains("js-extension")
  )
    // eslint-disable-next-line no-new
    new QuickDeleteButtons(node);
}

export default async function startObservingForDeleteButtons(
  feedsParent: HTMLElement,
) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length === 0) return;

      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLDivElement)) return;

        processNodeElement(node);
      });
    });
  });

  observer.observe(feedsParent, { childList: true, subtree: true });

  const feedItem = await WaitForElement(
    `${selectors.feed_item}:not(.js-extension)`,
    { noError: true, multiple: true },
  );

  if (feedItem) feedItem.forEach(node => new QuickDeleteButtons(node));
}
