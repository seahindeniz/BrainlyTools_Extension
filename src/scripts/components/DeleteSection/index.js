import RadioSection from "./RadioSection";

class DeleteSection {
  /**
   * @param {string} type
   * @param {[]} reasons
   */
  constructor(type, reasons) {
    this.type = type;
    this.reasons = reasons;
    this.reasonSections = {};
    this.subReasonSections = {};

    if (this.type && !this.reasons)
      this.SetReasons();

    this.Render();
    this.RenderTakePoints();
    this.RenderReturnPoints();
    this.RenderGiveWarning();

    if (!this.type) {
      this.RenderContentTypeSection();
    } else {
      this.UpdateReasonSection();
    }
  }
  SetReasons() {
    this.reasons = System.data.Brainly.deleteReasons[this.type];
  }
  Render() {
    this.$ = $(`
		<div class="sg-content-box sg-content-box--spaced-top-large sg-content-box--spaced-bottom sg-content-box--full">
      <div class="sg-content-box__actions">
        <div class="sg-content-box sg-content-box--full"></div>
      </div>
			<div class="sg-content-box__actions">
				<textarea class="sg-textarea sg-text--small sg-textarea--invalid sg-textarea--full-width"></textarea>
			</div>
      <div class="sg-content-box__actions">
        <div class="sg-actions-list"></div>
      </div>
    </div>`);

    this.$textarea = $('textarea', this.$);
    this.$listSection = $("> .sg-content-box__actions:eq(0) > .sg-content-box", this.$);
    this.$optionsSection = $(".sg-content-box__actions:eq(2) > .sg-actions-list", this.$);
  }
  RenderTakePoints() {
    this.$takePointsContainer = this.RenderOption("take_points");
    this.$takePointsSeparator = this.RenderHoleSeparator();

    this.$takePointsTitle = $(".sg-label__icon", this.$takePointsContainer);
    this.$takePointsLabel = $(".sg-label__text", this.$takePointsContainer);
    this.$takePoints = $("input", this.$takePointsContainer);
  }
  RenderOption(id, label, title) {
    return $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--no-spacing">
      <div class="sg-text sg-text--bold">
        <div class="sg-label sg-label--secondary" >
          <div class="sg-label__icon" title="${title}">
            <div class="sg-checkbox">
              <input type="checkbox" class="sg-checkbox__element" id="${id}">
              <label class="sg-checkbox__ghost" for="${id}">
              <svg class="sg-icon sg-icon--adaptive sg-icon--x10">
                <use xlink:href="#icon-check"></use>
              </svg>
              </label>
            </div>
          </div>
          <label class="sg-label__text" for="${id}">${label}</label>
        </div>
      </div>
    </div>`);
  }
  RenderHoleSeparator() {
    return $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--stretch sg-actions-list__hole--no-spacing">
      <div class="sg-vertical-separator sg-vertical-separator--full"></div>
    </div>`);
  }
  RenderReturnPoints() {
    this.$returnPointsContainer = this.RenderOption("return_points", System.data.locale.common.moderating.returnPoints.text, System.data.locale.common.moderating.returnPoints.title);
    this.$returnPointsSeparator = this.RenderHoleSeparator();
    this.$returnPoints = $("input", this.$returnPointsContainer);
  }
  RenderGiveWarning() {
    this.$giveWarningContainer = this.RenderOption("give_warning", System.data.locale.common.moderating.giveWarning.text, System.data.locale.common.moderating.giveWarning.title);
    this.$giveWarning = $("input", this.$giveWarningContainer);
  }
  RenderContentTypeSection() {
    this.contentTypeSection = new RadioSection({
      name: "contentType",
      warning: System.data.locale.common.moderating.selectContentType,
      changeHandler: this.ContentTypeRadioChange.bind(this),
      items: [{
          id: "task",
          label: System.data.locale.popup.extensionOptions.quickDeleteButtons.task
        },
        {
          id: "response",
          label: System.data.locale.popup.extensionOptions.quickDeleteButtons.response
        },
        {
          id: "comment",
          label: System.data.locale.popup.extensionOptions.quickDeleteButtons.comment
        }
      ]
    });

    this.contentTypeSection.$.appendTo(this.$listSection);
  }
  /**
   * @param {Event} event
   */
  ContentTypeRadioChange(event) {
    this.HideSections(this.reasonSections);
    this.HideSections(this.subReasonSections);

    this.type = event.target.id;
    this.reason = undefined;

    this.SetReasons();
    this.UpdateReasonSection();
  }
  HideSections(sections) {
    $.each(sections, (key, section) => section.Hide())
  }
  UpdateReasonSection() {
    this.ShowOptions();

    let reasonSection = this.reasonSections[this.type];

    if (!reasonSection) {
      reasonSection = this.reasonSections[this.type] = new RadioSection({
        name: "reason",
        warning: System.data.locale.common.moderating.selectReason,
        items: this.reasons.map(reason => {
          return {
            id: `r-${reason.id}`,
            label: reason.title || reason.text
          }
        }),
        changeHandler: this.ReasonRadioChange.bind(this)
      });
    }

    this.selectedReasonSection = reasonSection;

    reasonSection.$.appendTo(this.$listSection);
  }
  HideOptions() {
    this.HideTakePoints();
    this.HideReturnPoints();
    this.HideGiveWarning();
  }
  ShowOptions() {
    this.HideOptions();

    if (this.type == "task") {
      this.ShowTakePoints();
      this.ShowReturnPoints();
      this.ShowGiveWarning();
    } else if (this.type == "response") {
      this.ShowTakePoints();
      this.ShowGiveWarning();
    } else if (this.type == "comment") {
      this.ShowGiveWarning();
    }
  }
  HideTakePoints() {
    this.HideElement(this.$takePointsContainer);
    this.HideElement(this.$takePointsSeparator);
  }
  HideReturnPoints() {
    this.HideElement(this.$returnPointsContainer);
    this.HideElement(this.$returnPointsSeparator);
  }
  HideGiveWarning() {
    this.HideElement(this.$giveWarningContainer);
  }
  HideElement($element) {
    $element.appendTo("<div />");
  }
  ShowTakePoints() {
    this.$takePointsContainer.appendTo(this.$optionsSection);
    this.$takePointsSeparator.appendTo(this.$optionsSection);
    this.$takePointsLabel.text(System.data.locale.common.moderating.takePoints[this.type].text);
    this.$takePointsTitle.attr("title", System.data.locale.common.moderating.takePoints[this.type].title);
  }
  ShowReturnPoints() {
    this.$returnPointsContainer.appendTo(this.$optionsSection);
    this.$returnPointsSeparator.appendTo(this.$optionsSection);
  }
  ShowGiveWarning() {
    this.$giveWarningContainer.appendTo(this.$optionsSection);
  }
  /**
   * @param {Event} event
   */
  ReasonRadioChange(event) {
    this.HideSections(this.subReasonSections);

    let reasonId = System.ExtractId(event.target.id);
    this.reason = this.reasons.find(reason => reason.id == reasonId);
    let subReasonSection = this.subReasonSections[reasonId];

    if (!subReasonSection) {
      subReasonSection = this.subReasonSections[reasonId] = new RadioSection({
        name: "subReason",
        items: this.reason.subcategories.map(reason => {
          return {
            id: `sr-${reason.id}`,
            label: reason.title || reason.text
          }
        }),
        changeHandler: this.SubReasonRadioChange.bind(this)
      });
    }

    subReasonSection.$.appendTo(this.$listSection);
  }
  /**
   * @param {Event} event
   */
  SubReasonRadioChange(event) {
    let subReasonId = System.ExtractId(event.target.id);
    let subReason = this.reason.subcategories.find(reason => reason.id == subReasonId);

    this.$textarea.val(subReason.text);
  }
  get selectedReason() {
    if (!this.type)
      this.contentTypeSection.ShowWarning();
    else if (!this.reason)
      this.selectedReasonSection.ShowWarning();
    else
      return this.reason;
  }
  get reasonText() {
    return this.$textarea.val();
  }
  get takePoints() {
    if (this.$takePoints.is(":visible"))
      return this.$takePoints.is(':checked');
  }
  get returnPoints() {
    if (this.$returnPoints.is(":visible"))
      return this.$returnPoints.is(':checked');
  }
  get giveWarning() {
    return this.$giveWarning.is(':checked');
  }
}

export default DeleteSection
