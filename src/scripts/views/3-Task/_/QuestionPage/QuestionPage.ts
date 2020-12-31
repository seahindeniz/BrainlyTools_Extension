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

      if (this.data.is_deleted) return;

      this.RenderActionButtonSpinner();
      this.ObserveForSections();

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

        if (mutation.target.classList.contains("js-main-question"))
          this.questionSection.Init(true);

        if (mutation.target.classList.contains("js-react-answers"))
          this.answerSections.all.forEach(answerSection =>
            answerSection.Init(),
          );
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
