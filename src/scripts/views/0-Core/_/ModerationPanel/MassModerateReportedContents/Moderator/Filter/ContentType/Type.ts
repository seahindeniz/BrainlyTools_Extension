import { Button, Flex } from "@/scripts/components/style-guide";

export default class Type {
  /**
   * @param {import(".").default} main
   * @param {{
   *  name: "Question" | "Answer",
   *  buttonType: import("@style-guide/Button").ButtonTypeType
   * }} param1
   */
  constructor(main, { name, buttonType }) {
    this.main = main;
    this.name = name;
    this.buttonType = buttonType;
    this.selected = false;

    this.RenderContainer();
    this.RenderButton();
    this.BindListener();
  }

  RenderContainer() {
    this.container = Flex({ marginRight: "s" });

    this.main.optionsContainer.append(this.container);
  }

  RenderButton() {
    this.button = new Button({
      size: "s",
      type: "solid",
      text:
        System.data.locale.popup.extensionOptions.quickDeleteButtons[
          this.name.toLowerCase()
        ],
    });

    this.container.append(this.button.element);
  }

  BindListener() {
    this.button.element.addEventListener("click", this.Clicked.bind(this));
  }

  Clicked() {
    if (!this.selected) this.Select();
    else this.UnSelect();

    this.main.main.FilterReports();
  }

  Select() {
    this.selected = true;

    this.button.ChangeType({ type: this.buttonType });
  }

  UnSelect() {
    this.selected = false;

    this.button.ChangeType({ type: "solid" });
  }
}
