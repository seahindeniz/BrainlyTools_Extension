import FeedModeration from "./_/FeedModeration/FeedModeration";
import TodaysActions from "./_/TodaysActions";

System.pageLoaded("Home inject OK!");

export default class Homepage {
  todaysActions: TodaysActions;
  feedModeration: FeedModeration;

  constructor() {
    this.todaysActions = new TodaysActions();
    this.feedModeration = new FeedModeration();
  }
}

// eslint-disable-next-line no-new
new Homepage();
