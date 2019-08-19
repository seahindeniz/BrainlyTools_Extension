import Tab from "..";
import { ActionListHole } from "../../../../../../../components/style-guide";

export default class ContentType extends Tab {
  /**
   * @param {import("../../index").default} main
   * @param {{tabButton: import("../../../../../../../components/style-guide/Button").Properties}} details
   */
  constructor(main, details) {
    super(main, {
      ...details,
      buttonsContainer: main.$contentTypesList,
      tabButton: {
        activeType: "primary-blue",
        container: ActionListHole(),
        props: {
          type: "secondary",
          size: "small",
          ...details.tabButton
        }
      }
    });
    /**
     * @type {string}
     */
    this.is;
    this.name = "contentType";
    this.deletedContents = [123];
    this.contentsToDelete = [];
    this.deletedContentCount = 0;
  }
  Selected(previousActive) {}
  _Show() {
    this.main.TriggerInputs();
    this.main.TriggerMethods();
  }
  _Hide() {
    this.main.HideInputs();
    this.main.HideMethods();
  }
}
