import HideElement from "@root/helpers/HideElement";
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

  constructor() {
    this.answerSections = {
      all: [],
      byId: {},
    };

    this.Init();
  }

  Init() {
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
    } catch (error) {
      console.error(error);
    }
  }

  InitSections() {
    if (System.checkUserP(1)) {
      this.questionSection = new QuestionSection(this);
    }

    if (System.checkUserP(2)) {
      this.RenderAnswerSections();
    }
  }

  FindQuestionContainer() {
    this.questionContainer = document.querySelector(".js-main-question");

    if (!this.questionContainer)
      throw Error("Can't find the question container");
  }

  SetQuestionData() {
    const dataString = this.questionContainer.dataset.z;
    this.data = JSON.parse(dataString);

    if (!this.data) {
      throw Error("Can't set the question data");
    }
  }

  RenderActionButtonSpinner() {
    this.actionButtonSpinner = Spinner({
      overlay: true,
    });
  }

  HideActionButtonSpinner() {
    HideElement(this.actionButtonSpinner);
  }

  ObserveForSections() {
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
            answerSection.Init(true),
          );
      });
    });

    observer.observe(mainContent, {
      childList: true,
      subtree: true,
    });
  }

  RenderAnswerSections() {
    if (!this.data.responses?.length) return;

    this.data.responses = this.data.responses.sort((answer1, answer2) => {
      if (answer1.approved.date && !answer2.approved.date) return -1;

      if (answer2.best) return 1;

      if (new Date(answer1.created) < new Date(answer2.created)) return -1;

      return 1;
    });

    this.data.responses.forEach((answerData, index) => {
      const answerSection = new AnswerSection(this, answerData, index);

      this.answerSections.byId[answerData.id] = answerSection;

      this.answerSections.all.push(answerSection);
    });
  }
}
