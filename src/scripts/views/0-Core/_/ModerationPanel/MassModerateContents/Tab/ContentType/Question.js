import ContentType from ".";

let System = require("../../../../../../../helpers/System");

export default class Question extends ContentType {
  constructor(main) {
    if (typeof System == "function")
      // @ts-ignore
      System = System();

    let renderDetails = {
      tabButton: {
        text: System.data.locale.popup.extensionOptions.quickDeleteButtons.task
      }
    };
    super(main, renderDetails);

    /**
     * @type {"QUESTION"}
     */
    this.is = "QUESTION";
  }
}
