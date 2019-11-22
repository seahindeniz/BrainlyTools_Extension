"use strict";

import taskSection from "./_/taskSection";
import responseSection from "./_/responseSection";
import KeywordList from "./_/KeywordList";

System.pageLoaded("Task inject OK!");

window.selectors = {
  articleQuestion: "article.brn-question",
  taskModerateButtonContainer: "article.js-main-question:not(.brn-question--deleted) .question-header > .sg-actions-list > .sg-actions-list__hole:last-child > .sg-actions-list",
  taskModerateButton: ".question-header > .sg-actions-list > .sg-actions-list__hole:last-child > .sg-actions-list > .sg-actions-list__hole:first-child",

  responseParentContainer: ".js-react-answers",
  responseContainer: ".brn-answer",
  responseHeader: "js-react-answer-header-",
  responseModerateButtonContainer: `div.sg-actions-list > div.sg-actions-list__hole:nth-child(2) > div.sg-actions-list`,
}
if (System.checkBrainlyP(102)) {
  if (System.checkUserP(1)) {
    taskSection();
  }
  if (System.checkUserP(2)) {
    responseSection();
  }

  if (System.checkUserP(35, true))
    new KeywordList();
}
