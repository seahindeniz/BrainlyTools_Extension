import Input from "../../../../../../../../components/Input";
import {
  ContentBox,
  ContentBoxContent,
  Radio,
  Textarea
} from "../../../../../../../../components/style-guide";
import Build from "../../../../../../../../helpers/Build";
import SubReasonSection from "./SubReasonSection";

/**
 * @typedef {{data?: {type: "text" | "textarea"}}} ReasonData
 * @typedef {{id: number, text: string} & ReasonData} props
 * @typedef {props & {visible: boolean, subcategories?: props[]}} Reason
 */

export default class {
  /**
   * @param {import("./index").default} main
   * @param {Reason} details
   */
  constructor(main, details) {
    this.main = main;
    this.details = details;

    this.main.reasons.push(this);

    /**
     * @type {import("./SubReason").default}
     */
    this.selectedSubReason = undefined;

    this.Render();
    this.BindHandlers();
  }
  Render() {
    this.radioContainer = Radio({
      name: "category_id",
      label: {
        text: this.details.text,
        secondary: true
      }
    });
    this.radio = this.radioContainer.querySelector("input");
    this.container = Build(ContentBox(), [
      [
        ContentBoxContent(),
        this.radioContainer
      ]
    ]);

    if (this.details.data || this.details.subcategories) {
      this.RenderChildSection();

      if (this.details.data)
        this.RenderChild();
      if (this.details.subcategories)
        this.RenderSubReasons();
    }
  }
  RenderChildSection() {
    this.childSection = ContentBoxContent({
      spacedTop: true,
      spacedBottom: true
    });
  }
  RenderChild() {
    this.input = this.CreateInput(this.details.data.type);

    this.childSection.appendChild(this.input);
  }
  /**
   * @param {"text" | "textarea"} type
   */
  CreateInput(type) {
    /**
     * @type {HTMLInputElement | HTMLTextAreaElement}
     */
    let input;

    if (type == "textarea")
      // @ts-ignore
      input = Textarea({
        tag: "textarea",
        placeholder: "..."
      });
    else
      input = Input({
        placeholder: "..."
      });

    return input;
  }
  RenderSubReasons() {
    this.subReasonSection = new SubReasonSection(this);

    this.childSection.appendChild(this.subReasonSection.container);
  }
  BindHandlers() {
    this.radio.addEventListener("change", this.Checked.bind(this), false);
  }
  /**
   * @param {MouseEvent} event
   */
  Checked(event) {
    if (this.main.started) {
      // @ts-ignore
      event.target.checked = false;
      this.main.selectedReason.radio.checked = true;

      return false;
    }

    if (this.main.selectedReason) {
      this.main.selectedReason.HideChildSection();
    }

    this.main.selectedReason = this;
    this.main.abuse.category_id = this.details.id;

    this.main.ShowStartButton();
    this.ShowChildSection();
  }
  ShowChildSection() {
    if (this.childSection)
      this.container.appendChild(this.childSection);
  }
  HideChildSection() {
    if (this.childSection)
      this.main.main.HideElement(this.childSection);
  }
  get text() {
    let text = null;

    if (this.input)
      text = this.input.value;
    else if (this.childSection)
      text = this.selectedSubReason.text;

    return text
  }
  Show() {
    this.main.reasonContainer.appendChild(this.container);
  }
  Hide() {
    this.main.main.HideElement(this.container);
  }
}
