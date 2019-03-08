import InjectToDOM from "../../helpers/InjectToDOM";

(() => {
	window.sitePassedParams && typeof window.sitePassedParams == "string" && (window.sitePassedParams = JSON.parse(sitePassedParams));

	if (System.checkUserP(14) && (System.checkRoute(4, "") || System.checkRoute(4, "tasks"))) {
		InjectToDOM("/scripts/views/4-UserContent/Questions.js");
	}

	if (System.checkUserP([15, 6]) && System.checkRoute(4, "responses")) {
		InjectToDOM(["/scripts/views/4-UserContent/Answers.js"]);
	}

	if (System.checkUserP(16) && System.checkRoute(4, "comments_tr")) {
		InjectToDOM("/scripts/views/4-UserContent/Comments.js");
	}
})()
