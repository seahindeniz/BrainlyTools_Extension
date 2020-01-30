import Build from "../../helpers/Build";
import {
  Checkbox,
  ContentBox,
  ContentBoxActions,
  Flex,
  SeparatorVertical,
  Text,
  Textarea
} from "../style-guide";
import RadioSection from "./RadioSection";

const noop = (...params) => {};

class DeleteSection {
  /**
   * @param {{
   *  type?: "task"|"response"|"comment",
   *  reasons?: *[],
   *  hideReasons?: ("task" | "response" | "comment" | string)[],
   *  handlers?: {
   *    contentTypeChange?: function,
   *    reasonChange?: function,
   *    subReasonChange?: function
   *  },
   *  noSpacedTop?: boolean
   * }} param0
   */
  constructor({
    type,
    reasons,
    hideReasons = [],
    handlers = {},
    noSpacedTop =
    false
  } = {}) {
    this.type = type;
    this.reasons = reasons;
    /**
     * @type {{[x: string]: RadioSection}}
     */
    this.reasonSections = {};
    /**
     * @type {{[x: string]: RadioSection}}
     */
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
    this.container = Build(ContentBox({
      spacedTop: !this.noSpacedTop,
      spacedBottom: true,
      full: true
    }), [
      [
        ContentBoxActions(),
        ContentBox({ full: true })
      ],
      [
        ContentBoxActions(),
        Textarea({
          tag: "textarea",
          invalid: true,
          fullWidth: true,
          className: "sg-text--small"
        })
      ],
      [
        ContentBoxActions(),
        this.optionsSection = Flex(),
      ],
    ]);
    this.$ = $(this.container);

    this.$textarea = $('textarea', this.$);
    this.$listSection = $(
      "> .sg-content-box__actions:eq(0) > .sg-content-box", this.$);
  }
  RenderTakePoints() {
    let takePointsLocale =
      System.data.locale.common.moderating.takePoints[this.type || "task"];
    this.$takePointsContainer = this.RenderOption(
      "take_points",
      takePointsLocale.text,
      takePointsLocale.title
    );
    this.takePointsSeparator = this.RenderHoleSeparator();

    this.$takePointsTitle = $(".sg-label__icon", this.$takePointsContainer);
    this.$takePointsLabel = $(".sg-label__text", this.$takePointsContainer);
    this.$takePoints = $("input", this.$takePointsContainer);
  }
  RenderOption(id, label, title) {
    let option = Build(Flex(), [
      [
        Flex({ marginRight: "xs", }),
        Checkbox({ id: id, }),
      ],
      [
        Flex(),
        Text({
          tag: "label",
          htmlFor: id,
          html: label,
          weight: "bold",
          size: "xsmall",
          title: title,
        })
      ],
    ]);
    /* let $checkboxGhost = $(".sg-checkbox__ghost", $option);
    let icon = Icon({
      type: "check",
      color: "adaptive"
    });

    $checkboxGhost.append(icon); */

    return $(option);
  }
  RenderHoleSeparator() {
    return Flex({
      children: SeparatorVertical({
        size: "full",
      }),
    });
  }
  RenderReturnPoints() {
    this.$returnPointsContainer = this.RenderOption("return_points", System
      .data.locale.common.moderating.returnPoints.text, System.data.locale
      .common.moderating.returnPoints.title);
    this.returnPointsSeparator = this.RenderHoleSeparator();
    this.$returnPoints = $("input", this.$returnPointsContainer);
  }
  RenderGiveWarning() {
    this.$giveWarningContainer = this.RenderOption("give_warning", System.data
      .locale.common.moderating.giveWarning.text, System.data.locale.common
      .moderating.giveWarning.title);
    this.$giveWarning = $("input", this.$giveWarningContainer);
  }
  RenderContentTypeSection() {
    let sectionData = {
      name: "contentType",
      text: System.data.locale.core.MassModerateContents.contentType,
      warning: System.data.locale.common.moderating.selectContentType,
      changeHandler: this.ContentTypeRadioChange.bind(this),
      items: []
    };

    ["task", "response", "comment"].forEach(type => {
      if (!this.hideReasons.includes(type))
        sectionData.items.push({
          id: type,
          label: System.data.locale.popup.extensionOptions
            .quickDeleteButtons[type]
        });
    })

    this.contentTypeSection = new RadioSection(sectionData);

    this.$listSection.append(this.contentTypeSection.container)
  }
  /**
   * @param {Event} event
   */
  ContentTypeRadioChange(event) {
    this.HideOptions();
    this.ShowContentType();

    if (event.target instanceof HTMLElement)
      this.type = event.target.id;

    let status = this.handlers.contentTypeChange(event);

    if (status === false) {
      this.type = this.lastSelectedContentType;
      let input = $(`#${this.type}`, this.contentTypeSection.container);

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
    this.$listSection.append(this.contentTypeSection.container);
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
        text: System.data.locale.core.MassContentDeleter.select["reason"],
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

    this.$listSection.append(reasonSection.container);
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
    this.HideElement(this.takePointsSeparator);
  }
  HideReturnPoints() {
    this.HideElement(this.$returnPointsContainer);
    this.HideElement(this.returnPointsSeparator);
  }
  HideGiveWarning() {
    this.HideElement(this.$giveWarningContainer);
  }
  /**
   * @param {HTMLElement | JQuery<HTMLElement>} $element
   */
  HideElement($element) {
    if ($element) {
      if ($element instanceof HTMLElement) {
        if ($element.parentElement)
          $element.parentElement.removeChild($element);
      } else
        $element.detach();
    }
  }
  ShowTakePoints() {
    this.$takePointsContainer.appendTo(this.optionsSection);
    this.optionsSection.append(this.takePointsSeparator);
    this.$takePointsLabel.text(System.data.locale.common.moderating
      .takePoints[this.type].text);
    this.$takePointsTitle.attr("title", System.data.locale.common.moderating
      .takePoints[this.type].title);
  }
  ShowReturnPoints() {
    this.$returnPointsContainer.appendTo(this.optionsSection);
    this.optionsSection.append(this.returnPointsSeparator);
  }
  ShowGiveWarning() {
    this.$giveWarningContainer.appendTo(this.optionsSection);
  }
  /**
   * @param {Event} event
   */
  ReasonRadioChange(event) {
    this.handlers.reasonChange(event);
    this.HideSections(this.subReasonSections);

    if (event.target instanceof HTMLElement) {
      let reasonId = System.ExtractId(event.target.id);
      this.reason = this.reasons.find(reason => reason.id == reasonId);
      let subReasonSection = this.subReasonSections[reasonId];

      if (!subReasonSection) {
        subReasonSection = this.subReasonSections[reasonId] =
          new RadioSection({
            name: "subReason",
            text: System.data.locale.core.MassContentDeleter.select[
              "subReason"],
            items: this.reason.subcategories.map(reason => {
              return {
                id: `sr-${reason.id}`,
                label: reason.title || reason.text
              }
            }),
            changeHandler: this.SubReasonRadioChange.bind(this)
          });
      }

      this.$listSection.append(subReasonSection.container);
    }
  }
  /**
   * @param {Event} event
   */
  SubReasonRadioChange(event) {
    this.handlers.subReasonChange(event);

    if (event.target instanceof HTMLElement) {
      let subReasonId = System.ExtractId(event.target.id);
      let subReason = this.reason.subcategories.find(reason => reason.id ==
        subReasonId);

      this.$textarea.val(subReason.text);
    }
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
    return String(this.$textarea.val());
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
