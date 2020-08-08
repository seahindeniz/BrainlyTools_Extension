// @flow
import HideElement from "@root/scripts/helpers/HideElement";
import { Flex, Label } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { LabelElementType } from "@style-guide/Label";
import moment from "moment-timezone";
import type ContentClassType from "../../Content/Content";
import type QueueClassType from "../Queue";

export default class Reported {
  main: QueueClassType;

  query: {
    startingDate?: string;
    endingDate?: string;
    startingDateMoment?: moment.Moment;
    endingDateMoment?: moment.Moment;
  };

  labelContainer: FlexElementType;
  label: LabelElementType;
  labelText: Text;

  constructor(main: QueueClassType) {
    this.main = main;
  }

  SetQuery(startingDate?: string, endingDate?: string) {
    if (!startingDate || !endingDate) {
      this.HideLabel();

      return;
    }

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

    // $FlowFixMe
    if (this.query.startingDateMoment > this.query.endingDateMoment) {
      // $FlowFixMe
      [this.query.startingDate, this.query.endingDate] = [
        this.query.endingDate,
        this.query.startingDate,
      ];
      // $FlowFixMe
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

    this.ShowLabel();
    this.main.main.fetcher.FilterContents();
    this.main.main.queue.ShowContents();
  }

  HideLabel(event?: MouseEvent) {
    this.query = {};

    if (event)
      this.main.options.option.contentFilters.filter.reportingDate.ResetDates();

    HideElement(this.labelContainer);
    this.main.main.fetcher.FilterContents();
    this.main.main.queue.ShowContents();
  }

  ShowLabel() {
    if (!this.labelContainer) this.RenderLabel();

    this.labelText.nodeValue = String(
      `${this.query.startingDate} ↔ ${this.query.endingDate}`,
    );

    this.main.main.filterLabelContainer.append(this.labelContainer);
  }

  RenderLabel() {
    this.labelContainer = Flex({
      margin: "xxs",
      children: this.label = Label({
        onClose: this.HideLabel.bind(this),
        children: [
          `${
            //
            System.data.locale.reportedContents.options.filter.filters
              .reportingDate.name
          }:&nbsp; `,
          (this.labelText = document.createTextNode("")),
        ],
        color: "mint",
      }),
    });
  }

  CompareContent(content: ContentClassType) {
    if (
      !this.query?.startingDateMoment ||
      !this.query?.endingDateMoment ||
      !content.dates.report?.moment
    )
      return false;

    const reportDate = content.dates.report.moment;

    return (
      // $FlowFixMe
      reportDate >= this.query.startingDateMoment &&
      // $FlowFixMe
      reportDate <= this.query.endingDateMoment
    );
  }
}
