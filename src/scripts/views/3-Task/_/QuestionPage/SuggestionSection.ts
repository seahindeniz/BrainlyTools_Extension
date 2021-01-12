import Build from "@root/helpers/Build";
import storage from "@root/helpers/extStorage";
import HideElement from "@root/helpers/HideElement";
import WaitForElement from "@root/helpers/WaitForElement";
import { Button, Flex, Icon } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";

const QuestionPageSuggestionSectionVisibilityKey =
  "questionPageSuggestionSectionVisibility";

const arrowUpIcon = new Icon({
  type: "arrow_up",
});

const arrowDownIcon = new Icon({
  type: "arrow_down",
});

export default class SuggestionSection {
  #container: HTMLElement;

  private close: boolean;
  private elements?: (HTMLDivElement | HTMLAnchorElement)[];
  private button: Button;
  private headContainer: FlexElementType;
  private headTextContainer: FlexElementType;
  private headText: HTMLHeadingElement;

  constructor() {
    this.elements = [];

    this.Init();
  }

  get container() {
    return this.#container;
  }

  set container(container) {
    this.#container = container;

    if (container.firstElementChild instanceof HTMLHeadingElement)
      this.headText = container.firstElementChild;

    this.Render();
    this.ChangeVisibility();
  }

  private async Init() {
    await this.GetPreviousState();
    this.FindContainerByWaiting();

    this.ChangeVisibility();
  }

  private async GetPreviousState() {
    this.close = await storage(
      "get",
      QuestionPageSuggestionSectionVisibilityKey,
    );
  }

  private async FindContainerByWaiting() {
    const container = await WaitForElement(".brn-qpage-next-newest-questions", {
      expireIn: 5,
    });

    if (this.#container && this.#container === container) return;

    this.container = container;

    this.RelocateElements();
    this.ChangeVisibility();
  }

  private Render() {
    if (this.headContainer) return;

    this.headContainer = Build(
      Flex({
        alignItems: "center",
      }),
      [
        (this.headTextContainer = Flex({
          inlineFlex: true,
          marginRight: "s",
        })),
        (this.button = new Button({
          size: "s",
          iconOnly: true,
          type: "solid-light",
          onClick: this.ToggleVisibility.bind(this),
          icon: this.close ? arrowDownIcon : arrowUpIcon,
        })),
      ],
    );

    this.RelocateElements();
  }

  private RelocateElements() {
    if (!this.container?.firstElementChild) return;

    this.headTextContainer.append(this.headText);
    this.container.prepend(this.headContainer);
  }

  private async ToggleVisibility() {
    this.close = !this.close;

    this.ChangeVisibility();

    await storage("set", {
      [QuestionPageSuggestionSectionVisibilityKey]: this.close,
    });
  }

  ChangeVisibility() {
    if (!this.button) return;

    if (this.close) {
      this.CloseSection();

      return;
    }

    this.OpenSection();
  }

  private OpenSection() {
    if (this.elements) {
      this.container.append(...this.elements);
      this.elements.splice(0, this.elements.length);
    }

    this.button.ChangeIcon(arrowUpIcon);
  }

  private CloseSection() {
    const elements = this.container.querySelectorAll<
      HTMLDivElement | HTMLAnchorElement
    >(":scope > *:nth-child(n+2)");

    this.button.ChangeIcon(arrowDownIcon);

    if (!elements?.length) return;

    this.elements.push(...Array.from(elements));

    HideElement(...this.elements);
  }
}
