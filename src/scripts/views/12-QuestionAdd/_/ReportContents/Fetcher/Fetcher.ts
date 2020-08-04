import HideElement from "@/scripts/helpers/HideElement";
import type {
  ReportedContentDataType,
  UsersDataInReportedContentsType,
} from "@BrainlyAction";
import Action from "@BrainlyAction";
import { Flex } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import Answer from "../Content/Answer";
import Comment from "../Content/Comment";
import Content from "../Content/Content";
import Question from "../Content/Question";
import type ReportedContentsType from "../ReportedContents";
import Filters from "./Filters/Filters";

export type ContentClassTypes = Question | Answer | Comment;

export default class Fetcher {
  main: ReportedContentsType;
  container: FlexElementType;

  filters: Filters;

  constructor(main: ReportedContentsType) {
    this.main = main;

    this.Render();

    this.filters = new Filters(this);

    this.filters.reportTypeFilter.reportTypes.questionAnswer.Selected();
  }

  Render() {
    this.container = Flex({
      className: "fetcherContainer", // TODO remove this
    });

    this.main.actionContainerOnLeft.append(this.container);
  }

  ResetContents() {
    if (this.main.contents.all.length > 0) {
      this.main.contents.all.forEach(
        content => content.container && content.container.remove(),
      );

      this.main.contents.all = [];
      this.main.contents.filtered = [];
    }
  }

  async FetchReports(resetStore: boolean) {
    const { selectedReportType } = this.filters.reportTypeFilter;

    if (resetStore) {
      this.ResetContents();
    }

    if (selectedReportType.typeName === "commentReports")
      await this.FetchCommentReports();
    else {
      if (
        !selectedReportType ||
        selectedReportType.typeName === "questionAnswerReports"
      )
        await this.FetchQuestionAnswerReports();
      else if (selectedReportType.typeName === "correctionReports")
        await this.FetchCorrectionReports();

      if (this.main.contents.all.length > 0) {
        this.FetchExtraDetails();
      }
    }

    this.main.queue.ShowContents();
    this.main.liveStatus.SubscribeModeration();
  }

  async FetchQuestionAnswerReports() {
    const { selectedSubject } = this.filters.subjectFilter;
    const { selectedCategory } = this.filters.categoryFilter;
    const resReports = await new Action().GetReportedContents({
      subject_id: selectedSubject?.data?.id,
      category_id: selectedCategory?.data?.id,
    });

    if (!resReports?.success) throw Error("Can't fetch reports");

    if (resReports.users_data.length > 0)
      resReports.users_data.forEach(this.StoreUser.bind(this));

    if (resReports.data?.items?.length > 0)
      resReports.data.items.forEach(this.InitContent.bind(this));
  }

  async FetchCommentReports() {
    const { selectedSubject } = this.filters.subjectFilter;
    const { selectedCategory } = this.filters.categoryFilter;

    const resReports = await new Action().GetReportedComments({
      subject_id: selectedSubject?.data?.id,
      category_id: selectedCategory?.data?.id,
    });

    if (!resReports?.success) throw Error("Can't fetch reports");

    if (resReports.users_data.length > 0)
      resReports.users_data.forEach(this.StoreUser.bind(this));

    if (resReports.data?.items?.length > 0)
      resReports.data.items.forEach(this.InitContent.bind(this));
  }

  async FetchCorrectionReports() {
    const { selectedSubject } = this.filters.subjectFilter;

    const resReports = await new Action().GetCorrectedContents({
      subject_id: selectedSubject?.data?.id,
      category_id: 999,
    });

    if (!resReports?.success) throw Error("Can't fetch reports");

    if (resReports.users_data.length > 0)
      resReports.users_data.forEach(this.StoreUser.bind(this));

    if (resReports.data?.items?.length > 0)
      resReports.data.items.forEach(this.InitContent.bind(this));
  }

  InitContent(data: ReportedContentDataType) {
    // console.log(data);
    let content;

    if (data.model_type_id === 1) content = new Question(this.main, data);
    else if (data.model_type_id === 2) content = new Answer(this.main, data);
    else if (data.model_type_id === 45) content = new Comment(this.main, data);
    else return;

    if (this.main.contents.byGlobalId[content.globalId]) return;

    this.main.contents.all.push(content);

    if (content.contentType !== "Comment")
      this.main.contents.byGlobalId[content.globalId] = content;

    if (content.data.task_id)
      this.main.questionsWaitingForSubscription.push(content.data.task_id);

    if (
      this.main.filterLabelContainer.childElementCount === 0 ||
      this.CompareContentWithFilters(content)
    ) {
      this.main.contents.filtered.push(content);
    }
  }

  StoreUser(data: UsersDataInReportedContentsType) {
    if (!data.id) return;

    this.main.userData[data.id] = data;
  }

  async FetchExtraDetails() {
    const entries = Object.entries(this.main.contents.byGlobalId)
      // $FlowFixMe
      .map(([globalId, content], i) => {
        if (content.extraData || content instanceof Comment) return undefined;

        return `c${
          i + 1
        }: ${content.contentType.toLowerCase()}(id: "${globalId}") {
        ...${
          content.contentType === "Question"
            ? "QuestionFragment"
            : "AnswerFragment"
        }
      }`;
      })
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!entries) return;

    let query = `query {
      ${entries}
    }`;

    if (entries.includes("QuestionFragment"))
      query += `
      fragment QuestionFragment on Question {
        id
        isPopular
        attachments {
          id
        }
      }`;

    if (entries.includes("AnswerFragment"))
      query += `
      fragment AnswerFragment on Answer {
        id
        rating
        isBest
        ratesCount
        thanksCount
        attachments {
          id
        }
        question {
          id
        }
      }`;

    const data = {
      operationName: "",
      variables: {},
      query,
    };

    const resExtraData: {
      data: {};
    } = await new Action().GQL().POST(data);

    if (!resExtraData?.data) return;

    Object.values(resExtraData.data).forEach(
      // $FlowFixMe
      (extraData: { id?: string }) => {
        if (!extraData?.id) return;

        const content = this.main.contents.byGlobalId[extraData.id];

        if (!content || content instanceof Comment) return;

        // @ts-expect-error
        content.extraData = extraData;

        if (content.container && content.RenderExtraDetails) {
          content.RenderExtraDetails();
        }
      },
    );
  }

  FilterContents() {
    if (this.main.filterLabelContainer.childElementCount === 0) {
      this.main.contents.filtered = this.main.contents.all.slice();

      return;
    }

    this.main.contents.filtered = this.main.contents.all.filter(
      this.CompareContentWithFilters.bind(this),
    );
  }

  CompareContentWithFilters(content: Content) {
    HideElement(content.container);

    return this.main.queue.filter.all.some(filter => {
      return filter.CompareContent(content);
    });
  }
}
