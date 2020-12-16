import { GQL } from "@BrainlyReq";
import WaitForElement from "@root/helpers/WaitForElement";
import gql from "graphql-tag";
import {
  ExtraDetailsQuestionFragment,
  ExtraDetailsQuestionType,
} from "./extraDetails.fragment";
import HomepageModeratePanelController from "./ModeratePanelController";
import Moderator from "./Moderator";
import Question from "./Question/Question";

type ExtraDetailsType = {
  [questionId: string]: ExtraDetailsQuestionType;
};

function GenerateAliasedQuery(idList: number[]) {
  return idList.map(id => {
    const globalId = window.btoa(`question:${id}`);

    return `
        question${id}: question(id: "${globalId}") {
          ...QuestionFragment
        }
    `;
  });
}

function RemoveAskQuestionSection(node: HTMLDivElement) {
  if (!node) return;

  const container = node.querySelector(
    `:scope [class*="SearchResultsWithAdUnit__relativeWrapper"] > div.sg-content-box__content:nth-child(2) > div > div:last-child, :scope > div > div > div > div.sg-content-box__content:last-child`,
  );

  if (!container) return;

  container.remove();
}

export default class SearchResultsModerationClassType {
  moderatePanelController: HomepageModeratePanelController;
  moderator?: Moderator;

  focusedQuestion: Question;
  searchResultContainerWrapper: HTMLDivElement;
  questions: {
    all: Question[];
    byId: {
      [id: number]: Question;
    };
  };

  constructor() {
    this.moderatePanelController = new HomepageModeratePanelController(this);
    this.questions = {
      all: [],
      byId: {},
    };

    if (System.checkUserP([14, 26]) && System.checkBrainlyP(102)) {
      this.moderator = new Moderator(this);
    }

    this.FindSearchContainerWrapper();
    this.ObserveForResultsContainer();
    this.FindResultsContainerByWaiting();
  }

  private FindSearchContainerWrapper() {
    this.searchResultContainerWrapper = document.querySelector(
      ".js-react-search-results",
    );

    if (!this.searchResultContainerWrapper) {
      throw Error("Can't find search results container");
    }
  }

  private ObserveForResultsContainer() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length === 0) return;

        mutation.addedNodes.forEach(this.IdentifyResultsContainer.bind(this));
      });
    });

    observer.observe(this.searchResultContainerWrapper, {
      childList: true,
      // subtree: true,
    });
  }

  private IdentifyResultsContainer(node: HTMLDivElement) {
    if (!node?.firstElementChild || !(node instanceof HTMLDivElement)) return;

    if (node.querySelector(":scope > .brn-placeholder__animation-box")) {
      this.moderator?.Hide();

      return;
    }

    if (
      !node.firstElementChild.className.includes(
        "SearchResults__relativeWrapper",
      ) &&
      !node.firstElementChild.className.includes(
        "SearchResultsWithAdUnit__relativeWrapper",
      )
    )
      return;

    RemoveAskQuestionSection(node);

    const questionContainers = document.querySelectorAll(
      `div[data-test="search-stream-wrapper"] > div, [class*="LayoutBox__box"] > .brn-fade-in-fast > div.sg-content-box__content:first-child > div`,
    );

    if (questionContainers.length === 0) {
      this.moderator?.Hide();

      throw Error("Results container doesn't have any question container");
    }

    this.moderator?.Show();

    const idList = Array.from(questionContainers)
      .map(this.InitQuestion.bind(this))
      .filter(Boolean) as number[];

    this.FetchExtraDetails(idList);
    this.moderator?.UpdateButtonNumbers();
  }

  private InitQuestion(container: HTMLDivElement) {
    if (container.childElementCount === 0) return undefined;

    const questionLinkAnchor: HTMLAnchorElement = container.querySelector(
      `:scope > div > a`,
    );

    if (!questionLinkAnchor) {
      console.info(container);
      console.error("Can't find question link anchor");

      return undefined;
    }

    const questionId = System.ExtractId(questionLinkAnchor.href);
    let question = this.questions.byId[questionId];

    if (!question) {
      question = new Question(this, container, questionLinkAnchor, questionId);

      this.questions.byId[questionId] = question;

      this.questions.all.push(question);

      return questionId;
    }

    question.questionLinkAnchor = questionLinkAnchor;
    question.container = container;

    return undefined;
  }

  private async FetchExtraDetails(idList: number[]) {
    if (!idList?.length) return;

    try {
      const aliasedQueries = GenerateAliasedQuery(idList);
      const query = gql`
        {
          ${aliasedQueries.join("\n")}
        }
        ${ExtraDetailsQuestionFragment}
      `;

      const res = await GQL<ExtraDetailsType>(query);

      if (!res?.data) {
        throw Error("Can't fetch extra details");
      }

      Object.entries(res.data).forEach(([key, questionData]) => {
        if (!questionData) return;

        const question = this.questions.byId[System.ExtractId(key)];

        if (!question) return;

        question.extraDetails = questionData;

        question.RenderExtraDetails();
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async FindResultsContainerByWaiting() {
    const resultsContainers = await WaitForElement(
      `.js-react-search-results > div`,
      {
        multiple: true,
      },
    );

    if (!resultsContainers.length) return;

    resultsContainers.forEach(this.IdentifyResultsContainer.bind(this));
  }
}
