import HideElement from "@root/helpers/HideElement";
import { Flex, Select } from "@style-guide";
import type FiltersClassType from "../Filters";
import AnswerGroup from "./AnswerGroup";
import CommentGroup from "./CommentGroup";
import QuestionGroup from "./QuestionGroup";
import Reason from "./Reason";

type ReasonGroupsType = "question" | "answer" | "comment";

export default class Reasons {
  main: FiltersClassType;

  reasonSelect: Select;
  reasonGroup: {
    question?: QuestionGroup;
    answer?: AnswerGroup;
    comment?: CommentGroup;
  };

  reasons: Reason[];

  selectedReason: Reason;
  primaryReason: { questionAnswer: Reason; comment: Reason };
  container: import("@style-guide/Flex").FlexElementType;

  constructor(main: FiltersClassType) {
    this.main = main;

    this.reasonGroup = {
      question: undefined,
      answer: undefined,
      comment: undefined,
    };
    this.reasons = [];

    this.Render();
    this.RenderPrimaryReasons();
  }

  Render() {
    this.container = Flex({
      grow: true,
      margin: "xxs",
      // marginRight: "s",
      children: this.reasonSelect = new Select({
        fullWidth: true,
        onChange: this.ReasonSelected.bind(this),
      }),
    });

    this.Show();
  }

  RenderPrimaryReasons() {
    this.primaryReason = {
      questionAnswer: new Reason(this, {
        id: 0,
        text:
          System.data.locale.reportedContents.categoryFilterFirstOption.name,
      }),
      comment: new Reason(this, {
        id: 998,
        text:
          System.data.locale.reportedContents.categoryFilterFirstOption.name,
      }),
    };
  }

  ShowGroups(groupNames: ReasonGroupsType[]) {
    if (groupNames.length === 0) return;

    Object.values(this.reasonGroup).forEach(reasonGroup => reasonGroup?.Hide());

    groupNames.forEach(groupName => {
      if (!this.reasonGroup[groupName]) {
        this.InitGroup(groupName);
      }

      this.reasonGroup[groupName].Show();
    });

    this.UpdateSelectedReasonStore();
  }

  InitGroup(groupName: ReasonGroupsType) {
    if (groupName === "question") {
      this.reasonGroup.question = new QuestionGroup(this);
    } else if (groupName === "answer") {
      this.reasonGroup.answer = new AnswerGroup(this);
    } else if (groupName === "comment") {
      this.reasonGroup.comment = new CommentGroup(this);
    }
  }

  ReasonSelected() {
    this.UpdateSelectedReasonStore();

    this.main.main.pageNumbers.Toggle();

    if (!this.selectedReason) return;

    this.main.main.FetchReports({ resetStore: true });
  }

  UpdateSelectedReasonStore() {
    const selectedOptions = Array.from(
      this.reasonSelect.select.selectedOptions,
    );

    this.selectedReason = this.reasons.find(reason =>
      selectedOptions.includes(reason.option),
    );
  }

  Show() {
    this.main.filtersContainer.append(this.container);
  }

  Hide() {
    this.selectedReason = null;
    this.reasonSelect.select.selectedIndex = 0;

    HideElement(this.container);
  }

  IsChanged() {
    return !!this.selectedReason?.data.id;
  }
}
