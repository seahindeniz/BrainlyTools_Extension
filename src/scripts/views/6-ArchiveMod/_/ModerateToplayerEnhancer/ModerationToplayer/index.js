/**
 * @typedef {{
 *  id: number,
 *  warnings_count: number,
 *  reports_count: number,
 *  successfull_reports_count: number,
 *  removed_contents_count: number,
 * }} UserType
 *
 * @typedef {{
 *  user: UserType,
 *  created: string,
 *  abuse: {}
 * }} ReportType
 *
 * @typedef {{
 *  id: number,
 *  created: string,
 *  content: string,
 *  user: UserType,
 *  element: HTMLElement[],
 *  report?: ReportType,
 * }} CommonContentEntryType
 *
 * @typedef {{
 *  report?: ReportType,
 * } & CommonContentEntryType} QuestionEntryType
 *
 * @typedef {{
 *  task_id: number,
 *  responses: number,
 *  report?: ReportType,
 * } & CommonContentEntryType} AnswerEntryType
 *
 * @typedef {{
 *  elements: {
 *    moderationTask: jQuery<HTMLElement[]>,
 *    moderationResponses: jQuery<HTMLElement[]>,
 *  },
 *  data: {
 *    task: QuestionEntryType,
 *    responses: AnswerEntryType[],
 *  }
 *  endModeration: function,
 * } & import("../../ReportBoxEnhancer/Report").ZdnObject} ZdnToplayerType
 */

import AnswerSection from "./ModerationSection/Answer";
import QuestionSection from "./ModerationSection/Question";

export default class ModerationToplayer {
  /**
   * @param {import("../").default} main
   * @param {HTMLDivElement} container
   */
  constructor(main, container) {
    this.main = main;
    this.container = container;

    let hash = container.getAttribute("objecthash");
    /**
     * @type {ZdnToplayerType}
     */
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
      this.answers.forEach(this.InitAnswerSection.bind(this))
  }
  /**
   * @param {AnswerEntryType} answer
   */
  InitAnswerSection(answer) {
    let answerSection = new AnswerSection(this, answer);

    this.answerSections.push(answerSection);
  }
}
