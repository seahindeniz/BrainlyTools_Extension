import CreateElement from "@/scripts/components/CreateElement";
import { Label, Flex } from "@style-guide";
import { COLORS_DEFAULT_MAP } from "@style-guide/Label";

/**
 * @typedef {{
 *  id?: number,
 *  name?: string,
 * }} SubjectDataType
 */

export default class {
  /**
   * @param {import(".").default} main
   * @param {SubjectDataType} data
   */
  constructor(main, data) {
    this.main = main;
    this.data = data;

    this.RenderOption();
    this.BindListener();
  }

  RenderOption() {
    this.option = CreateElement({
      tag: "option",
      children: this.data.name,
    });

    this.main.select.append(this.option);
  }

  BindListener() {
    this.option.addEventListener("change", this.Selected.bind(this));
  }

  Selected() {
    if (!this.option.selected) return false;

    this.main.selectedSubjects[this.data.id] = this;

    this.ShowLabel();

    return true;
  }

  ShowLabel() {
    if (!this.labelContainer) this.RenderLabel();

    this.main.labelContainer.append(this.labelContainer);
  }

  RenderLabel() {
    const type = !!System.randomNumber(0, 1);
    /**
     * @type {import("@style-guide/Label").LabelColorType[]}
     */
    // @ts-ignore
    const colorKeys = Object.keys(COLORS_DEFAULT_MAP);
    const color = colorKeys[System.randomNumber(0, colorKeys.length - 1)];
    this.labelContainer = Flex({
      marginTop: "xxs",
      direction: "column",
      children: (this.label = Label({
        text: this.data.name,
        type: type ? "strong" : "",
        color,
        onClose: this.HideLabel.bind(this),
      })),
    });
  }

  HideLabel() {
    delete this.main.selectedSubjects[this.data.id];

    this.main.main.FilterReports();
    this.main.main.main.HideElement(this.labelContainer);
  }
}
