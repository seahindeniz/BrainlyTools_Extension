import { Flex, InputDeprecated, Text } from "@/scripts/components/style-guide";
import Build from "@/scripts/helpers/Build";
import moment from "moment-timezone";
import Filter from ".";

export default class DateRange extends Filter {
  /**
   * @param {import("..").default} main
   */
  constructor(main) {
    super(main, "DateRange");
    /**
     * @type {moment.Moment}
     */
    this.date1 = undefined;
    /**
     * @type {moment.Moment}
     */
    this.date2 = undefined;

    this.Render();
    this.BindListener();
  }

  Render() {
    this.container = Build(
      Flex({
        direction: "column",
      }),
      [
        [
          Flex,
          (this.date1Input = InputDeprecated({
            type: "date",
            placeholder: `${System.data.locale.core.massModerateReportedContents.userId}..`,
          })),
        ],
        [
          Flex({
            marginTop: "xxs",
            marginBottom: "xxs",
            justifyContent: "center",
          }),
          Text({
            text: "↕",
          }),
        ],
        [
          Flex,
          (this.date2Input = InputDeprecated({
            type: "date",
            placeholder: `${System.data.locale.core.massModerateReportedContents.userId}..`,
          })),
        ],
      ],
    );

    this.date2Input.valueAsDate = new Date();
    this.date1Input.max = this.date2Input.value;
    this.date2Input.max = this.date2Input.value;

    this.optionsContainer.append(this.container);
  }

  BindListener() {
    this.date1Input.addEventListener("change", this.DateChanged.bind(this));
    this.date2Input.addEventListener("change", this.DateChanged.bind(this));
    /* this.main.FilterReports.bind(this.main) */
  }

  DateChanged() {
    if (this.IsUsed()) {
      this.date1 = moment(this.date1Input.value).tz(
        System.data.Brainly.defaultConfig.config.data.config.timezone,
        true,
      );
      this.date2 = moment(this.date2Input.value).tz(
        System.data.Brainly.defaultConfig.config.data.config.timezone,
        true,
      );

      if (this.date1 > this.date2)
        [this.date1, this.date2] = [this.date2, this.date1];

      this.date1 = this.date1.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      this.date2 = this.date2.set({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 0,
      });
    }

    this.main.FilterReports();
  }

  /**
   * @param {import("../../Report").default} report
   */
  CheckReport(report) {
    const reportDate = report.reportDate.moment;

    return (
      this.date1 &&
      this.date2 &&
      reportDate >= this.date1 &&
      reportDate <= this.date2
    );
  }

  IsUsed() {
    return !!this.date1Input.value && !!this.date2Input.value;
  }
}
