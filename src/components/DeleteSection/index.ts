/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import {
  DeleteReasonCategoryType,
  DeleteReasonSubCategoryType,
} from "@root/controllers/System";
import Build from "@root/helpers/Build";
import {
  Checkbox,
  ContentBox,
  ContentBoxActions,
  Flex,
  SeparatorVertical,
  Text,
  Textarea,
} from "../style-guide";
import RadioSection from "./RadioSection";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function HideSections(sections: ReasonSections) {
  $.each(sections, (key, section) => section.Hide());
}

type ContentTypeType =
  | "question"
  | "answer"
  | "comment"
  | "Question"
  | "Answer"
  | "Comment";

type HandlersType = {
  contentTypeChange?: (event: Event) => boolean;
  reasonChange?: (event: Event) => boolean;
  subReasonChange?: (event: Event) => boolean;
};

type DeleteSectionPropsType = {
  type?: ContentTypeType;
  reasons?: any[];
  hideReasons?: ContentTypeType[];
  handlers?: HandlersType;
  noSpacedTop?: boolean;
  verticalOptions?: boolean;
};

type ReasonSections = {
  [x: string]: RadioSection;
};

class DeleteSection {
  reasons: (DeleteReasonCategoryType | DeleteReasonSubCategoryType)[];
  reason: DeleteReasonCategoryType | DeleteReasonSubCategoryType;
  reasonSections: ReasonSections;
  subReasonSections: ReasonSections;
  hideReasons: ContentTypeType[];
  noSpacedTop?: boolean;
  verticalOptions?: boolean;
  handlers: HandlersType;

  selectedReasonSection: RadioSection;

  #type: string;
  lastSelectedContentType: string;

  // reason: any;

  container: HTMLElement;
  optionsSection: HTMLElement;
  $: JQuery<HTMLElement>;
  $textarea: JQuery<HTMLElement>;
  $listSection: JQuery<HTMLElement>;
  $takePointsContainer: JQuery<HTMLElement>;
  $takePointsTitle: JQuery<HTMLElement>;
  $takePointsLabel: JQuery<HTMLElement>;
  $takePoints: JQuery<HTMLElement>;
  $returnPointsContainer: JQuery<HTMLElement>;
  $returnPoints: JQuery<HTMLElement>;
  $giveWarningContainer: JQuery<HTMLElement>;
  $giveWarning: JQuery<HTMLElement>;

  contentTypeSection: RadioSection;

