/**
 * @typedef {"loading" | "success" | "warning" | "danger"} ProgressTypeType
 */

class Progress {
  /**
   * @param {{
   *  type: ProgressTypeType,
   *  max: number,
   *  label: string,
   *  fullWidth?: boolean,
   * }} param0
   */
  constructor({ type, max, label, fullWidth }) {
    this.type = type;
    this.max = max;
    this.label = label;
    // sg-content-box--spaced-top-large  sg-content-box--spaced-bottom-large
    this.$container = $(`
		<div class="progress-container">
			<progress class="progress ${
        this.type ? `is-${this.type}` : ""
      }" value="0" max="${max || 1}" data-label="${label}"></progress>
		</div>`);
    this.$bar = $("progress", this.$container);

    if (fullWidth) this.$container.addClass("progress-container--full-width");

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
   * @param {ProgressTypeType} [type]
   */
  ChangeType(type) {
    this.$bar.removeClass(this.type ? `is-${this.type}` : "");

    if (type) this.$bar.addClass(`is-${type}`);

    this.type = type;
  }
}
export default Progress;
