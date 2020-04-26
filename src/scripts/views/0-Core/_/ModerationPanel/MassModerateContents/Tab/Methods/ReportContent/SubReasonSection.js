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
    this.selectComponent = Select({
      options: this.reason.map(reason => {
        const subReason = new SubReason(this, reason);

        return {
          text: reason.text,
          subReason,
        };
      }),
    });
    this.container = ContentBox({
      children: ContentBoxContent({
        spacedTop: "small",
        spacedBottom: true,
        children: this.selectComponent.container,
      }),
    });

    this.Selected();
  }

  BindHandler() {
    this.selectComponent.select.addEventListener(
      "change",
      this.Selected.bind(this),
    );
  }

  Selected() {
    this.HideSelectedSubReason();
    if (
      this.selectComponent.select.selectedOptions &&
      this.selectComponent.select.selectedOptions.length > 0
    ) {
      /**
       * @type {SubReason}
       */
      // @ts-ignore
      const { subReason } = this.selectComponent.select.selectedOptions[0];

      if (subReason) {
        this.main.selectedSubReason = subReason;

        subReason.ShowInput();
      }
    }
  }

  HideSelectedSubReason() {
    if (this.main.selectedSubReason) this.main.selectedSubReason.HideInput();
  }
}
