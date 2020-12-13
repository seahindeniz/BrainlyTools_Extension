import type DeleteSectionClassType from "../DeleteSection";
import RadioSection from "./RadioSection";

export default class ReasonSection extends RadioSection {
  constructor(main: DeleteSectionClassType, defaultValue?: string) {
    const { contentType } = main.contentTypeSection;
    const reasonCategories = System.data.Brainly.deleteReasons[contentType];

    super(
      main,
      reasonCategories.map(deleteReason => ({
        text: deleteReason.text,
        value: deleteReason.id,
      })),
      defaultValue,
    );
  }

  get reasonCategories() {
    return System.data.Brainly.deleteReasons[
      this.main.contentTypeSection.contentType
    ];
  }

  Selected() {
    this.main.RenderSubReasonSection();
    this.main.ShowTextarea();
    this.main.ShowOptionsSection();
    this.main.ShowButtonContainer();
    this.main.listeners?.onReasonChange?.();
  }

  Deselected() {
    this.main.HideSubReasonSection();
    this.main.HideTextarea();
    this.main.HideOptionsSection();
    this.main.HideButtonContainer();
    this.main.listeners?.onReasonChange?.();
  }
}
