import HideElement from "@root/helpers/HideElement";
import { Flex, Icon, Label } from "@style-guide";
import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";

export type NumberConditionType = "equals" | "greaterThan" | "lowerThan";

export default class ContentLength {
  main: QueueClassType;

  query?: {
    condition?: NumberConditionType;
    length?: number;
  };

  labelContainer: import("@style-guide/Flex").FlexElementType;
  label: Label;
  labelText: Text;

  constructor(main: QueueClassType) {
    this.main = main;
  }

  SetQuery(condition?: NumberConditionType, length?: number) {
    if (!length) {
      this.HideLabel();

      return;
    }

    this.query = { condition, length };

    this.ShowLabel();
    this.main.main.fetcher.FilterContents();
    this.main.main.queue.ShowContents();
  }

  HideLabel(event?: MouseEvent) {
    this.query = {};

    if (event)
      this.main.options.option.contentFilters.filter.contentLength.Deselected();

    HideElement(this.labelContainer);
    this.main.main.fetcher?.FilterContents();
    this.main.main.queue.ShowContents();
  }

  ShowLabel() {
    if (!this.labelContainer) this.RenderLabel();

    this.labelText.nodeValue =
      System.data.locale.reportedContents.options.filter.filters.contentLength.label[
        this.query?.condition
      ]?.replace("%{N}", String(this.query.length)) || "Error";

    this.main.main.filterLabelContainer.append(this.labelContainer);
  }

  RenderLabel() {
    this.labelContainer = Flex({
      margin: "xxs",
      children: this.label = new Label({
        color: "gray",
        onClose: this.HideLabel.bind(this),
        icon: new Icon({
          type: "ext-measuring-tape",
        }),
        children: [
          `${
            //
            System.data.locale.reportedContents.options.filter.filters
              .contentLength.name
          }:&nbsp; `,
          (this.labelText = document.createTextNode("")),
        ],
      }),
    });
  }

  CompareContent(content: ContentClassTypes) {
    if (!this.query?.length || !this.query?.condition) return true;

    if (this.query.condition === "greaterThan")
      return content.data.content_short.length > this.query.length;

    if (this.query.condition === "lowerThan")
      return content.data.content_short.length < this.query.length;

    // Default condition is "equals"
    return content.data.content_short.length === this.query.length;
  }
}
