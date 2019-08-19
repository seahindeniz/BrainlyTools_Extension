import { ContentBoxContent } from "../../../../../../../../components/style-guide";

export default class SubReason {
  /**
   *
   * @param {import("./SubReasonSection").default} main
   * @param {import("./Reason").props} details
   */
  constructor(main, details) {
    this.main = main;
    this.details = details;

    if (details.data)
      this.Render();
  }
  Render() {
    this.input = this.main.main.CreateInput(this.details.data.type);
    this.inputContainer = ContentBoxContent({
      children: this.input
    })
  }
  get text() {
    let text = null;

    if (this.input)
      text = this.input.value;

    return text;
  }
  ShowInput() {
    if (this.inputContainer)
      this.main.container.appendChild(this.inputContainer);
  }
  HideInput() {
    if (this.inputContainer)
      this.main.main.main.main.HideElement(this.inputContainer);
  }
}
