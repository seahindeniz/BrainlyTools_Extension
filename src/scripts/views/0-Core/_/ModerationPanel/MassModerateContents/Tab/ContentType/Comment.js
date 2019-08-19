import ContentType from ".";

let System = require("../../../../../../../helpers/System");

export default class Comment extends ContentType {
  constructor(main) {
    if (typeof System == "function")
      // @ts-ignore
      System = System();

    let renderDetails = {
      tabButton: {
        text: System.data.locale.popup.extensionOptions.quickDeleteButtons.comment
      }
    };
    super(main, renderDetails);

    /**
     * @type {"COMMENT"}
     */
    this.is = "COMMENT";
  }
}
