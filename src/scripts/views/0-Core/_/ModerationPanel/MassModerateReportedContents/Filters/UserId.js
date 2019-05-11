import md5 from "js-md5";

class UserId {
  constructor($target, type) {
    this.type = type;
    this.$ = $(`<input type="text" class="sg-input sg-input--small sg-input--full-width" placeholder="${System.data.locale.core.massModerateReportedContents.profileId[type]}">`);

    this.$.appendTo($target);
  }
  Data() {
    let type = this.type;
    let value = System.ExtractId(this.CheckValue(this.$.val()));

    if (value) {
      let data = {
        type,
        value,
        text: value,
        hash: md5(type + "" + value)
      };

      if (this.type == "REPORTER")
        data.class = "sg-box--mint sg-text--white";
      if (this.type == "REPORTEE")
        data.class = "sg-box--blue-secondary sg-text--gray";

      return data
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

export default UserId
