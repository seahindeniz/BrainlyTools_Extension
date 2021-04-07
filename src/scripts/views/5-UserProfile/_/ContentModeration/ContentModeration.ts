import ModeratePanelController from "./ModeratePanelController";
import Question from "./Question";

export default class ContentModeration {
  questionLiElements: NodeListOf<HTMLLIElement>;
  moderatePanelController: ModeratePanelController;
  questions: {
    [id: number]: Question;
  };

  focusedQuestion: Question;

  constructor() {
    this.questions = {};

    this.FindQuestions();

    if (!this.questionLiElements?.length) return;

    this.moderatePanelController = new ModeratePanelController(this);

    this.questionLiElements.forEach(liElement => {
      const question = new Question(this, liElement);

      this.questions[question.questionId] = question;
    });
  }

  private FindQuestions() {
    this.questionLiElements = document.querySelectorAll(
      "#tasks-solved > ol.tasks-list > li.task",
    );
  }
}
