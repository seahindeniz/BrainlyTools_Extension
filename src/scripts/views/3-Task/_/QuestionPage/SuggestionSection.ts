import Build from "@root/helpers/Build";
import storage from "@root/helpers/extStorage";
import HideElement from "@root/helpers/HideElement";
import { Button, Flex, Icon } from "@style-guide";

const QuestionPageSuggestionSectionVisibilityKey =
  "questionPageSuggestionSectionVisibility";

const arrowUpIcon = new Icon({
  type: "arrow_up",
});

const arrowDownIcon = new Icon({
  type: "arrow_down",
});

export default class SuggestionSection {
  private close: boolean;
  private elements?: (HTMLDivElement | HTMLAnchorElement)[];
  private button: Button;
  headContainer: import("@style-guide/Flex").FlexElementType;

  constructor(private container: HTMLElement) {
    this.elements = [];

    this.Init();
  }

  async Init() {
    await this.GetPreviousState();
    this.Render();
    this.ChangeVisibility();
  }

  async GetPreviousState() {
    this.close = await storage(
      "get",
      QuestionPageSuggestionSectionVisibilityKey,
    );
  }

  private Render() {
    this.headContainer = Build(
      Flex({
        alignItems: "center",
      }),
      [
        this.container.firstElementChild,
        [
          Flex({
            inlineFlex: true,
            marginLeft: "s",
            onClick: this.ToggleVisibility.bind(this),
          }),
          (this.button = new Button({
            size: "s",
            iconOnly: true,
            type: "solid-light",
            icon: this.close ? arrowDownIcon : arrowUpIcon,
          })),
        ],
      ],
    );

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
