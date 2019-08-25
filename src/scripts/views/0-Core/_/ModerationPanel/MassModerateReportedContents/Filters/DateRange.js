import moment from "moment-timezone";
import md5 from "js-md5";

class DateRange {
  constructor($target, type) {
    this.type = type;
    this.$date1 = $(`<input type="date" class="sg-input sg-input--small sg-input--full-width" />`);
    this.$date2 = $(`<input type="date" class="sg-input sg-input--small sg-input--full-width" />`);

    /* this.$date1.val(("2019-02-12T00:00"));
    this.$date2.val(("2019-02-12T04:00")); */

    this.$date1.appendTo($target);
    this.$date2.appendTo($target);
  }
  Data() {
    let date1Val = this.CheckValue(this.$date1);
    let date2Val = this.CheckValue(this.$date2);

    console.log(date1Val);
    console.log(date2Val);

    if (date1Val && date2Val) {
      let endTime = moment(
        date2Val +
        "T00:00" +
        System.data.Brainly.defaultConfig.locale.OFFSET
      ).tz(System.data.Brainly.defaultConfig.locale.TIMEZONE);
      let startTime = moment(
        date1Val +
        "T00:00" +
        System.data.Brainly.defaultConfig.locale.OFFSET
      ).tz(System.data.Brainly.defaultConfig.locale.TIMEZONE);
      console.log(endTime);
      console.log(startTime);
      let type = "DATE_RANGE";
      let value = {
        date1: startTime,
        date2: endTime
      };

      if (endTime < startTime) {
        [startTime, endTime] = [endTime, startTime];
      }

      let dateText = `
			<h2 class="sg-text sg-text--xsmall sg-text--white">${startTime.format("L LT")}</h2>
			<h2 class="sg-text sg-text--xsmall sg-text--white sg-text--to-center sg-text--full">↕</h2>
			<h2 class="sg-text sg-text--xsmall sg-text--white">${endTime.format("L LT")}</h2>`;

      return {
        text: dateText,
        type,
        value,
        class: "sg-box--lavender",
        hash: md5(type + "" + JSON.stringify(value))
      };
    }
  }
  CheckValue($element) {
    let value = $element.val();

    $element.removeClass("sg-input--invalid");

    if (!value) {
      $element.addClass("sg-input--invalid");
    }

    return value;
  }
}

export default DateRange
