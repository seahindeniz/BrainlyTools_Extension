import LiveModerationFeed, {
  ModeratorDataType,
} from "@BrainlyReq/LiveModerationFeed";
import HideElement from "@root/helpers/HideElement";
import WaitForElement from "@root/helpers/WaitForElement";
import { Spinner } from "@style-guide";
import AnswerSection from "./AnswerSection";
import QuestionPageModeratePanelController from "./ModeratePanelController";
import type { QuestionDataType } from "./QuestionData";
import QuestionSection from "./QuestionSection";
import SuggestionSection from "./SuggestionSection";
import UserDetailsSection from "./UserDetailsSection/UserDetailsSection";

export default class QuestionPage {
  answerSections: {
    all: AnswerSection[];
    byId: {
      [id: number]: AnswerSection;
    };
  };

  questionContainer: HTMLDivElement;
  data: QuestionDataType;
  questionSection?: QuestionSection;
  actionButtonSpinner: HTMLDivElement;
  moderatePanelController?: QuestionPageModeratePanelController;
  private liveModerationFeed: LiveModerationFeed;
  answerContainers: HTMLDivElement[];
  private suggestionSection?: SuggestionSection;
  userDetailsSection: UserDetailsSection;

  constructor() {
    this.answerSections = {
      all: [],
      byId: {},
    };

    this.Init();
  }

  private Init() {
    try {
      this.FindQuestionContainer();
      this.SetQuestionData();

      this.userDetailsSection = new UserDetailsSection();
      this.suggestionSection = new SuggestionSection();

      this.ObserveForSections();

      if (this.data.is_deleted) return;

      this.RenderActionButtonSpinner();

      this.moderatePanelController = new QuestionPageModeratePanelController(
        this,
      );

      this.InitSections();

      this.liveModerationFeed = new LiveModerationFeed({
        onTicketReserve: this.TicketReserved.bind(this),
        questionIds: [this.data.id],
      });
    } catch (error) {
      console.error(error);
    }
  }

  private FindQuestionContainer() {
    this.questionContainer = document.querySelector(".js-main-question");

    if (!this.questionContainer)
      throw Error("Can't find the question container");
  }

  private SetQuestionData() {
    const dataString = this.questionContainer.dataset.z;

    this.data = JSON.parse(dataString);

    if (!this.data) {
      throw Error("Can't set the question data");
    }
  }

  private RenderActionButtonSpinner() {
    this.actionButtonSpinner = Spinner({
      overlay: true,
    });
  }

  HideActionButtonSpinner() {
    HideElement(this.actionButtonSpinner);
  }

  private ObserveForSections() {
    const mainContent = document.getElementById("main-content");

    if (!mainContent) {
      throw Error("Can't find main-content container");
    }

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.addedNodes.length === 0 ||
          !(mutation.target instanceof HTMLElement)
        )
          return;

        // console.log(mutation.addedNodes);

        if (mutation.target.classList.contains("js-main-question")) {
          this.questionSection?.Init(true);

          return;
        }

        if (mutation.target.classList.contains("js-react-answers")) {
          this.answerSections?.all.forEach(answerSection =>
            answerSection.Init(),
          );

          return;
        }

        if (
          mutation.target.classList?.contains("brn-qpage-next-newest-questions")
        ) {
          this.suggestionSection?.ChangeVisibility();
        }

        mutation.addedNodes.forEach((node: HTMLElement) => {
          if (
            !node.classList?.contains("brn-qpage-next-newest-questions") ||
            this.suggestionSection?.container === node
          )
            return;

          this.suggestionSection.container = node;
        });
      });
    });

    observer.observe(mainContent, {
      childList: true,
      subtree: true,
    });
  }

  private InitSections() {
    if (System.checkUserP(1)) {
      this.questionSection = new QuestionSection(this);
    }

    if (System.checkUserP(2)) {
      this.RenderAnswerSections();
    }
  }

  private async RenderAnswerSections() {
    if (!this.data.responses?.length) return;

    this.answerContainers = Array.from(
      await WaitForElement(
        `.js-question-answers > div > div[class*="empty:sg-space-y-xs"]`,
        {
          multiple: true,
          // noError: showError,
        },
      ),
    ) as HTMLDivElement[];

    this.data.responses.forEach(answerData => {
      const answerSection = new AnswerSection(this, answerData);

      this.answerSections.byId[answerData.id] = answerSection;

      this.answerSections.all.push(answerSection);
    });
  }

  TicketReserved(id: number, moderator: ModeratorDataType) {
    if (id !== this.data.id) return;

    this.questionSection.TicketReserved(moderator);
    this.answerSections.all.forEach(answerSection =>
      answerSection.TicketReserved(moderator),
    );
  }
}
