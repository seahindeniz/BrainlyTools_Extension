import type {
  ReportedContentDataType,
  ReportedContentsDataType,
  UsersDataInReportedContentsType,
} from "@BrainlyAction";
import Action from "@BrainlyAction";
import notification from "@components/notification2";
import Chunkify from "@root/helpers/Chunkify";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Flex, Spinner } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import Answer, { AnswerExtraDataType } from "../Content/Answer";
import Comment from "../Content/Comment";
import Question, { QuestionExtraDataType } from "../Content/Question";
import type ReportedContentsType from "../ReportedContents";
import FetchAll from "./FetchAll";
import Filters from "./Filters/Filters";
import PageNumbers from "./PageNumbers/PageNumbers";

export type ContentClassTypes = Question | Answer | Comment;

export default class Fetcher {
  main: ReportedContentsType;
  lastId: number;

  container: FlexElementType;
  statusBarSpinnerContainer: FlexElementType;
  isFetching: boolean;
  stopFetching: boolean;
  filtersSpinner: HTMLDivElement;

  filters: Filters;
  pageNumbers: PageNumbers;
  fetchAll: FetchAll;

  constructor(main: ReportedContentsType) {
    this.main = main;

    this.Render();
    this.RenderSpinner();

    this.filters = new Filters(this);
    this.pageNumbers = new PageNumbers(this);

    if (System.checkUserP(18)) {
      this.fetchAll = new FetchAll(this);
    }

    this.filters.reportTypeFilter.reportTypes.questionAnswer.Selected();
  }

  Render() {
    this.container = Flex({
      relative: true,
      direction: "column",
      className: "fetcherContainer", // TODO remove this className
    });

    this.main.actionsContainer.prepend(this.container);
  }

  RenderSpinner() {
    this.statusBarSpinnerContainer = Flex({
      marginRight: "xs",
      justifyContent: "center",
      children: Spinner({
        size: "xxsmall",
      }),
    });

    this.filtersSpinner = Spinner({
      overlay: true,
      size: "xxxlarge",
    });
  }

  async FetchReports({
    fetchOnly,
    keepFetching,
    resetStore,
    lastId,
  }: {
    fetchOnly?: boolean;
    keepFetching?: boolean;
    resetStore?: boolean;
    lastId?: number;
  } = {}) {
    try {
      const { selectedReportType } = this.filters.reportTypeFilter;

      if (resetStore) {
        this.RemoveContents();
      }

      if (lastId) {
        this.lastId = lastId;
      }

      if (
        this.lastId === 0 ||
        this.isFetching ||
        this.stopFetching ||
        this.main.moderator?.selectedActionSection?.moderating ||
        (!resetStore && IsVisible(this.main.queue.spinnerContainer))
      ) {
        this.stopFetching = false;

        return undefined;
      }

      this.isFetching = true;

      this.ShowFilterSpinner();
      this.main.queue.EmptyFeedAnimation();

      if (!keepFetching) {
        this.main.queue.ShowSpinner();
      } // else await System.Delay(9999999);

      await this.ShowStatusBarSpinner();

      if (selectedReportType.typeName === "commentReports")
        await this.FetchCommentReports();
      else if (
        !selectedReportType ||
        selectedReportType.typeName === "questionAnswerReports"
      )
        await this.FetchQuestionAnswerReports();
      else if (selectedReportType.typeName === "correctionReports")
        await this.FetchCorrectionReports();

      this.isFetching = false;
      this.main.statusBar.fetchedContentsCount.nodeValue = String(
        this.main.contents.all.length,
      );

      if (this.main.contents.all.length === 0)
        this.main.queue.ShowEmptyFeedAnimation();

      this.main.queue.HideSpinner();
      this.HideFilterSpinner();

      this.main.queue.ShowContents(true);

      if (!keepFetching) {
        this.main.liveStatus.SubscribeModeration();
      }

      this.main.statusBar.UpdateFilteredNumber();

      if (keepFetching && this.lastId) {
        this.FetchReports({
          keepFetching,
          fetchOnly,
          resetStore,
        });
      } else if (!this.lastId) {
        // this.fetchAll.HideStopButton();
        this.fetchAll.HideContainer();
      } else {
        this.fetchAll.ShowContainer();
      }

      if (this.main.contents.all.length > 0) {
        this.FetchExtraDetails().then(() => {
          this.FilterContents();
          this.main.queue.ShowContents(true);
          this.HideStatusBarSpinner();
        });
      }
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        text:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });

