import { ContentClassTypes } from "../../../Fetcher/Fetcher";
import type QueueClassType from "../../Queue";
import StringFilter from "./StringFilter";

export default class AdditionalData extends StringFilter {
  constructor(main: QueueClassType) {
    super(main, {
      optionName: "additionalData",
      labelColor: "mint",
      labelIconType: "report_flag",
      labelName:
        System.data.locale.reportedContents.options.filter.filters.stringFilter
          .additionalData,
    });
  }

  CompareContent(content: ContentClassTypes) {
    if (!this.query?.regexp) return true;

    if (!content.data.report.abuse?.data) return false;

    return !!content.data.report.abuse.data.match(this.query.regexp);
  }
}
