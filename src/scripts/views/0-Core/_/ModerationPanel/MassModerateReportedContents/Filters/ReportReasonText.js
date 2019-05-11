import md5 from "js-md5";

class ReportReasonText {
  constructor($target) {
    this.$ = $(`<textarea class="sg-textarea sg-textarea--full-width" placeholder="${System.data.locale.core.massModerateReportedContents.reportReasonText}"></textarea>`);

    this.$.appendTo($target);
  }
  Data() {
    let $textarea = this.$;
    let type = "REPORT_REASON";
    let value = this.CheckValue($textarea.val());

    if (value)
      return {
        type,
        value,
        text: value,
        class: "sg-box--dark sg-text--gray",
        hash: md5(type + "" + value)
      }
  }
  CheckValue(value) {
    this.$.removeClass("sg-input--invalid");

    if (!value) {
      this.$.addClass("sg-input--invalid");
    }

    return value;
  }
}

export default ReportReasonText
