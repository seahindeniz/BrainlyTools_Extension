import Build from "@root/helpers/Build";
import {
  ContentBoxActions,
  Flex,
  Radio,
  SeparatorHorizontal,
  SeparatorVertical,
  Text,
} from "../style-guide";

type ItemType = { id: string; label: string };
type ReasonSectionPropsType = {
  name?: string;
  text?: string;
  warning?: string;
  items?: ItemType[];
  changeHandler?: () => void;
  noHorizontalSeparator?: boolean;
  verticalOptions?: boolean;
};

class RadioSection {
  name?: string;
  text?: string;
  warning?: string;
  items?: ItemType[];
  changeHandler?: (event: Event) => void;
  noHorizontalSeparator?: boolean;
  verticalOptions?: boolean;

  container: HTMLElement;
  list: HTMLElement;
  separator: HTMLDivElement;
  $warning: JQuery<HTMLElement>;

  constructor({
    name,
    text,
    warning,
    items,
    changeHandler,
    noHorizontalSeparator = false,
    verticalOptions,
  }: ReasonSectionPropsType) {
    this.name = name;
    this.text = text;
    this.warning = warning;
    this.items = items;
    this.changeHandler = changeHandler;
    this.noHorizontalSeparator = noHorizontalSeparator;
    this.verticalOptions = verticalOptions;

    this.Render();
    this.RenderHorizontalSeparator();
    this.RenderWarning();

    if (items.length > 0) this.RenderItems();

    this.BindHandler();
  }

  Render() {
    this.container = Build(
      ContentBoxActions({
        spacedTop: "small",
        spacedBottom: "small",
      }),
      [
        [
          Flex({
            marginTop: "xs",
            marginRight: this.verticalOptions ? "l" : "",
          }),
          [
            [
              Flex({
                marginTop: "xs",
                marginRight: "s",
                marginBottom: "xs",
                noShrink: true,
              }),
              Text({
                size: "small",
                html: `${this.text}:`,
              }),
            ],
            [
              (this.list = Flex({
                wrap: true,
                direction: this.verticalOptions ? "column" : "row",
              })),
            ],
          ],
        ],
      ],
    );
  }

  RenderHorizontalSeparator() {
    if (this.noHorizontalSeparator) return;

    this.separator = SeparatorHorizontal();

    this.container.prepend(this.separator);
  }

  RenderWarning() {
    const type = this.verticalOptions ? "column" : "row";
    const position = this.verticalOptions ? "left fixedTop" : "top";

    this.$warning = $(
      `<div class="sg-bubble sg-bubble--${position} sg-bubble--${type}-start sg-bubble--peach sg-text--white" style="z-index: 1;">${this.warning}</div>`,
    );
  }

  RenderItems() {
    this.items.forEach((item, i) => {
      this.RenderItem(item);

      if (i + 1 < this.items.length && !this.verticalOptions)
        this.RenderSeparator();
    });
  }

  RenderItem(data: ItemType) {
    /* let $item = $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--no-spacing">
      <div class="sg-label sg-label--secondary">
        <label class="sg-actions-list">
          <div class="sg-label__icon sg-actions-list__hole">
            <div class="sg-radio">
              <input type="radio" class="sg-radio__element" name="${this.name}" id="${item.id}">
              <label class="sg-radio__ghost"></label>
            </div>
          </div>
          <span class="sg-label__text sg-actions-list__hole">${item.label}</span>
        </label>
      </div>
    </div>`); */
    const item = Build(
      Flex({ tag: "label", marginTop: "xs", marginBottom: "xs" }),
      [
        [
          Flex({ marginRight: "xs" }),
          new Radio({ id: data.id, name: this.name }),
        ],
        [
          Flex(),
          Text({
            html: data.label,
            weight: "bold",
            size: "xsmall",
          }),
        ],
      ],
    );

    this.list.append(item);
  }

  RenderSeparator() {
    const separator = Flex({
      marginTop: "xs",
      marginBottom: "xs",
      children: SeparatorVertical({
        size: "full",
      }),
    });

    this.list.append(separator);
  }

  BindHandler() {
    $("input", this.list).on("change", this.InputChanged.bind(this));
  }

  InputChanged(event) {
    this.HideWarning();

    if (this.changeHandler) this.changeHandler(event);
  }

  Hide() {
    $("input", this.list).prop("checked", false);
    this.HideElement(this.container);
  }

  // eslint-disable-next-line class-methods-use-this
  HideElement($element: HTMLElement | JQuery<HTMLElement>) {
    if ($element) {
      if ($element instanceof HTMLElement) {
        if ($element.parentElement)
          $element.parentElement.removeChild($element);
      } else $element.detach();
    }
  }

  ShowWarning() {
    if (!this.$warning.is(":visible")) {
      this.container.append(this.$warning[0]);
    } else {
      this.$warning
        .fadeTo("fast", 0.5)
        .fadeTo("fast", 1)
        .fadeTo("fast", 0.5)
        .fadeTo("fast", 1);
    }

    this.$warning.trigger("focus");
  }

  async HideWarning() {
    await this.$warning.slideUp("fast").promise();
    this.HideElement(this.$warning);
    this.$warning.show();
  }
}

export default RadioSection;
