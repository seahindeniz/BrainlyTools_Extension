/**
 * @typedef {"loading" | "success" | "warning" | "danger"} ProgressTypeType
 */

class Progress {
  /**
   * @param {{
   *  type: ProgressTypeType,
   *  max: number,
   *  label: string,
   * }} param0
   */
  constructor({ type, max, label }) {
    this.type = "is-" + type;
    this.max = max;
    this.label = label;
    // sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large
    this.$container = $(`
		<div class="progress-container">
			<progress class="progress ${this.type}" value="0" max="${max || 1}" data-label="${label}"></progress>
		</div>`);
    this.$bar = $("progress", this.$container);

    this.$container.click(() => {
      this.forceClose();
    });

    return this;
  }
  setMax(n) {
    this.$bar.attr("max", n);
  }
  update(n) {
    this.$bar.val(n);
    return this;
  }
  UpdateLabel(text) {
    this.$bar.attr("data-label", text);
    return this;
  }
  close() {
    setTimeout(() => this.forceClose(), 3000);
  }
  /**
   * @param {boolean} [ignoreValue]
   */
  forceClose(ignoreValue) {
    if (ignoreValue || this.$bar.val() == ~~this.$bar.attr("max")) {
      this.$container.remove();
    }
  }
  /**
   * @param {ProgressTypeType} type
   */
  ChangeType(type) {
    this.$bar
      .removeClass(this.type)
      .addClass("is-" + type);

    this.type = "is-" + type;
  }
}
export default Progress;
