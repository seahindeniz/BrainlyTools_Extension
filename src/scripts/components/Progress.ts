type ProgressTypeType = "loading" | "success" | "warning" | "danger";

type ProgressPropsType = {
  type: ProgressTypeType;
  max: number;
  label: string;
  fullWidth?: boolean;
};

class Progress {
  type: ProgressTypeType;
  max: number;
  label: string;

  $container: JQuery<HTMLElement>;
  $bar: JQuery<HTMLElement>;

  constructor({ type, max, label, fullWidth }: ProgressPropsType) {
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

    this.$container.on("click", this.forceClose.bind(this));

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
    setTimeout(this.forceClose.bind(this), 3000);
  }

  forceClose(ignoreValue?: boolean) {
    if (ignoreValue || this.$bar.val() === ~~this.$bar.attr("max")) {
      this.$container.remove();
    }
  }

  ChangeType(type?: ProgressTypeType) {
    this.$bar.removeClass(this.type ? `is-${this.type}` : "");

    if (type) this.$bar.addClass(`is-${type}`);

    this.type = type;
  }
}
export default Progress;
