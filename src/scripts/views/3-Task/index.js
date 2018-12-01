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
	responseModerateButtonContainer: "> .sg-content-box > .sg-actions-list > div:not(.js-best-answer-label-container)"
}
if (System.checkUserP(2)) {
	taskSection();
}
if (System.checkUserP(45)) {
	responseSection();
}
