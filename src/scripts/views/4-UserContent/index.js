import InjectToDOM from "../../helpers/InjectToDOM";

(() => {
  if (System.checkUserP(14) && (System.checkRoute(4, "") || System.checkRoute(4, "tasks"))) {
    InjectToDOM("/scripts/views/4-UserContent/Questions.js");
  }

  if (System.checkUserP([6, 15, 19]) && System.checkRoute(4, "responses")) {
    InjectToDOM(["/scripts/views/4-UserContent/Answers.js"]);
  }

  if (System.checkUserP(16) && System.checkRoute(4, "comments_tr")) {
    InjectToDOM("/scripts/views/4-UserContent/Comments.js");
  }
})()
