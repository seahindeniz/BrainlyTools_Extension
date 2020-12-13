import WaitForElement from "@root/helpers/WaitForElement";
import { Button, Flex, Icon } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";

export default class PageSwitcher {
  private selectedPageNumberContainer: HTMLSpanElement;
  private previousPageLink: string;
  private nextPageLink: string;
  private previousPageButtonContainer: FlexElementType;
  private nextPageButtonContainer: FlexElementType;
  private clickedState: boolean;

  constructor() {
    this.Init();
  }

  private async Init() {
    await this.FindSelectedPageNumberContainer();
    this.FindPreviousPageLink();
    this.FindNextPageLink();

    if (!this.previousPageLink && !this.nextPageLink) return;

    this.Render();
    this.RenderPreviousPageButton();
    this.RenderNextPageButton();
    this.BindListener();
  }

  private async FindSelectedPageNumberContainer() {
    this.selectedPageNumberContainer = await WaitForElement<"span">(
      ".tasksPagination > .numbers > .current",
    );

    console.log(this.selectedPageNumberContainer);
  }

  private FindPreviousPageLink() {
    const previousPageNumberAnchor = this.selectedPageNumberContainer
      .previousElementSibling?.firstElementChild as HTMLAnchorElement;

    if (!previousPageNumberAnchor) return;

    this.previousPageLink = previousPageNumberAnchor.getAttribute("href");
  }

  private FindNextPageLink() {
    const nextPageNumberAnchor = this.selectedPageNumberContainer
      .nextElementSibling?.firstElementChild as HTMLAnchorElement;

    if (!nextPageNumberAnchor) return;

    this.nextPageLink = nextPageNumberAnchor.getAttribute("href");
  }

  private Render() {
    const switchButtonsContainer = Flex({
      justifyContent: "space-between",
      className: "page-buttons",
      children: [
        (this.previousPageButtonContainer = Flex()),
        (this.nextPageButtonContainer = Flex()),
      ],
    });

    document.body.append(switchButtonsContainer);
  }

  private RenderPreviousPageButton() {
    if (!this.previousPageLink) return;

    const previousPageButton = new Button({
      size: "xl",
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({
        size: 40,
        type: "arrow_left",
      }),
      onClick: () => this.SwitchPage("previous"),
    });

    this.previousPageButtonContainer.append(previousPageButton.element);
  }

  private RenderNextPageButton() {
    if (!this.nextPageLink) return;

    const nextPageButton = new Button({
      size: "xl",
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({
        size: 40,
        type: "arrow_right",
      }),
      onClick: () => this.SwitchPage("next"),
    });

    this.nextPageButtonContainer.append(nextPageButton.element);
  }

  SwitchPage(direction: "previous" | "next") {
    if (!direction || this.clickedState) return;

    this.clickedState = true;

    if (direction === "previous") {
      window.location.href = this.previousPageLink;
    } else if (direction === "next") {
      window.location.href = this.nextPageLink;
    }
  }

  BindListener() {
    document.addEventListener("keyup", this.HandleKeyUp.bind(this));
  }

  HandleKeyUp(event: KeyboardEvent) {
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
      this.previousPageLink &&
      (event.code === "KeyA" || event.code === "ArrowLeft")
    )
      this.SwitchPage("previous");
    else if (
      this.nextPageLink &&
      (event.code === "KeyD" || event.code === "ArrowRight")
    )
      this.SwitchPage("next");
  }
}
