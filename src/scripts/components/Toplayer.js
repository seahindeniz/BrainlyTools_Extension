import Icon from "./style-guide/Icon";

/**
 * @typedef {{size?: "small"|"medium"|"large", header?: string, content?: string, actions?: string, addAfter?: string}} options
 */

class Toplayer {
  /**
   * @param {options} param0
   */
  // @ts-ignore
  constructor({ size = "medium", header = "", content = "", actions = "", addAfter = "" } = {}) {
    this.size = size;
    this.header = header;
    this.content = content;
    this.actions = actions;
    this.addAfter = addAfter;

    this.RenderToplayer();
    this.RenderHeader();
    this.RenderContent();
    this.RenderActions();
    this.RenderAdditionalElements();
  }
  RenderToplayer() {
    this.$toplayer = $(`
		<div class="sg-toplayer">
			<div class="sg-toplayer__close">
				<svg class="sg-icon sg-icon--gray-secondary sg-icon--x14">
					<use xlink:href="#icon-x"></use>
				</svg>
			</div>
			<div class="sg-toplayer__wrapper">
				<div class="sg-content-box"></div>
			</div>
		</div>`);

    if (this.size)
      this.$toplayer.addClass(`sg-toplayer--modal sg-toplayer--${this.size}`);

    /* let iconX = Icon({
      type: "std-close",
      size: 14,
      color: "gray-secondary"
    }); */

    this.$close = $(".sg-toplayer__close", this.$toplayer);
    this.$contentContainer = $("> .sg-toplayer__wrapper > .sg-content-box", this.$toplayer);

    //this.$close.append(iconX);
  }
  RenderHeader() {
    this.$header = $(`<div class="sg-content-box__header">${this.header}</div>`);

    if (this.size) {
      this.$header.addClass("sg-content-box__content--spaced-top sg-content-box__content--spaced-bottom-xlarge");
    }

    if (this.header)
      this.ShowHeader()
  }
  ShowHeader() {
    this.$header.appendTo(this.$contentContainer);
  }
  RenderContent() {
    this.$content = $(`<div class="sg-content-box__content">${this.content}</div>`);

    /* if (this.size) {
      this.$content.addClass("sg-content-box__content--spaced-bottom-large");
    } */

    if (this.content)
      this.ShowContent();
  }
  ShowContent() {
    this.$content.appendTo(this.$contentContainer);
  }
  RenderActions() {
    this.$actions = $(`<div class="sg-content-box__actions">${this.actions}</div>`);

    if (this.actions)
      this.ShowActions();
  }
  ShowActions() {
    this.$actions.appendTo(this.$contentContainer);
  }
  RenderAdditionalElements() {
    if (this.addAfter) {
      this.$additionalElements = $(this.addAfter);

      this.$additionalElements.appendTo(this.$contentContainer);
    }
  }
  ShowCloseSpinner() {
    let $svg = $("svg", this.$close);

    $(`<div class="sg-spinner sg-spinner--xxsmall"></div>`).insertBefore($svg);
    $svg.remove();
  }
  ChangeSize(size) {
    this.$toplayer.removeClass("sg-toplayer--small sg-toplayer--medium sg-toplayer--large sg-toplayer--fill sg-toplayer--full");
    this.$toplayer.addClass(`sg-toplayer--${size}`);
  }
}
export default Toplayer
