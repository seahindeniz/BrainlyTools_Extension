import Filter from "..";
import Type from "./Type";

export default class ContentType extends Filter {
  /**
   * @param {import("../..").default} main
   */
  constructor(main) {
    super(main, "ContentType");

    this.contentTypes = {
      1: new Type(this, { name: "Question", buttonType: "solid-blue" }),
      2: new Type(this, { name: "Answer", buttonType: "solid-mint" }),
    };
  }

  /**
   * @param {import("../../../Report").default} report
   */
  CheckReport(report) {
    return (
      this.contentTypes[report.data.model_type_id].selected || !this.IsUsed()
    );
  }

  IsUsed() {
    return this.contentTypes[1].selected || this.contentTypes[2].selected;
  }
}
