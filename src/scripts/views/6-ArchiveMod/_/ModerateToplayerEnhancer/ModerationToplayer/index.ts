/* eslint-disable camelcase */
import AnswerSection from "./ModerationSection/Answer";
import QuestionSection from "./ModerationSection/Question";
import type ModerateToplayerEnhancerClassType from "..";

type UserType = {
  id: number;
  warnings_count: number;
  reports_count: number;
  successfull_reports_count: number;
  removed_contents_count: number;
};

type ReportType = {
  user: UserType;
  created: string;
  abuse: {
    [x: string]: any;
  };
};

type CommonContentEntryType = {
  id: number;
  created: string;
  content: string;
  user: UserType;
  element: HTMLElement[];
  report?: ReportType;
};

export type QuestionEntryType = {
  report?: ReportType;
} & CommonContentEntryType;

export type AnswerEntryType = {
  task_id: number;
  responses: number;
  report?: ReportType;
} & CommonContentEntryType;

type ZdnToplayerType = {
  elements: {
    moderationTask: JQuery<HTMLElement[]>;
    moderationResponses: JQuery<HTMLElement[]>;
  };
  data: {
    task: QuestionEntryType;
    responses: AnswerEntryType[];
  };
  endModeration: (...props) => void;
} & import("../../ReportBoxEnhancer/Report").ZdnObject;

export default class ModerationToplayer {
  main: ModerateToplayerEnhancerClassType;
  container: HTMLDivElement;
  zdnObject: ZdnToplayerType;
  question: QuestionEntryType;
  answers: AnswerEntryType[];
  questionSection: QuestionSection;
  answerSections: AnswerSection[];

  constructor(
    main: ModerateToplayerEnhancerClassType,
    container: HTMLDivElement,
  ) {
    this.main = main;
    this.container = container;

    const hash = container.getAttribute("objecthash");
    this.zdnObject = Zadanium.getObject(hash);
    this.question = this.zdnObject.data.task;
    this.answers = this.zdnObject.data.responses;

    this.questionSection = new QuestionSection(this);
    this.answerSections = [];

    this.InitAnswerSections();
  }

  InitAnswerSections() {
    if (
      this.answers &&
      this.answers instanceof Array &&
      this.answers.length > 0
    )
      this.answers.forEach(this.InitAnswerSection.bind(this));
  }

  /**
   * @param {AnswerEntryType} answer
   */
  InitAnswerSection(answer) {
    const answerSection = new AnswerSection(this, answer);

    this.answerSections.push(answerSection);
  }
}
