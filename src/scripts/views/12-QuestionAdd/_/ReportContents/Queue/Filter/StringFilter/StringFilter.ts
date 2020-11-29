import type { ContentClassTypes } from "../../../Fetcher/Fetcher";
import type { ConditionKeyType } from "../../FiltersPanel/StringFilter/Condition";
import type { StringFilterType } from "../../FiltersPanel/StringFilter/StringFilter";
import QueueFilter, { QueueFilterPropsType } from "../QueueFilter";

export default class StringFilter extends QueueFilter {
  optionName: StringFilterType;

  query: {
    condition?: ConditionKeyType;
    value?: string;
    regexp?: RegExp;
  };

  constructor(
    main,
    {
      optionName,
      ...props
    }: { optionName: StringFilterType } & QueueFilterPropsType,
  ) {
    super(main, props);

    this.optionName = optionName;
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

    if (!pattern) return undefined;

    return new RegExp(pattern, flags);
  }

  HideLabel(event?: MouseEvent) {
    if (event) {
      this.main.filtersPanel.filter[this.optionName].Reset();
    }

    super.HideLabel();
  }

  ShowLabel() {
    super.ShowLabel();

    this.labelText.nodeValue = System.data.locale.reportedContents.filtersPanel.filters.stringFilter.label[
      this.query.condition
    ].replace(/%{input}/g, this.query.value);
  }

  CompareContent(content: ContentClassTypes) {
    console.warn(this, content);

    return false;
  }
}
