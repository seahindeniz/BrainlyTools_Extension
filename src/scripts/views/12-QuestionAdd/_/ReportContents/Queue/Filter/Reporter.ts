import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";
import QueueFilter from "./QueueFilter";

type TargetType = "nick" | "id";

export default class Reporter extends QueueFilter {
  query: {
    target?: TargetType;
    value?: number | string;
    valueLowerCase?: string;
  };

  constructor(main: QueueClassType) {
    super(main, {
      labelColor: "peach",
      labelIconType: "profile_view",
      labelName:
        System.data.locale.reportedContents.options.filter.filters.reporter
          .name,
    });
  }

  SetQuery(target?: TargetType, value?: number | string) {
    if (!target || !value) {
      this.HideLabel();

      return;
    }

    this.query = {
      target,
      value,
    };

    if (target === "id") {
      this.query.value = System.ExtractId(this.query.value);
    } else {
      this.query.valueLowerCase = String(this.query.value).toLowerCase();
    }

    super.QuerySettled();
  }

  HideLabel(event?: MouseEvent) {
    if (event) {
      this.main.options.option.contentFilters.filter.reporter.Reset();
    }

    super.HideLabel();
  }

  ShowLabel() {
    super.ShowLabel();

    this.labelText.nodeValue = `${
      System.data.locale.reportedContents.options.filter.filters.userFilter[
        this.query.target
      ]
    }:\xa0 ${String(this.query.value)}`;
  }

  CompareContent(content: ContentClassTypes) {
    if (
      !this.query?.value ||
      !this.query?.target ||
      Number.isNaN(this.query.value)
    )
      return true;

    if (this.query.target === "id")
      return content.users.reporter?.data.id === this.query.value;

    return content.users.reporter?.nick === this.query.valueLowerCase;
  }
}
