import ContentType from ".";

export default class Comment extends ContentType {
  constructor(main) {
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
