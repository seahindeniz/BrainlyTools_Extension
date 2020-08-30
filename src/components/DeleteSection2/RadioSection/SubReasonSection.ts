/* eslint-disable no-underscore-dangle */
import type DeleteSectionClassType from "../DeleteSection";
import RadioSection from "./RadioSection";

export default class SubReasonSection extends RadioSection {
  constructor(main: DeleteSectionClassType, defaultValue?: string) {
    const { reasonCategories } = main.reasonSection;
    const value = Number(main.reasonSection.value);
    const reasonCategory = reasonCategories.find(
      category => category.id === value,
    );

    super(
      main,
      reasonCategory.subcategories.map(subDeleteReason => {
        return {
          text: subDeleteReason.title || subDeleteReason.text,
          value: subDeleteReason.id,
        };
      }),
      defaultValue,
    );
  }

  get deleteReason() {
    return System.data.Brainly.deleteReasons.__withIds.__all[
      Number(this.value)
    ];
  }

  Selected() {
    this.main.listeners?.onSubReasonChange?.();
    // this.main.RenderSubReasonSection();
    console.log(this.deleteReason);

    this.main.textarea.value = this.deleteReason.text;
  }
}
