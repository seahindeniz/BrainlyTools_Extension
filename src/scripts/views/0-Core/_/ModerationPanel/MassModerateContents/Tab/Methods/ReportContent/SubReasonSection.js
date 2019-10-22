import { Select, ContentBoxContent, ContentBox } from "@style-guide";
import SubReason from "./SubReason";

export default class SubReasonSection {
  /**
   * @param {import("./Reason").default} main
   */
  constructor(main) {
    this.main = main;
    this.reason = this.main.details.subcategories;

    this.Render();
    this.BindHandler();
  }
  Render() {
    this.selectContainer = Select({
      options: this.reason.map(reason => {
        let subReason = new SubReason(this, reason);

        return {
          text: reason.text,
          subReason
        }
      })
    });
    this.selectElement = this.selectContainer.querySelector("select");
    this.container = ContentBox({
      children: ContentBoxContent({
        spacedTop: "small",
        spacedBottom: true,
        children: this.selectContainer
      })
    });

    this.Selected();
  }
  BindHandler() {
    this.selectElement.addEventListener("change", this.Selected.bind(this));
  }
  Selected() {
    this.HideSelectedSubReason();
    if (this.selectElement.selectedOptions && this.selectElement.selectedOptions.length > 0) {
      /**
       * @type {SubReason}
       */
      // @ts-ignore
      let subReason = this.selectElement.selectedOptions[0].subReason;

      if (subReason) {
        this.main.selectedSubReason = subReason;

        subReason.ShowInput();
      }
    }
  }
  HideSelectedSubReason() {
    if (this.main.selectedSubReason)
      this.main.selectedSubReason.HideInput();
  }
}
