"use strict";

import taskSection from "./_/taskSection";
import responseSection from "./_/responseSection";

System.pageLoaded("Task inject OK!");

window.selectors = {
  articleQuestion: "article.brn-question",
  taskModerateButtonContainer: "article.brn-question:not(.brn-question--deleted) .question-header > .sg-actions-list > .sg-actions-list__hole:last-child > .sg-actions-list",
  taskModerateButton: ".question-header > .sg-actions-list > .sg-actions-list__hole:last-child > .sg-actions-list > .sg-actions-list__hole:first-child",

  responseParentContainer: ".js-answers-wrapper",
  responseContainer: ".brn-answer",
  responseModerateButtonContainer: `> div.sg-content-box > div[class^="js-react-answer-header-"] > div.sg-actions-list > div.sg-actions-list__hole:nth-child(2) > div.sg-actions-list`
}
if (System.checkBrainlyP(102)) {
  if (System.checkUserP(1)) {
    taskSection();
  }
  if (System.checkUserP(2)) {
    responseSection();
  }
}
