import type { ContentTypeType } from "@components/ModerationPanel/ContentSection/ContentSection";
import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";
import QueueFilter from "./QueueFilter";

export default class ContentType extends QueueFilter {
  query?: {
    contentType?: ContentTypeType;
  };

  constructor(main: QueueClassType) {
    super(main, {
      labelColor: "mustard",
      labelIconType: "all_questions",
      labelName:
        System.data.locale.reportedContents.filtersPanel.filters.contentType
          .name,
    });
  }

  SetQuery(contentType?: ContentTypeType) {
    if (!contentType) {
      this.HideLabel();

      return;
    }

    this.query = { contentType };

    super.QuerySettled();
  }

  HideLabel(event?: MouseEvent) {
    if (event)
      this.main.filtersPanel.filter.contentType.selectedOption?.Deselected();

    super.HideLabel();
  }

  ShowLabel() {
    super.ShowLabel();

    this.labelText.nodeValue = this.query.contentType;
  }

  CompareContent(content: ContentClassTypes) {
    if (!this.query?.contentType) return true;

    return content.contentType === this.query.contentType;
  }
}
