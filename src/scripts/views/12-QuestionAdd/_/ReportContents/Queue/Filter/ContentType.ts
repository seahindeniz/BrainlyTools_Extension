import { ContentTypeType } from "@components/ModerationPanel/ContentSection/ContentSection";
import HideElement from "@root/scripts/helpers/HideElement";
import { Flex, Label } from "@style-guide";
import type QueueClassType from "../Queue";
import type ContentClassType from "../../Content/Content";

export default class ContentType {
  main: QueueClassType;

  query?: {
    contentType?: ContentTypeType;
  };

  labelContainer: import("@style-guide/Flex").FlexElementType;
  label: import("@style-guide/Label").LabelElementType;
  labelText: Text;

  constructor(main: QueueClassType) {
    this.main = main;
  }

  SetQuery(contentType?: ContentTypeType) {
    if (!contentType) {
      this.HideLabel();

      return;
    }

    this.query = { contentType };

    this.ShowLabel();
    this.main.main.fetcher.FilterContents();
    this.main.main.queue.ShowContents();
  }

  HideLabel(event?: MouseEvent) {
    this.query = {};

    if (event)
      this.main.options.option.contentFilters.filter.contentType.selectedOption //
        ?.Deselected();

    HideElement(this.labelContainer);
    this.main.main.fetcher.FilterContents();
    this.main.main.queue.ShowContents();
  }

  ShowLabel() {
    if (!this.labelContainer) this.RenderLabel();

    this.labelText.nodeValue = this.query.contentType;

    this.main.main.filterLabelContainer.append(this.labelContainer);
  }

  RenderLabel() {
    this.labelContainer = Flex({
      margin: "xxs",
      children: this.label = Label({
        color: "mustard",
        onClose: this.HideLabel.bind(this),
        icon: {
          type: "all_questions",
        },
        children: [
          `${
            //
            System.data.locale.reportedContents.options.filter.filters
              .contentType.name
          }:&nbsp; `,
          (this.labelText = document.createTextNode("")),
        ],
      }),
    });
  }

  CompareContent(content: ContentClassType) {
    if (!this.query?.contentType) return true;

    return content.contentType === this.query.contentType;
  }
}
