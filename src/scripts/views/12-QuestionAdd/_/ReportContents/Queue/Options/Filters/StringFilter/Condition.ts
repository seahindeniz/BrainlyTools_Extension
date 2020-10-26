import CreateElement from "@components/CreateElement";
import type AdditionalDataClassType from "./AdditionalData";

export type ConditionKeyType =
  | "contains"
  | "sameWith"
  | "startsWith"
  | "endsWith"
  | "regExp";

export default class Condition {
  main: AdditionalDataClassType;
  key: ConditionKeyType;

  option: HTMLOptionElement;

  constructor(main: AdditionalDataClassType, key: ConditionKeyType) {
    this.main = main;
    this.key = key;

    this.Render();
  }

  Render() {
    const conditionLocale =
      System.data.locale.reportedContents.options.filter.filters.stringFilter
        .conditions[this.key];

    this.option = CreateElement({
      tag: "option",
      children: conditionLocale,
    });

    this.main.conditionSelect.select.append(this.option);
  }
}
