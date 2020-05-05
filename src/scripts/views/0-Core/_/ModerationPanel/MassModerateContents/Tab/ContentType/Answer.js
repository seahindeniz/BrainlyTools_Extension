import ContentType from ".";

export default class Answer extends ContentType {
  constructor(main) {

    let renderDetails = {
      tabButton: {
        text: System.data.locale.popup.extensionOptions.quickDeleteButtons.answer
      }
    };
    super(main, renderDetails);

    /**
     * @type {"ANSWER"}
     */
    this.is = "ANSWER";
  }
}
