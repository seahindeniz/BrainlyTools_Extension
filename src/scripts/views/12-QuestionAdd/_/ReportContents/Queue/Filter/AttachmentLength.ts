import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type { NumberConditionType } from "./ContentLength";
import QueueFilter from "./QueueFilter";
import type QueueClassType from "../Queue";

export default class AttachmentLength extends QueueFilter {
  query?: {
    condition?: NumberConditionType;
    length?: number;
  };

  constructor(main: QueueClassType) {
    super(main, {
      labelColor: "gray",
      labelIconType: "attachment",
      labelName:
        System.data.locale.reportedContents.options.filter.filters
          .attachmentLength.name,
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
      this.main.options.option.contentFilters.filter.attachmentLength //
        .Deselected();
    }

    super.HideLabel();
  }

  ShowLabel() {
    super.ShowLabel();

    this.labelText.nodeValue =
      System.data.locale.reportedContents.options.filter.filters.contentLength.label[
        this.query?.condition
      ]?.replace("%{N}", String(this.query.length)) || "Error";
  }

  CompareContent(content: ContentClassTypes) {
    if (content.contentType === "Comment" || !content.extraData) return false;

    if (Number.isNaN(this.query?.length) || !this.query?.condition) return true;

    if (this.query.condition === "greaterThan")
      return content.extraData.attachments.length > this.query.length;

    if (this.query.condition === "lowerThan")
      return content.extraData.attachments.length < this.query.length;

    // Default condition is "equals"
    return content.extraData.attachments.length === this.query.length;
  }
}
