import Tab from "..";
import { ContentBoxContent } from "@style-guide";

export default class Inputs extends Tab {
  /**
   * @param {import("../../index").default} main
   * @param {{tabButton: import("@style-guide/Button").Properties, restrictions?: Object<string, string[]>}} details
   */
  constructor(main, details) {
    super(main, {
      ...details,
      contentContainer: main.inputsContainer,
      buttonsContainer: main.actionListOfInputsSection,
      tabButton: {
        activeType: "link-button-mint",
        container: ContentBoxContent({
          full: true,
          spacedBottom: "small",
          align: "center",
        }),
        props: {
          type: "link-button",
          size: "xsmall",
          ...details.tabButton
        }
      }
    });
    this.value = {};
    /**
     * @type {number[]}
     */
    this._idList = [];
    this.name = "input";
    this.restrictions = details.restrictions;
  }
  set idList(list) {
    this._idList = list;

    this.main.ToggleMethods();
  }
  get idList() {
    return this._idList;
  }
  _Show() {}
  _Hide() {}
  ClearInput() {}
  ShiftIdList() {
    let idList = this.idList;
    this.idList = [];

    this.ClearInput();

    return idList;
  }
}
