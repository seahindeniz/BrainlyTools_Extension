import RadioSection from "./RadioSection";

const noop = () => {};

class DeleteSection {
  /**
   * @param {{type: "task"|"response"|"comment", reasons: [], hideReasons: ["task", "response", "comment"], handlers: {contentTypeChange: function, reasonChange: function, subReasonChange: function}, noSpacedTop: boolean}} param0
   */
  constructor({ type, reasons, hideReasons = [], handlers = {}, noSpacedTop = false } = {}) {
    this.type = type;
    this.reasons = reasons;
    this.reasonSections = {};
    this.subReasonSections = {};
    this.hideReasons = hideReasons;
    this.noSpacedTop = noSpacedTop;
    this.handlers = {
      contentTypeChange: noop,
      reasonChange: noop,
      subReasonChange: noop,
      ...handlers
    };
    /**
     * @type {RadioSection}
     */
    this.selectedReasonSection;

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
  /**
   * @param {string} type
   */
  set type(type) {
    if (typeof type == "string") {
      type = type.toLowerCase();

      if (type == "question")
        type = "task";
      if (type == "answer")
        type = "response";
    }

    this._type = type;
  }
  get type() {
    return this._type;
  }
  SetReasons() {
    this.reasons = System.data.Brainly.deleteReasons[this.type];
  }
  Render() {
    this.$ = $(`
		<div class="sg-content-box${this.noSpacedTop ? "" : " sg-content-box--spaced-top"} sg-content-box--spaced-bottom sg-content-box--full">
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
          <label class="sg-actions-list">
            <div class="sg-label__icon sg-actions-list__hole" title="${title}">
              <div class="sg-checkbox">
                <input type="checkbox" class="sg-checkbox__element" id="${id}">
                <label class="sg-checkbox__ghost">
                  <svg class="sg-icon sg-icon--adaptive sg-icon--x10">
                    <use xlink:href="#icon-check"></use>
                  </svg>
                </label>
              </div>
            </div>
            <span class="sg-label__text sg-actions-list__hole">${label}</span>
          </label>
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
    let sectionData = {
      name: "contentType",
      warning: System.data.locale.common.moderating.selectContentType,
      changeHandler: this.ContentTypeRadioChange.bind(this),
      items: []
    };

    ["task", "response", "comment"].forEach(id => {
      if (!this.hideReasons.includes(id))
        sectionData.items.push({
          id,
          label: System.data.locale.popup.extensionOptions.quickDeleteButtons[id]
        });
    })

    this.contentTypeSection = new RadioSection(sectionData);

    this.contentTypeSection.$.appendTo(this.$listSection);
  }
  /**
   * @param {Event} event
   */
  ContentTypeRadioChange(event) {
    this.HideOptions();
    this.ShowContentType();

    this.type = event.target.id;
    let status = this.handlers.contentTypeChange(event);

    if (status === false) {
      this.type = this.lastSelectedContentType;
      let input = $(`#${this.type}`, this.contentTypeSection.$);

      input.prop("checked", true);
      input.change();

      return false;
    }

    this.lastSelectedContentType = this.type;

    this.ShowReasons();
  }
  ShowReasons() {
    this.SetReasons();
    this.UpdateReasonSection();
  }
  ShowContentType() {
    this.type = undefined;
    this.reason = undefined;

    this.HideSections(this.reasonSections);
    this.HideSections(this.subReasonSections);
    this.contentTypeSection.$.appendTo(this.$listSection);
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
    this.handlers.reasonChange(event);
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
    this.handlers.subReasonChange(event);
    let subReasonId = System.ExtractId(event.target.id);
    let subReason = this.reason.subcategories.find(reason => reason.id == subReasonId);

    this.$textarea.val(subReason.text);
  }
  /**
   * @returns {{id: number, category_id: number, text: string, title: string}}
   */
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
