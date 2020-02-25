import ContentType from ".";

export default class Question extends ContentType {
  constructor(main) {
    let renderDetails = {
      tabButton: {
        text: System.data.locale.popup.extensionOptions.quickDeleteButtons.question
      }
    };
    super(main, renderDetails);

    /**
     * @type {"QUESTION"}
     */
    this.is = "QUESTION";
  }
}
