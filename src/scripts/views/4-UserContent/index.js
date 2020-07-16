import { Button, Flex, Icon } from "@style-guide";
import InjectToDOM from "../../helpers/InjectToDOM";

(() => {
  let type;

  if (System.checkRoute(4, "") || System.checkRoute(4, "tasks"))
    type = "Questions";

  if (System.checkRoute(4, "responses")) type = "Answers";

  if (System.checkRoute(4, "comments_tr")) type = "Comments";

  if (type) InjectToDOM(`/scripts/views/4-UserContent/${type}.js`);

  const contentOld = document.querySelector("#content-old");

  if (!contentOld) return;

  const selectedPageLink = contentOld.querySelector(
    `:scope > div > p > a[style^="color"]`,
  );

  if (!selectedPageLink) return;

  const nextPageLink = selectedPageLink.nextElementSibling;
  const previousPageLink = selectedPageLink.previousElementSibling;

  if (!nextPageLink && !previousPageLink) return;

  const nextPageButtonContainer = Flex();
  const previousPageButtonContainer = Flex();
  const buttonContainer = Flex({
    justifyContent: "space-between",
    className: "page-buttons",
    children: [previousPageButtonContainer, nextPageButtonContainer],
  });

  contentOld.append(buttonContainer);

  if (previousPageLink instanceof HTMLAnchorElement) {
    const previousPageButton = new Button({
      size: "xl",
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({
        type: "arrow_left",
      }),
    });

    previousPageButtonContainer.append(previousPageButton.element);

    previousPageButton.element.addEventListener("click", () => {
      previousPageLink.click();
    });
  }

  if (nextPageLink instanceof HTMLAnchorElement) {
    const nextPageButton = new Button({
      size: "xl",
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({
        type: "arrow_right",
      }),
    });

    nextPageButtonContainer.append(nextPageButton.element);

    nextPageButton.element.addEventListener("click", () => {
      nextPageLink.click();
    });
  }
})();