      this.main.queue.HideSpinner();

      this.isFetching = false;

      return Promise.reject(error);
    }

    return Promise.resolve();
  }

  RemoveContents() {
    this.lastId = undefined;

    this.main.moderator?.ResetSections();

    if (this.main.contents.all.length > 0) {
      this.main.contents.all.forEach(
        content => content.container && content.container.remove(),
      );

      this.main.contents.all = [];
      this.main.contents.filtered = [];
    }
  }

  ShowStatusBarSpinner() {
    this.main.statusBar.container.append(this.statusBarSpinnerContainer);

    return System.Delay(50);
  }

  HideStatusBarSpinner() {
    HideElement(this.statusBarSpinnerContainer);
  }

  ShowFilterSpinner() {
    if (IsVisible(this.filtersSpinner)) return;

    this.container.append(this.filtersSpinner);
  }

  HideFilterSpinner() {
    HideElement(this.filtersSpinner);
  }

  async FetchQuestionAnswerReports() {
    const { selectedSubject } = this.filters.subjectFilter;
    const { selectedCategory } = this.filters.categoryFilter;
    const resReports = await new Action().GetReportedContents({
      category_id: selectedCategory?.data?.id,
      last_id: this.lastId,
      subject_id: selectedSubject?.data?.id,
    });

    if (!resReports?.success) throw Error("Can't fetch reports");

    this.lastId = resReports.data.last_id;

    this.UpdateReportTypeCounts(resReports.data);

    if (resReports.users_data.length > 0)
      resReports.users_data.forEach(this.StoreUser.bind(this));

    if (resReports.data?.items?.length > 0) {
      const numberOfFilters = this.main.queue.filter.inUse.length;

      resReports.data.items.forEach(data =>
        this.InitContent(data, numberOfFilters),
      );
    }
  }

  async FetchCommentReports() {
    const { selectedSubject } = this.filters.subjectFilter;
    const { selectedCategory } = this.filters.categoryFilter;

    const resReports = await new Action().GetReportedComments({
      category_id: selectedCategory?.data?.id,
      last_id: this.lastId,
      subject_id: selectedSubject?.data?.id,
    });

    if (!resReports?.success) throw Error("Can't fetch reports");

    this.lastId = resReports.data.last_id;

    this.UpdateReportTypeCounts(resReports.data);

    if (resReports.users_data.length > 0)
      resReports.users_data.forEach(this.StoreUser.bind(this));

    if (resReports.data?.items?.length > 0) {
      const numberOfFilters = this.main.queue.filter.inUse.length;

      resReports.data.items.forEach(data =>
        this.InitContent(data, numberOfFilters),
      );
    }
  }

  async FetchCorrectionReports() {
    const { selectedSubject } = this.filters.subjectFilter;

    const resReports = await new Action().GetCorrectedContents({
      category_id: 999,
      last_id: this.lastId,
      subject_id: selectedSubject?.data?.id,
    });

    if (!resReports?.success) throw Error("Can't fetch reports");

    this.lastId = resReports.data.last_id;

    this.UpdateReportTypeCounts(resReports.data);

    if (resReports.users_data.length > 0)
      resReports.users_data.forEach(this.StoreUser.bind(this));

    if (resReports.data?.items?.length > 0) {
      const numberOfFilters = this.main.queue.filter.inUse.length;

      resReports.data.items.forEach(data =>
        this.InitContent(data, numberOfFilters),
      );
    }
  }

  UpdateReportTypeCounts(res: ReportedContentsDataType) {
    this.filters.reportTypeFilter.reportTypes.questionAnswer.numberOfReports.nodeValue = String(
      res.total_count,
    );
    this.filters.reportTypeFilter.reportTypes.comment.numberOfReports.nodeValue = String(
      res.comment_count,
    );
    this.filters.reportTypeFilter.reportTypes.correction.numberOfReports.nodeValue = String(
      res.corrected_count,
    );
  }

  InitContent(data: ReportedContentDataType, numberOfFilters: number) {
    let content: Question | Answer | Comment;

    if (data.model_type_id === 1) content = new Question(this.main, data);
    else if (data.model_type_id === 2) content = new Answer(this.main, data);
    else if (data.model_type_id === 45) content = new Comment(this.main, data);
    else return;

    if (this.main.contents.byGlobalId[content.globalId]) return;

    this.main.contents.all.push(content);
    this.main.contents.waitingForExtraDetails.push(content);

    this.main.contents.byGlobalId.all[content.globalId] = content;

    if (!(content instanceof Comment))
      this.main.contents.byGlobalId.fetchDetails[content.globalId] = content;

    if (content.data.task_id)
      this.main.questionsWaitingForSubscription.push(content.data.task_id);

    if (numberOfFilters === 0 || this.CompareContentWithFilters(content)) {
      this.main.contents.filtered.push(content);
    }
  }

  StoreUser(data: UsersDataInReportedContentsType) {
    if (!data.id) return;

    this.main.userData[data.id] = data;
  }

  async FetchExtraDetails() {
    const nextContents = this.main.contents.waitingForExtraDetails.splice(0);
    const entries = nextContents
      .map((content, i) => {
        if (content.contentType === "Comment") return undefined;

        if (content.extraData !== undefined || content instanceof Comment)
          return undefined;

        return `c${i + 1}: ${content.contentType.toLowerCase()}(id: "${
          content.globalId
        }") {
          ...${
            content.contentType === "Question"
              ? "QuestionFragment"
              : "AnswerFragment"
          }
        }`;
      })
      .filter(Boolean);

    const entriesChunk = Chunkify(entries, 480);

    if (entriesChunk.length === 0) return undefined;

    return Promise.all(
      entriesChunk.map(this.FetchChunkedExtraDetails.bind(this)),
    );
  }

  private async FetchChunkedExtraDetails(entries: string[]) {
    const queryContent = entries.join("\n").trim();

    if (!queryContent) return;

    let query = `query {
      ${queryContent}
    }`;

    if (queryContent.includes("QuestionFragment"))
      query += `
      fragment QuestionFragment on Question {
        id
        isPopular
        attachments {
          id
        }
        answers {
          hasVerified
          nodes {
            author {
              id
              nick
            }
            verification {
              approval {
                approvedTime
                approver {
                  id
                  nick
                }
              }
            }
          }
        }
      }`;

    if (queryContent.includes("AnswerFragment"))
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
      }`;

    const data = {
      operationName: "",
      variables: {},
      query,
    };

    const resExtraData: {
      data: { [x: string]: any };
    } = await new Action().GQL().POST(data);

    if (!resExtraData?.data) return;

    Object.values(resExtraData.data).forEach(
      (extraData: QuestionExtraDataType | AnswerExtraDataType) => {
        if (!extraData?.id) return;

        const content = this.main.contents.byGlobalId.fetchDetails[
          extraData.id
        ];

        if (!content || content instanceof Comment) return;

        content.extraData = extraData;

        if (content.contentWrapper && content.RenderExtraDetails) {
          content.RenderExtraDetails();
          content.CalculateHeight();
        }
      },
    );
  }

  FilterContents() {
    if (this.main.filterLabelContainer.childElementCount === 0)
      this.main.contents.filtered = this.main.contents.all.slice();
    else
      this.main.contents.filtered = this.main.contents.all.filter(
        this.CompareContentWithFilters.bind(this),
      );

    this.main.statusBar.UpdateFilteredNumber();
  }

  CompareContentWithFilters(content: ContentClassTypes) {
    if (content.has === "deleted") return false;

    HideElement(content.container);

    const isFiltered = this.main.queue.filter.inUse.every(filter => {
      if (!("CompareContent" in filter)) return false;

      const isMatches = filter.CompareContent(content);

      return isMatches;
    });

    return isFiltered;
  }
}
