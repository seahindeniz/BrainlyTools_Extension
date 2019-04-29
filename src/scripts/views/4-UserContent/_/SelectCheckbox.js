export default class SelectCheckbox extends HTMLInputElement {
  /**
   * @param {HTMLElement} rowElement
   * @param {number} id
   */
  constructor(rowElement, id) {
    super();
    this.id = id;
    this.type = "checkbox";
    this.$rowElement = $(rowElement);

    this.classList.add("sg-checkbox__element");

    this.Render();
    this.RenderSpinner();
  }
  Render() {
    this.$cell = $(`
		<td>
			<div class="sg-spinner-container">
				<div class="sg-checkbox" style="width: 16px; height: 16px;">
					<label class="sg-checkbox__ghost" for="${this.id}">
						<svg class="sg-icon sg-icon--adaptive sg-icon--x10">
							<use xlink:href="#icon-check"></use>
						</svg>
					</label>
				</div>
			</div>
		</td>`);

    this.$ghost = $(".sg-checkbox__ghost", this.$cell);
    this.$spinnerContainer = $("> .sg-spinner-container", this.$cell);

    this.$cell.prependTo(this.$rowElement)
    $("div.sg-checkbox", this.$cell).prepend(this);
  }
  RenderSpinner() {
    this.$spinner = $(`
		<div class="sg-spinner-container__overlay">
			<div class="sg-spinner sg-spinner--xxsmall"></div>
		</div>`);
  }
  ShowSpinner() {
    this.Disable();
    this.$spinner.appendTo(this.$spinnerContainer);
  }
  HideSpinner() {
    this.isBusy = false;
    this.Activate();
    this.$spinner.appendTo("<div />");
  }
  Activate() {
    this.disabled = false;

    this.$ghost.removeClass("sg-link--disabled");
  }
  Disable() {
    this.disabled = true;

    this.$ghost.addClass("sg-link--disabled");
  }
}
window.customElements.define('select-checkbox', SelectCheckbox, { extends: "input" });
