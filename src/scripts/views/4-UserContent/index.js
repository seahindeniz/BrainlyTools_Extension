import { Button, Flex, Icon } from "@style-guide";
import InjectToDOM from "../../helpers/InjectToDOM";

(() => {
  let type;

  if (System.checkRoute(4, "") || System.checkRoute(4, "tasks"))
    type = "Questions";

  if (System.checkRoute(4, "responses")) type = "Answers";

  if (System.checkRoute(4, "comments_tr")) type = "Comments";

  if (type) InjectToDOM(`/scripts/views/4-UserContent/${type}.js`);

  const selectedPageLink = document.querySelector(
    `#content-old > div > p > a[style^="color"]`,
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

  document.body.append(buttonContainer);

  if (previousPageLink instanceof HTMLAnchorElement) {
    const previousPageButton = new Button({
      size: "xl",
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({
        size: 46,
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
        size: 46,
        type: "arrow_right",
      }),
    });

    nextPageButtonContainer.append(nextPageButton.element);

    nextPageButton.element.addEventListener("click", () => {
      nextPageLink.click();
    });
  }

  document.addEventListener("keyup", event => {
    if (
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.metaKey ||
      (event.target && event.target instanceof HTMLInputElement) ||
      event.target instanceof HTMLSelectElement ||
      event.target instanceof HTMLOptionElement ||
      event.target instanceof HTMLTextAreaElement
    )
      return;

    if (
      previousPageLink &&
      (event.code === "KeyA" || event.code === "ArrowLeft")
    )
      previousPageLink.click();
    else if (
      nextPageLink &&
      (event.code === "KeyD" || event.code === "ArrowRight")
    )
      nextPageLink.click();
  });
})();