  constructor({
    type,
    reasons,
    hideReasons = [],
    handlers = {},
    noSpacedTop = false,
    verticalOptions,
  }: DeleteSectionPropsType = {}) {
    this.type = type;
    this.reasons = reasons;
    this.reasonSections = {};
    this.subReasonSections = {};
    this.hideReasons = hideReasons;
    this.noSpacedTop = noSpacedTop;
    this.verticalOptions = verticalOptions;
    this.handlers = {
      // @ts-expect-error
      contentTypeChange: noop,
      // @ts-expect-error
      reasonChange: noop,
      // @ts-expect-error
      subReasonChange: noop,
      ...handlers,
    };

    if (this.type && !this.reasons) this.SetReasons();

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

  set type(type: string) {
    if (typeof type === "string") type = type.toLowerCase();

    this.#type = type;
  }

  get type() {
    return this.#type;
  }

  SetReasons() {
    this.reasons = System.data.Brainly.deleteReasons[this.type];
  }

  Render() {
    this.container = Build(
      ContentBox({
        spacedTop: !this.noSpacedTop,
        spacedBottom: true,
        full: true,
      }),
      [
        [ContentBoxActions(), ContentBox({ full: true })],
        [
          ContentBoxActions(),
          Textarea({
            tag: "textarea",
            invalid: true,
            fullWidth: true,
            className: "sg-text--small",
          }),
        ],
        [
          ContentBoxActions(),
          (this.optionsSection = Flex({
            direction: this.verticalOptions ? "column" : "",
          })),
        ],
      ],
    );
    this.$ = $(this.container);

    this.$textarea = $("textarea", this.$);
    this.$listSection = $(
      "> .sg-content-box__actions:eq(0) > .sg-content-box",
      this.$,
    );
  }

  RenderTakePoints() {
    const takePointsLocale =
      System.data.locale.common.moderating.takePoints[this.type || "question"];

    if (takePointsLocale) {
      this.$takePointsContainer = this.RenderOption(
        "take_points",
        takePointsLocale.text,
        takePointsLocale.title,
      );

      if (!this.verticalOptions)
        this.$takePointsContainer.append(this.RenderHoleSeparator());

      this.$takePointsTitle = $(".sg-label__icon", this.$takePointsContainer);
      this.$takePointsLabel = $(".sg-label__text", this.$takePointsContainer);
      this.$takePoints = $("input", this.$takePointsContainer);
    }
  }

  RenderOption(id, label, title) {
    const option = Build(
      Flex({
        marginTop: this.verticalOptions ? "xs" : "",
      }),
      [
        [Flex({ marginRight: "xs" }), Checkbox({ id })],
        [
          Flex(),
          Text({
            tag: "label",
            htmlFor: id,
            html: label,
            weight: "bold",
            size: "xsmall",
            title,
          }),
        ],
      ],
    );
    /* let $checkboxGhost = $(".sg-checkbox__ghost", $option);
    let icon = Icon({
      type: "check",
      color: "adaptive"
    });

    $checkboxGhost.append(icon); */

    return $(option);
  }

  // eslint-disable-next-line class-methods-use-this
  RenderHoleSeparator() {
    return Flex({
      children: SeparatorVertical({
        size: "full",
      }),
    });
  }

  RenderReturnPoints() {
    this.$returnPointsContainer = this.RenderOption(
      "return_points",
      System.data.locale.common.moderating.returnPoints.text,
      System.data.locale.common.moderating.returnPoints.title,
    );

    this.$returnPoints = $("input", this.$returnPointsContainer);

    if (!this.verticalOptions) {
      this.$returnPointsContainer.append(this.RenderHoleSeparator());
    }
  }

  RenderGiveWarning() {
    this.$giveWarningContainer = this.RenderOption(
      "give_warning",
      System.data.locale.common.moderating.giveWarning.text,
      System.data.locale.common.moderating.giveWarning.title,
    );
    this.$giveWarning = $("input", this.$giveWarningContainer);
  }

  RenderContentTypeSection() {
    const sectionData = {
      name: "contentType",
      text: System.data.locale.core.MassModerateContents.contentType,
      warning: System.data.locale.common.moderating.selectContentType,
      changeHandler: this.ContentTypeRadioChange.bind(this),
      items: [],
      verticalOptions: this.verticalOptions,
    };

    ["question", "answer", "comment"].forEach((type: ContentTypeType) => {
      if (!this.hideReasons.includes(type))
        sectionData.items.push({
          id: type,
          label:
            System.data.locale.popup.extensionOptions.quickDeleteButtons[type],
        });
    });

    this.contentTypeSection = new RadioSection(sectionData);

    this.$listSection.append(this.contentTypeSection.container);
  }

  ContentTypeRadioChange(event: Event) {
    this.HideOptions();
    this.ShowContentType();

    if (event.target instanceof HTMLElement) this.type = event.target.id;

    const status = this.handlers.contentTypeChange(event);

    if (status === false) {
      this.type = this.lastSelectedContentType;
      const input = $(`#${this.type}`, this.contentTypeSection.container);

      input.prop("checked", true);
      input.trigger("change");

      return false;
    }

    this.lastSelectedContentType = this.type;

    this.ShowReasons();

    return true;
  }

  ShowReasons() {
    this.SetReasons();
    this.UpdateReasonSection();
  }

  ShowContentType() {
    this.type = undefined;
    this.reason = undefined;

    HideSections(this.reasonSections);
    HideSections(this.subReasonSections);
    this.$listSection.append(this.contentTypeSection.container);
  }

  UpdateReasonSection() {
    this.ShowOptions();

    let reasonSection = this.reasonSections[this.type];

    if (!reasonSection) {
      reasonSection = new RadioSection({
        name: "reason",
        verticalOptions: this.verticalOptions,
        text: System.data.locale.core.MassContentDeleter.select.reason,
        warning: System.data.locale.common.moderating.selectReason,
        items: this.reasons.map(reason => {
          return {
            id: `r-${reason.id}`,
            // @ts-expect-error
            label: reason.title || reason.text,
          };
        }),
        changeHandler: this.ReasonRadioChange.bind(this),
      });
      this.reasonSections[this.type] = reasonSection;
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

    if (this.type === "question") {
      this.ShowTakePoints();
      this.ShowReturnPoints();
      this.ShowGiveWarning();
    } else if (this.type === "answer") {
      this.ShowTakePoints();
      this.ShowGiveWarning();
    } else if (this.type === "comment") {
      this.ShowGiveWarning();
    }
  }

  HideTakePoints() {
    this.HideElement(this.$takePointsContainer);
  }

  HideReturnPoints() {
    this.HideElement(this.$returnPointsContainer);
  }

  HideGiveWarning() {
    this.HideElement(this.$giveWarningContainer);
  }

  // eslint-disable-next-line class-methods-use-this
  HideElement($element: HTMLElement | JQuery<HTMLElement>) {
    if ($element) {
      if ($element instanceof HTMLElement) {
        if ($element.parentElement)
          $element.parentElement.removeChild($element);
      } else $element.detach();
    }
  }

  ShowTakePoints() {
    this.$takePointsContainer.appendTo(this.optionsSection);
    this.$takePointsLabel.text(
      System.data.locale.common.moderating.takePoints[this.type].text,
    );
    this.$takePointsTitle.attr(
      "title",
      System.data.locale.common.moderating.takePoints[this.type].title,
    );
  }

  ShowReturnPoints() {
    this.$returnPointsContainer.appendTo(this.optionsSection);
  }

  ShowGiveWarning() {
    this.$giveWarningContainer.appendTo(this.optionsSection);
  }

  ReasonRadioChange(event: Event) {
    this.handlers.reasonChange(event);
    HideSections(this.subReasonSections);

    if (event.target instanceof HTMLElement) {
      const reasonId = System.ExtractId(event.target.id);
      this.reason = this.reasons.find(reason => reason.id === reasonId);
      let subReasonSection = this.subReasonSections[reasonId];

      if (!subReasonSection) {
        subReasonSection = new RadioSection({
          name: "subReason",
          verticalOptions: this.verticalOptions,
          text: System.data.locale.core.MassContentDeleter.select.subReason,
          // @ts-expect-error
          items: this.reason.subcategories.map(reason => {
            return {
              id: `sr-${reason.id}`,
              label: reason.title || reason.text,
            };
          }),
          changeHandler: this.SubReasonRadioChange.bind(this),
        });
        this.subReasonSections[reasonId] = subReasonSection;
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
      const subReasonId = System.ExtractId(event.target.id);
      // @ts-expect-error
      const subReason = this.reason.subcategories.find(
        reason => reason.id === subReasonId,
      );

      this.$textarea.val(subReason.text);
    }
  }

  get selectedReason() {
    if (!this.type) {
      this.contentTypeSection.ShowWarning();

      return undefined;
    }

    if (!this.reason) {
      this.selectedReasonSection.ShowWarning();

      return undefined;
    }

    return this.reason;
  }

  get reasonText() {
    return String(this.$textarea.val());
  }

  get takePoints() {
    if (!this.$takePoints.is(":visible")) return false;

    return this.$takePoints.is(":checked");
  }

  get returnPoints() {
    if (!this.$returnPoints.is(":visible")) return false;

    return this.$returnPoints.is(":checked");
  }

  get giveWarning() {
    return this.$giveWarning.is(":checked");
  }
}

export default DeleteSection;
