import md5 from "js-md5";

class ContentType {
  constructor($target) {
    this.$ = $(`
		<div class="sg-select sg-select--full-width">
			<div class="sg-select__icon"></div>
			<select class="sg-select__element">
				<option selected value="">${System.data.locale.core.massModerateReportedContents.selectAFilter}</option>
				<option value="QUESTION">${System.data.locale.popup.extensionOptions.quickDeleteButtons.task}</option>
				<option value="ANSWER">${System.data.locale.popup.extensionOptions.quickDeleteButtons.response}</option>
			</select>
    </div>`);

    this.$select = $("select", this.$);

    this.$.appendTo($target);
  }
  Data() {
    let $selectedFilter = $(`option:selected:not([value=""])`, this.$);
    let type = "CONTENT_TYPE";
    let value = this.CheckValue($selectedFilter.val());

    return $selectedFilter.length > 0 && {
      type,
      value,
      hash: md5(type + "" + value),
      text: $selectedFilter.text(),
      class: "sg-box--peach sg-text--white"
    }
  }
  CheckValue(value) {
    this.$.removeClass("sg-select--invalid");

    if (!value) {
      this.$.addClass("sg-select--invalid");
    }

    return value;
  }
}

export default ContentType
