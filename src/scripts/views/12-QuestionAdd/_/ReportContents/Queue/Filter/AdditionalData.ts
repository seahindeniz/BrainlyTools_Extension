import HideElement from "@root/helpers/HideElement";
import { Flex, LabelDeprecated } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { LabelElementType } from "@style-guide/LabelDeprecated";
import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type { ConditionKeyType } from "../Options/Filters/AdditionalData/Condition";
import type QueueClassType from "../Queue";

export default class AdditionalData {
  main: QueueClassType;

  query: {
    condition?: ConditionKeyType;
    value?: string;
    regexp?: RegExp;
  };

  labelContainer: FlexElementType;
  label: LabelElementType;
  labelText: Text;

  constructor(main: QueueClassType) {
    this.main = main;
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

    this.ShowLabel();
    this.main.main.fetcher.FilterContents();
    this.main.main.queue.ShowContents();
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
    this.query = {};

    if (event) {
      this.main.options.option.contentFilters.filter.additionalData.Reset();
    }

    HideElement(this.labelContainer);
    this.main.main.fetcher?.FilterContents();
    this.main.main.queue.ShowContents();
  }

  ShowLabel() {
    if (!this.labelContainer) this.RenderLabel();

    this.labelText.nodeValue = System.data.locale.reportedContents.options.filter.filters.additionalData.label[
      this.query.condition
    ].replace(/%{input}/g, this.query.value);

    this.main.main.filterLabelContainer.append(this.labelContainer);
  }

  RenderLabel() {
    this.labelContainer = Flex({
      margin: "xxs",
      children: this.label = LabelDeprecated({
        icon: {
          type: "report_flag",
        },
        onClose: this.HideLabel.bind(this),
        children: [
          `${
            //
            System.data.locale.reportedContents.options.filter.filters
              .additionalData.name
          }:&nbsp; `,
          (this.labelText = document.createTextNode("")),
        ],
        color: "mint",
      }),
    });
  }

  CompareContent(content: ContentClassTypes) {
    if (!this.query?.regexp) return true;

    if (!content.data.report.abuse?.data) return false;

    console.log(content.data.report.abuse.data, this.query?.regexp);

    return content.data.report.abuse.data.match(this.query.regexp);
  }
}
