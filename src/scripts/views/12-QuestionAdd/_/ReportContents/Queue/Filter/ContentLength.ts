import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";
import QueueFilter from "./QueueFilter";

export type NumberConditionType = "equals" | "greaterThan" | "lowerThan";

export default class ContentLength extends QueueFilter {
  query?: {
    condition?: NumberConditionType;
    length?: number;
  };

  constructor(main: QueueClassType) {
    super(main, {
      labelColor: "gray",
      labelIconType: "ext-measuring-tape",
      labelName:
        System.data.locale.reportedContents.filtersPanel.filters.contentLength
          .name,
    });
  }

  SetQuery(condition?: NumberConditionType, length?: number) {
    if (Number.isNaN(length) || length < 0) {
      this.HideLabel();

      return;
    }

    this.query = { condition, length };

    super.QuerySettled();
  }

  HideLabel(event?: MouseEvent) {
    if (event) {
      this.main.filtersPanel.filter.contentLength.Deselected();
    }

    super.HideLabel();
  }

  ShowLabel() {
    super.ShowLabel();

    this.labelText.nodeValue =
      System.data.locale.reportedContents.filtersPanel.filters.contentLength.label[
        this.query?.condition
      ]?.replace("%{N}", String(this.query.length)) || "Error";
  }

  CompareContent(content: ContentClassTypes) {
    if (Number.isNaN(this.query?.length) || !this.query?.condition) return true;

    if (this.query.condition === "greaterThan")
      return content.data.content_short.length > this.query.length;

    if (this.query.condition === "lowerThan")
      return content.data.content_short.length < this.query.length;

    // Default condition is "equals"
    return content.data.content_short.length === this.query.length;
  }
}
