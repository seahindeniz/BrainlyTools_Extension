import QuickDeleteButtons from "../../1-Home/_/QuickDeleteButtons";

class QuestionBox {
	constructor(box, id) {
		this.$ = $(box);
		this.id = id;

		if (System.checkUserP(1))
			this.quickDeleteButtons = new QuickDeleteButtons(this.$);

		if (System.checkUserP(14)) {
			this.RenderSelectBox();
			this.ShowSelectbox();
			this.RenderSpinner();
		}
	}
	RenderSelectBox() {
		this.$selectBox = $(`
    <div class="sg-actions-list__hole">
      <div class="sg-spinner-container">
        <div class="sg-label sg-label--secondary">
          <div class="sg-label__icon">
            <div class="sg-checkbox">
              <input type="checkbox" class="sg-checkbox__element" id="q-${this.id}">
              <label class="sg-checkbox__ghost" for="q-${this.id}">
                <div class="sg-icon sg-icon--adaptive sg-icon--x10">
                  <svg class="sg-icon__svg">
                    <use xlink:href="#icon-check"></use>
                  </svg>
                </div>
              </label>
            </div>
          </div>
          <label class="sg-label__text" for="q-${this.id}">${System.data.locale.common.select}</label>
        </div>
      </div>
    </div>`);

		this.$checkBox = $("input", this.$selectBox);
		this.$spinnerContainer = $(".sg-spinner-container", this.$selectBox);
	}
	ShowSelectbox() {
		if (System.checkUserP(14)) {
			let $seeAnswerLinkContainer = $(".sg-content-box__actions > .sg-actions-list", this.$);

			this.$selectBox.prependTo($seeAnswerLinkContainer);
		}
	}
	RenderSpinner() {
		this.$spinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--small"></div>
    </div>`);
	}
	ShowSpinner() {
		this.$spinner.appendTo(this.$spinnerContainer);
	}
	HideSpinner() {
		this.$spinner.appendTo("<div />");
	}
	ShowQuickDeleteButtons() {
		if (System.checkUserP(1)) {
			this.quickDeleteButtons.target = this.$;

			this.quickDeleteButtons.ShowContainer();
		}
	}
}

export default QuestionBox
