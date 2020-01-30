import Build from "@/scripts/helpers/Build";
import {
  ContentBoxActions,
  Flex,
  Radio,
  SeparatorHorizontal,
  SeparatorVertical,
  Text
} from "../style-guide";

class RadioSection {
  /**
   * @typedef {{id: string, label: string}} Item
   * @param {{
   *  name?:string,
   *  text?: string,
   *  warning?: string,
   *  items?: Item[],
   *  changeHandler?: function,
   *  noHorizontalSeparator?: boolean
   * }} param0
   */
  constructor({
    name,
    text,
    warning,
    items,
    changeHandler,
    noHorizontalSeparator = false
  }) {
    this.name = name;
    this.text = text;
    this.warning = warning;
    this.items = items;
    this.changeHandler = changeHandler;
    this.noHorizontalSeparator = noHorizontalSeparator;

    this.Render();
    this.RenderHorizontalSeparator();
    this.RenderWarning();

    if (items.length > 0)
      this.RenderItems();

    this.BindHandler();
  }
  Render() {
    this.container = Build(ContentBoxActions({
      spacedTop: "small",
      spacedBottom: "small",
    }), [
      [
        Flex({
          marginTop: "xs",
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
            this.list = Flex({ wrap: true }),
          ]
        ]
      ]
    ]);
  }
  RenderHorizontalSeparator() {
    if (this.noHorizontalSeparator)
      return;

    this.separator = SeparatorHorizontal();

    this.container.prepend(this.separator);
  }
  RenderWarning() {
    this.$warning = $(
      `<div class="sg-bubble sg-bubble--top sg-bubble--row-start sg-bubble--peach sg-text--white" style="z-index: 1;">${this.warning}</div>`
    );
  }
  RenderItems() {
    this.items.forEach((item, i) => {
      this.RenderItem(item);

      if (i + 1 < this.items.length)
        this.RenderSeparator();
    });
  }
  /**
   * @param {Item} data
   */
  RenderItem(data) {
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
    let item = Build(Flex({ marginTop: "xs", marginBottom: "xs", }), [
      [
        Flex({ marginRight: "xs", }),
        Radio({ id: data.id, name: this.name }),
      ],
      [
        Flex(),
        Text({
          tag: "label",
          htmlFor: data.id,
          html: data.label,
          weight: "bold",
          size: "xsmall",
        })
      ],
    ]);

    this.list.append(item)
  }
  RenderSeparator() {
    let separator = Flex({
      marginTop: "xs",
      marginBottom: "xs",
      children: SeparatorVertical({
        size: "full",
      }),
    });

    this.list.append(separator);
  }
  BindHandler() {
    $("input", this.list).change(this.InputChanged.bind(this));
  }
  InputChanged(event) {
    this.HideWarning();

    if (this.changeHandler)
      this.changeHandler(event);
  }
  Hide() {
    this.HideElement(this.container);
  }
  /**
   * @param {HTMLElement | JQuery<HTMLElement>} $element
   */
  HideElement($element) {
    if ($element) {
      if ($element instanceof HTMLElement) {
        if ($element.parentElement)
          $element.parentElement.removeChild($element);
      } else
        $element.detach();
    }
  }
  ShowWarning() {
    if (!this.$warning.is(":visible")) {
      this.container.append(this.$warning[0])
    } else {
      this.$warning
        .fadeTo('fast', 0.5)
        .fadeTo('fast', 1)
        .fadeTo('fast', 0.5)
        .fadeTo('fast', 1);
    }

    this.$warning.focus();
  }
  async HideWarning() {
    await this.$warning.slideUp('fast').promise();
    this.HideElement(this.$warning);
    this.$warning.show();
  }
}

export default RadioSection
