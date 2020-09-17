import { GQL } from "@BrainlyReq";
import WaitForElement from "@root/helpers/WaitForElement";
import gql from "graphql-tag";
// import ExtraDetailsFragment from "./extraDetails.fragment.gql";
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

  const container = node.querySelector(":scope > div > div:last-child");

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

  FindSearchContainerWrapper() {
    this.searchResultContainerWrapper = document.querySelector(
      ".js-react-search-results",
    );

    if (!this.searchResultContainerWrapper) {
      throw Error("Can't find search results container");
    }
  }

  ObserveForResultsContainer() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length === 0) return;

        mutation.addedNodes.forEach(this.IdentifyResultsContainer.bind(this));
      });
    });

    observer.observe(this.searchResultContainerWrapper, {
      childList: true,
      subtree: true,
    });
  }

  IdentifyResultsContainer(node: HTMLDivElement) {
    if (
      !(node instanceof HTMLDivElement) ||
      !node.className.includes("LayoutBox__box")
    )
      return;

    RemoveAskQuestionSection(node);

    const questionContainers = node.querySelectorAll(
      `:scope > div > .sg-content-box--spaced-top-large,
      :scope > div.brn-fade-in-fast > div > .sg-content-box--spaced-top-large`,
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

  InitQuestion(container: HTMLDivElement) {
    if (container.childElementCount === 0) return undefined;

    const questionLinkAnchor: HTMLAnchorElement = container.querySelector(
      `.sg-content-box__actions > .sg-actions-list a`,
    );

    if (!questionLinkAnchor) {
      console.log(container);
      console.error("Can't find question link anchor");

      return undefined;
    }

    const questionId = System.ExtractId(questionLinkAnchor.href);
    let question = this.questions.byId[questionId];

    if (!question) {
      question = new Question(this, questionId, container);

      this.questions.byId[questionId] = question;

      this.questions.all.push(question);

      return questionId;
    }

    question.container = container;

    return undefined;
  }

  async FetchExtraDetails(idList: number[]) {
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

  async FindResultsContainerByWaiting() {
    const resultsContainers = await WaitForElement(
      `.sg-box[class*="LayoutBox__box"]`,
      {
        multiple: true,
      },
    );

    if (!resultsContainers.length) return;

    resultsContainers.forEach(this.IdentifyResultsContainer.bind(this));
  }
}
