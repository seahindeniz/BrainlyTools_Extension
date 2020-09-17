import WaitForElement from "@root/helpers/WaitForElement";
import HomepageModeratePanelController from "./ModeratePanelController";
import Question from "./Question/Question";

export default class FeedModeration {
  moderatePanelController: HomepageModeratePanelController;
  focusedQuestion: Question;
  feedContainer: any;
  questions: {
    all: Question[];
    byId: {
      [id: number]: Question;
    };
  };

  constructor() {
    this.moderatePanelController = new HomepageModeratePanelController(this);

    this.Init();
  }

  async Init() {
    this.ResetQuestions();
    await this.FindFeedContainer();
    this.ObserveForQuestions();
    await this.FindFeedItemsByWaiting();
  }

  ResetQuestions() {
    this.questions = {
      all: [],
      byId: {},
    };
  }

  async FindFeedContainer() {
    this.feedContainer = await WaitForElement("#main-content");
  }

  ObserveForQuestions() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach(node => {
            if (
              !(node instanceof HTMLDivElement) ||
              !node.classList.contains("brn-feed-items")
            )
              return;

            this.ResetQuestions();
          });
        }

        if (mutation.addedNodes.length > 0)
          mutation.addedNodes.forEach(this.IdentifyAndInitFeedItems.bind(this));
      });
    });

    observer.observe(this.feedContainer, {
      childList: true,
      subtree: true,
    });
  }

  async FindFeedItemsByWaiting() {
    const feedItems = await WaitForElement(`.brn-feed-items > *`, {
      noError: true,
      multiple: true,
    });

    if (!feedItems.length) return;

    feedItems.forEach(this.IdentifyAndInitFeedItems.bind(this));
  }

  IdentifyAndInitFeedItems(node: HTMLDivElement) {
    if (
      !(node instanceof HTMLDivElement) ||
      !node.classList.contains("brn-feed-item-wrapper")
    )
      return;

    const questionLinkAnchor: HTMLAnchorElement = node.querySelector(
      `a[data-test="feed-item-link"]`,
    );

    if (!questionLinkAnchor) {
      throw Error("Can't find question link element");
    }

    const questionId = System.ExtractId(questionLinkAnchor.href);

    if (this.questions.byId[questionId]) return;

    const question = new Question(this, questionId, node);

    this.questions.byId[question.questionId] = question;

    this.questions.all.push(question);
  }
}
