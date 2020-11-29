import { ContentClassTypes } from "../../../Fetcher/Fetcher";
import type QueueClassType from "../../Queue";
import StringFilter from "./StringFilter";

export default class Content extends StringFilter {
  constructor(main: QueueClassType) {
    super(main, {
      optionName: "content",
      labelColor: "blue",
      labelIconType: "report_flag",
      labelName:
        System.data.locale.reportedContents.filtersPanel.filters.stringFilter
          .content,
    });
  }

  CompareContent(content: ContentClassTypes) {
    if (!this.query?.regexp) return true;

    if (!content.data.content_short) return false;

    return !!content.data.content_short.match(this.query.regexp);
  }
}
