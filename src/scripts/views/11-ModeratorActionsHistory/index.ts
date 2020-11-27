import Action, { UserType2 } from "@BrainlyAction";
import WaitForElement from "@root/helpers/WaitForElement";
import ActionHistoryReviews, {
  ActionHistoryReviewDataType,
} from "@ServerReq/ActionsHistory/Reviews";
import { DateTime } from "luxon";
import ActionEntry, { REVERT_TIME_LIMIT } from "./_/ActionEntry/ActionEntry";
import MultiReviewSection from "./_/MultiReviewSection/MultiReviewSection";

export type ReviewDataEntryType = {
  hash: string;
  data: ActionHistoryReviewDataType;
  actionEntries: ActionEntry[];
  reviewTimeInstance: DateTime;
  isRevertible: boolean;
};

export default class ModeratorActionHistory {
  private activities: HTMLTableRowElement[];
  moderator: UserType2;
  conversationId?: number;
  multiReviewSection?: MultiReviewSection;
  reviewDataEntries: {
    all: ReviewDataEntryType[];
    byId: {
      [id: string]: ReviewDataEntryType;
    };
  };

  actionEntries: ActionEntry[];
  fetchedUsers: {
    [id: string]: UserType2;
  };

  constructor() {
    this.actionEntries = [];
    this.reviewDataEntries = {
      all: [],
      byId: {},
    };
    this.fetchedUsers = {};

    this.Init();
  }

  private async Init() {
    try {
      await this.FindActivities();
      await this.SetModeratorDetails();
      this.InitActionEntries();
      await this.FetchReviews();
      this.RefreshTimes();
      setInterval(this.RefreshTimes.bind(this), 1000);

      this.multiReviewSection = new MultiReviewSection(this);
    } catch (error) {
      console.error(error);
    }
  }

  private async FindActivities() {
    const activities = await WaitForElement<"tr">("table.activities tr", {
      multiple: true,
    });

    if (!activities.length) {
      throw Error("Can't find any activity");
    }

    this.activities = Array.from(activities);
  }

  private async SetModeratorDetails() {
    if (!(window.sitePassedParams instanceof Array))
      throw Error("sitePassedParams isn't an array");

    const [moderatorId] = window.sitePassedParams;
    const resModerator = await new Action().GetUser(Number(moderatorId));

    if (resModerator.success === false) {
      return;
    }

    this.moderator = resModerator.data;
  }

  private InitActionEntries() {
    this.activities.forEach(rowElement => {
      const actionEntry = new ActionEntry(this, rowElement);

      this.actionEntries.push(actionEntry);
    });
  }

  private async FetchReviews() {
    const resReviews = await ActionHistoryReviews([
      ...new Set(this.actionEntries.map(actionEntry => actionEntry.hash)),
    ]);

    if (resReviews.success === true && resReviews.data.length > 0) {
      const now = DateTime.local();

      resReviews.data.forEach(data => {
        let dataEntry = this.reviewDataEntries.byId[data.id];

        if (dataEntry) return;

        const reviewTimeInstance = DateTime.fromISO(data.reviewTime);
        const end = reviewTimeInstance.plus(REVERT_TIME_LIMIT);

        dataEntry = {
          data,
          hash: data.hash,
          actionEntries: [],
          reviewTimeInstance,
          get isRevertible() {
            return now < end;
          },
        };
        this.reviewDataEntries.byId[data.id] = dataEntry;

        this.reviewDataEntries.all.push(dataEntry);
      });
    }

    this.PlaceActionAndDataEntries();
  }

  PlaceActionAndDataEntries() {
    this.reviewDataEntries.all.forEach(dataEntry => {
      dataEntry.actionEntries = [];
    });

    this.actionEntries.forEach(actionEntry => {
      actionEntry.RenderActions();

      const dataEntry = this.reviewDataEntries.all.find(
        _dataEntry =>
          actionEntry.hash === _dataEntry.hash &&
          actionEntry.actionTime <= _dataEntry.reviewTimeInstance,
      );

      if (dataEntry) {
        actionEntry.is = dataEntry.data.valid ? "valid" : "invalid";
        actionEntry.dataEntry = dataEntry;

        dataEntry.actionEntries.push(actionEntry);
        actionEntry.Reviewed();
      } else {
        actionEntry.is = undefined;
        actionEntry.dataEntry = null;

        actionEntry.Unreviewed();
      }
    });
  }

  private RefreshTimes() {
    // setTimeout(this.RefreshTimes.bind(this), 1000);
    this.actionEntries.forEach(actionEntry => actionEntry.RenderTimes());
  }
}

// eslint-disable-next-line no-new
new ModeratorActionHistory();
