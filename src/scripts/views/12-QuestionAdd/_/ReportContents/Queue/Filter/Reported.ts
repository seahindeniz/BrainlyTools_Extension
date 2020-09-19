import HideElement from "@root/helpers/HideElement";
import { Flex, LabelDeprecated } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type { LabelElementType } from "@style-guide/LabelDeprecated";
import { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";

type TargetType = "nick" | "id";

export default class Reported {
  main: QueueClassType;

  query: {
    target?: TargetType;
    value?: number | string;
    valueLowerCase?: string;
  };

  labelContainer: FlexElementType;
  label: LabelElementType;
  labelText: Text;

  constructor(main: QueueClassType) {
    this.main = main;
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

    this.ShowLabel();
    this.main.main.fetcher.FilterContents();
    this.main.main.queue.ShowContents();
  }

  HideLabel(event?: MouseEvent) {
    this.query = {};

    if (event)
      this.main.options.option.contentFilters.filter.reported.input.value = "";

    HideElement(this.labelContainer);
    this.main.main.fetcher?.FilterContents();
    this.main.main.queue.ShowContents();
  }

  ShowLabel() {
    if (!this.labelContainer) this.RenderLabel();

    this.labelText.nodeValue = String(this.query.value);

    this.main.main.filterLabelContainer.append(this.labelContainer);
  }

  RenderLabel() {
    this.labelContainer = Flex({
      margin: "xxs",
      children: this.label = LabelDeprecated({
        icon: {
          type: "profile_view",
        },
        onClose: this.HideLabel.bind(this),
        children: [
          `${
            System.data.locale.reportedContents.options.filter.filters.reported
              .by[this.query.target]
          }:&nbsp; `,
          (this.labelText = document.createTextNode("")),
        ],
        color: "mint",
      }),
    });
  }

  CompareContent(content: ContentClassTypes) {
    if (
      !this.query?.value ||
      !this.query?.target ||
      Number.isNaN(this.query.value)
    )
      return true;

    if (this.query.target === "id")
      return content.users.reported.data.id === this.query.value;

    return content.users.reported.nick === this.query.valueLowerCase;
  }
}
