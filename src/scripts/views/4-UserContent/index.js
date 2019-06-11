import InjectToDOM from "../../helpers/InjectToDOM";

(() => {
  let type;

  if ((System.checkRoute(4, "") || System.checkRoute(4, "tasks")))
    type = "Questions";

  if (System.checkRoute(4, "responses"))
    type = "Answers";

  if (System.checkRoute(4, "comments_tr"))
    type = "Comments";

  if (type)
    InjectToDOM(`/scripts/views/4-UserContent/${type}.js`);
})();
