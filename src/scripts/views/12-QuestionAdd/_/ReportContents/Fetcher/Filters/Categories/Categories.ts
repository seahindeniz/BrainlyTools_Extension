import CreateElement from "@root/scripts/components/CreateElement";
import HideElement from "@root/scripts/helpers/HideElement";
import Action from "@BrainlyAction";
import { Flex, Select } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type FiltersType from "../Filters";
import Category from "./Category";

export default class Categories {
  main: FiltersType;
  categories: {
    all: Category[];
    questionAnswer: Category[];
    comment: Category[];
  };

  container: FlexElementType;
  questionAnswerCategorySelect: Select;
  commentCategorySelect: Select;

  selectedCategory?: Category;

  constructor(main: FiltersType) {
    this.main = main;
    this.categories = {
      all: [],
      questionAnswer: [],
      comment: [],
    };

    this.Render();
    this.BindListener();
  }

  Render() {
    this.container = Flex({
      grow: true,
      margin: "xxs",
    });
    this.questionAnswerCategorySelect = new Select({
      fullWidth: true,
    });
    this.commentCategorySelect = new Select({
      fullWidth: true,
    });

    this.main.filtersContainer.append(this.container);
  }

  async InitQuestionAnswerCategories() {
    const allQuestionAnswerReportsCategory = new Category(this, {
      id: 0,
      text: System.data.locale.reportedContents.categoryFilterFirstOption.name,
    });

    this.selectedCategory = allQuestionAnswerReportsCategory;

    this.categories.all.push(allQuestionAnswerReportsCategory);

    const questionOptGroup = CreateElement({
      tag: "optgroup",
      label:
        System.data.locale.reportedContents.categoryFilterFirstOption.reasonsFor
          .Question,
    });
    const answerOptGroup = CreateElement({
      tag: "optgroup",
      label:
        System.data.locale.reportedContents.categoryFilterFirstOption.reasonsFor
          .Answer,
    });

    this.questionAnswerCategorySelect.select.append(
      allQuestionAnswerReportsCategory.option,
      questionOptGroup,
      answerOptGroup,
    );

    const resQuestionReportReasons = await new Action().GetAbuseReasons(1);

    resQuestionReportReasons.data.forEach(data => {
      if (!data.visible) return;

      const category = new Category(this, data);

      questionOptGroup.append(category.option);
      this.categories.all.push(category);
      this.categories.questionAnswer.push(category);
    });

    const resAnswerReportReasons = await new Action().GetAbuseReasons(2);

    resAnswerReportReasons.data.forEach(data => {
      if (!data.visible) return;

      const category = new Category(this, data);

      answerOptGroup.append(category.option);
      this.categories.all.push(category);
      this.categories.questionAnswer.push(category);
    });
  }

  ShowQuestionAnswerSelector() {
    if (this.categories.questionAnswer.length === 0)
      this.InitQuestionAnswerCategories();
    else {
      this.AssignSelectedCategory(this.questionAnswerCategorySelect.select);
    }

    this.HideCommentSelector();
    this.container.append(this.questionAnswerCategorySelect.element);
  }

  HideQuestionAnswerSelector() {
    HideElement(this.questionAnswerCategorySelect.element);
  }

  async InitCommentCategories() {
    const allCommentReportsCategory = new Category(this, {
      id: 998,
      text: System.data.locale.reportedContents.categoryFilterFirstOption.name,
    });

    this.selectedCategory = allCommentReportsCategory;

    this.categories.all.push(allCommentReportsCategory);

    const commentOptGroup = CreateElement({
      tag: "optgroup",
      label:
        System.data.locale.reportedContents.categoryFilterFirstOption.reasonsFor
          .Comment,
    });

    this.commentCategorySelect.select.append(
      allCommentReportsCategory.option,
      commentOptGroup,
    );

    const resCommentReportReasons = await new Action().GetAbuseReasons(45);

    resCommentReportReasons.data.forEach(data => {
      if (!data.visible) return;

      const category = new Category(this, data);

      commentOptGroup.append(category.option);
      this.categories.comment.push(category);
    });
  }

  ShowCommentSelector() {
    if (this.categories.comment.length === 0) {
      this.InitCommentCategories();
    } else {
      this.AssignSelectedCategory(this.commentCategorySelect.select);
    }

    this.HideQuestionAnswerSelector();
    this.container.append(this.commentCategorySelect.element);
  }

  HideCommentSelector() {
    HideElement(this.commentCategorySelect.element);
  }

  BindListener() {
    this.questionAnswerCategorySelect.select.addEventListener(
      "change",
      this.CategoryChanged.bind(this),
    );
    this.commentCategorySelect.select.addEventListener(
      "change",
      this.CategoryChanged.bind(this),
    );
  }

  CategoryChanged(event: Event & { target: HTMLSelectElement }) {
    this.AssignSelectedCategory(event.target);

    if (!this.selectedCategory) return;

    this.selectedCategory.Selected();
    this.main.main.FetchReports({ resetStore: true });
  }

  AssignSelectedCategory(target: HTMLSelectElement) {
    const selectedOption = target.selectedOptions[0];
    this.selectedCategory = this.categories.all.find(
      category => category.option === selectedOption,
    );
  }
}
