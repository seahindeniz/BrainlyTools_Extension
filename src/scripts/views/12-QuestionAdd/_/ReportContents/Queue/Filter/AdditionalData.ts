import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type { ConditionKeyType } from "../Options/Filters/AdditionalData/Condition";
import type QueueClassType from "../Queue";
import QueueFilter from "./QueueFilter";

export default class AdditionalData extends QueueFilter {
  query: {
    condition?: ConditionKeyType;
    value?: string;
    regexp?: RegExp;
  };

  constructor(main: QueueClassType) {
    super(main, {
      labelColor: "mint",
      labelIconType: "report_flag",
      labelName:
        System.data.locale.reportedContents.options.filter.filters
          .additionalData.name,
    });
  }

  SetQuery(condition?: ConditionKeyType, value?: string) {
    if (!condition || !value) {
      this.HideLabel();

      return;
    }

    this.query = {
      condition,
      value,
    };

    this.query.regexp = this.GenerateRegExp();

    super.QuerySettled();
  }

  private GenerateRegExp() {
    let pattern: string;
    let flags = "mi";
    const { value, condition } = this.query;

    if (!condition || !value) return undefined;

    if (condition === "regExp") {
      const groups = value.match(/\/(?<pattern>.*)\/(?<flags>.*)/)?.groups;

      if (groups) {
        pattern = groups.pattern;
        flags = groups.flags;
      }
    } //
    else if (condition === "contains") pattern = value;
    else if (condition === "sameWith") pattern = `^${value}$`;
    else if (condition === "startsWith") pattern = `^${value}`;
    else if (condition === "endsWith") pattern = `${value}$`;

    if (!pattern || !flags) return undefined;

    return new RegExp(pattern, flags);
  }

  HideLabel(event?: MouseEvent) {
    if (event) {
      this.main.options.option.contentFilters.filter.additionalData.Reset();
    }

    super.HideLabel();
  }

  ShowLabel() {
    super.ShowLabel();

    this.labelText.nodeValue = System.data.locale.reportedContents.options.filter.filters.additionalData.label[
      this.query.condition
    ].replace(/%{input}/g, this.query.value);
  }

  CompareContent(content: ContentClassTypes) {
    if (!this.query?.regexp) return true;

    if (!content.data.report.abuse?.data) return false;

    return content.data.report.abuse.data.match(this.query.regexp);
  }
}
