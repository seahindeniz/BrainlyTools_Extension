import moment from "moment-timezone";
import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";
import QueueFilter from "./QueueFilter";

export default class Reported extends QueueFilter {
  query: {
    startingDate?: string;
    endingDate?: string;
    startingDateMoment?: moment.Moment;
    endingDateMoment?: moment.Moment;
  };

  constructor(main: QueueClassType) {
    super(main, {
      labelColor: "lavender",
      labelIconType: "calendar",
      labelName:
        System.data.locale.reportedContents.filtersPanel.filters.reportingDate
          .name,
    });
  }

  SetQuery(startingDate?: string, endingDate?: string) {
    if (!startingDate || !endingDate) {
      this.HideLabel();

      return;
    }

    moment.locale(navigator.language);

    this.query = {
      startingDate,
      endingDate,
      startingDateMoment: moment(startingDate).tz(
        System.data.Brainly.defaultConfig.config.data.config.timezone,
        true,
      ),
      endingDateMoment: moment(endingDate).tz(
        System.data.Brainly.defaultConfig.config.data.config.timezone,
        true,
      ),
    };

    if (this.query.startingDateMoment > this.query.endingDateMoment) {
      [this.query.startingDate, this.query.endingDate] = [
        this.query.endingDate,
        this.query.startingDate,
      ];
      [this.query.startingDateMoment, this.query.endingDateMoment] = [
        this.query.endingDateMoment,
        this.query.startingDateMoment,
      ];
    }

    this.query.startingDateMoment = this.query.startingDateMoment.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    this.query.endingDateMoment = this.query.endingDateMoment.set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 0,
    });

    super.QuerySettled();
  }

  HideLabel(event?: MouseEvent) {
    if (event) {
      this.main.filtersPanel.filter.reportingDate.ResetDates();
    }

    super.HideLabel();
  }

  ShowLabel() {
    super.ShowLabel();

    this.labelText.nodeValue = String(
      `${this.query.startingDate} ↔ ${this.query.endingDate}`,
    );
  }

  CompareContent(content: ContentClassTypes) {
    if (
      !this.query?.startingDateMoment ||
      !this.query?.endingDateMoment ||
      !content.dates.report?.moment
    )
      return true;

    const reportDate = content.dates.report.moment;

    return (
      reportDate >= this.query.startingDateMoment &&
      reportDate <= this.query.endingDateMoment
    );
  }
}
