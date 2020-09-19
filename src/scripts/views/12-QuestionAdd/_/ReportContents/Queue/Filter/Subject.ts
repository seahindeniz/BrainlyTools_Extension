import HideElement from "@root/helpers/HideElement";
import { Flex, Icon, Label } from "@style-guide";
import { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";

export default class Subject {
  main: QueueClassType;

  query?: {
    selectedIds?: number[];
  };

  labelContainer: import("@style-guide/Flex").FlexElementType;
  label: Label;
  labelText: Text;

  constructor(main: QueueClassType) {
    this.main = main;
  }

  SetQuery(selectedIds?: number[]) {
    if (!selectedIds?.length) {
      this.HideLabel();

      return;
    }

    this.query = { selectedIds };

    this.ShowLabel();
    this.main.main.fetcher.FilterContents();
    this.main.main.queue.ShowContents();
  }

  HideLabel(event?: MouseEvent) {
    this.query = {};

    if (event)
      this.main.options.option.contentFilters.filter.subject.Deselected();

    HideElement(this.labelContainer);
    this.main.main.fetcher?.FilterContents();
    this.main.main.queue.ShowContents();
  }

  ShowLabel() {
    if (!this.labelContainer) this.RenderLabel();

    const selectedSubjectNames = System.data.Brainly.defaultConfig.config.data.subjects
      .filter(subjectData => this.query.selectedIds.includes(subjectData.id))
      .map(subjectData => subjectData.name);

    this.labelText.nodeValue = selectedSubjectNames.join(", ");

    this.main.main.filterLabelContainer.append(this.labelContainer);
  }

  RenderLabel() {
    this.labelContainer = Flex({
      margin: "xxs",
      children: this.label = new Label({
        color: "gray",
        onClose: this.HideLabel.bind(this),
        icon: new Icon({
          type: "subject-all",
        }),
        children: [
          `${
            //
            System.data.locale.reportedContents.options.filter.filters.subject
              .name
          }:&nbsp; `,
          (this.labelText = document.createTextNode("")),
        ],
      }),
    });
  }

  CompareContent(content: ContentClassTypes) {
    if (!this.query?.selectedIds?.length) return true;

    return this.query.selectedIds.includes(content.data.subject_id);
  }
}
