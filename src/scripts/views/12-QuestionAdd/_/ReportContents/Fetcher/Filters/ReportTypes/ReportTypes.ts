import type FiltersType from "../Filters";
import QuestionAnswerRT from "./QuestionAnswerRT";
import CommentRT from "./CommentRT";
import CorrectionRT from "./CorrectionRT";
import type ReportTypeType from "./ReportType";

export default class ReportTypes {
  main: FiltersType;

  selectedReportType: ReportTypeType;

  reportTypes: {
    questionAnswer: QuestionAnswerRT;
    comment: CommentRT;
    correction: CorrectionRT;
  };

  constructor(main: FiltersType) {
    this.main = main;

    this.reportTypes = {
      questionAnswer: new QuestionAnswerRT(this),
      comment: new CommentRT(this),
      correction: new CorrectionRT(this),
    };
  }
}
