import TimedLoop from "../../helpers/TimedLoop";
import WaitForElements from "../../helpers/WaitForElements";
import startObservingForDeleteButtons from "./_/startObservingForDeleteButtons";
import TodaysActions from "./_/TodaysActions";

System.pageLoaded("Root inject OK!");

window.selectors = {
  ...window.selectors,
  feeds_parent: ".js-feed-stream",
  feed_item: `div[data-test="feed-item"]`,
  userLink: `.brn-feed-item__avatar .sg-avatar > a`,
  questionLink: `a[data-test="feed-item-link"]`,

  userInfoBoxPoints:
    "div.game-box__element > div.game-box__user-info > div.game-box__progress-items",
};

async function Home() {
  try {
    TimedLoop(TodaysActions, { expireTime: 5 });

    if (System.checkUserP(1) && System.checkBrainlyP(102)) {
      const feedsParent = await WaitForElements(selectors.feeds_parent, {
        single: true,
      });

      if (!feedsParent) throw Error("Can't find feed container");

      feedsParent.classList.add("quickDelete");

      startObservingForDeleteButtons(feedsParent);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

Home();
