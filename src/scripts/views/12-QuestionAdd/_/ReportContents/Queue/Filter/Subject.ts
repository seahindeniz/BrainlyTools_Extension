import type { ContentClassTypes } from "../../Fetcher/Fetcher";
import type QueueClassType from "../Queue";
import QueueFilter from "./QueueFilter";

export default class Subject extends QueueFilter {
  query?: {
    selectedIds?: number[];
  };

  constructor(main: QueueClassType) {
    super(main, {
      labelColor: "gray",
      labelIconType: "subject-all",
      labelName:
        System.data.locale.reportedContents.filtersPanel.filters.subject.name,
    });
  }

  SetQuery(selectedIds?: number[]) {
    if (!selectedIds?.length) {
      this.HideLabel();

      return;
    }

    this.query = { selectedIds };

    super.QuerySettled();
  }

  HideLabel(event?: MouseEvent) {
    if (event) {
      this.main.filtersPanel.filter.subject.Deselected();
    }

    super.HideLabel();
  }

  ShowLabel() {
    super.ShowLabel();

    const selectedSubjectNames = System.data.Brainly.defaultConfig.config.data.subjects
      .filter(subjectData => this.query.selectedIds.includes(subjectData.id))
      .map(subjectData => subjectData.name);

    this.labelText.nodeValue = selectedSubjectNames.join(", ");
  }

  CompareContent(content: ContentClassTypes) {
    if (!this.query?.selectedIds?.length) return true;

    return this.query.selectedIds.includes(content.data.subject_id);
  }
}
