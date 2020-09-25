import CreateElement from "@components/CreateElement";
import HideElement from "@root/helpers/HideElement";
import { Checkbox, Spinner } from "@style-guide";

export default class SelectCheckbox extends HTMLInputElement {
  $rowElement: JQuery<any>;
  isBusy: boolean;
  checkBox: Checkbox;
  container: HTMLTableDataCellElement;
  spinner: HTMLDivElement;

  constructor(rowElement: HTMLElement, id: number) {
    super();
    this.id = String(id);
    this.type = "checkbox";
    this.$rowElement = $(rowElement);

    this.classList.add("sg-checkbox__element");

    this.Render();
    this.RenderSpinner();
  }

  Render() {
    this.container = CreateElement({
      tag: "td",
      children: this.checkBox = new Checkbox({ id: null }),
    });
    this.$rowElement.prepend(this.container);
  }

  RenderSpinner() {
    this.spinner = Spinner({
      overlay: true,
      size: "xxsmall",
    });
  }

  ShowSpinner() {
    this.Disable();
    this.checkBox.element.append(this.spinner);
  }

  HideSpinner() {
    this.isBusy = false;

    this.Activate();
    HideElement(this.spinner);
  }

  Activate() {
    this.disabled = false;

    // this.$ghost.removeClass("sg-text--link-disabled");
  }

  Disable() {
    this.disabled = true;

    // this.$ghost.addClass("sg-text--link-disabled");
  }
}

window.customElements.define("select-checkbox", SelectCheckbox, {
  extends: "input",
});
