import ContentType from ".";

let System = require("../../../../../../../helpers/System");

export default class Answer extends ContentType {
  constructor(main) {
    if (typeof System == "function")
      // @ts-ignore
      System = System();

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
