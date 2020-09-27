import HideElement from "@root/helpers/HideElement";
import { Spinner } from "@style-guide";
import AnswerSection from "./AnswerSection";
import type { QuestionDataType } from "./QuestionData";
import QuestionSection from "./QuestionSection";

export default class QuestionPage {
  answerSections: AnswerSection[];
  questionContainer: HTMLDivElement;
  questionBox: HTMLDivElement;
  data: QuestionDataType;
  questionSection?: QuestionSection;
  actionButtonSpinner: HTMLDivElement;

  constructor() {
    this.answerSections = [];

    this.Init();
  }

  Init() {
    try {
      this.FindQuestionContainer();
      this.SetQuestionData();

      if (this.data.is_deleted) return;

      this.RenderActionButtonSpinner();
      this.ObserveForSections();

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

    this.questionBox = this.questionContainer.querySelector(
      ".js-react-question-box > div > .brn-qpage-next-question-box",
    );

    if (!this.questionBox) {
      throw Error("Can't find the question box");
    }
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
          this.questionSection.Init();

        if (mutation.target.classList.contains("js-react-answers"))
          this.answerSections.forEach(answerSection => answerSection.Init());
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
      return answer1.approved.date && !answer2.approved.date
        ? -1
        : answer2.best
        ? 1
        : new Date(answer1.created) < new Date(answer2.created)
        ? -1
        : 1;
    });

    this.data.responses.forEach((answerData, index) => {
      this.answerSections.push(new AnswerSection(this, answerData, index));
    });
  }
}
