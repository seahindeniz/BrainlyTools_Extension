import type {
  ReportedContentDataType,
  UsersDataInReportedContentsType,
} from "@root/controllers/Req/Brainly/Action";
import Action from "@root/controllers/Req/Brainly/Action";
import notification from "@components/notification2";
import Chunkify from "@root/scripts/helpers/Chunkify";
import HideElement from "@root/scripts/helpers/HideElement";
import IsVisible from "@root/scripts/helpers/IsVisible";
import { Flex, Spinner } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import Answer from "../Content/Answer";
import Comment from "../Content/Comment";
import Content from "../Content/Content";
import Question from "../Content/Question";
import type ReportedContentsType from "../ReportedContents";
import FetchAll from "./FetchAll";
import Filters from "./Filters/Filters";
import PageNumbers from "./PageNumbers/PageNumbers";

export type ContentClassTypes = Question | Answer | Comment;

export default class Fetcher {
  main: ReportedContentsType;
  lastId: number;

  container: FlexElementType;
  queueSpinnerContainer: FlexElementType;
  statusBarSpinnerContainer: FlexElementType;
  isFetching: boolean;
  stopFetching: boolean;
  filtersSpinner: HTMLDivElement;

  filters: Filters;
  pagination: PageNumbers;
  fetchAll: FetchAll;

  constructor(main: ReportedContentsType) {
    this.main = main;

    this.Render();
    this.RenderSpinner();

    this.filters = new Filters(this);
    this.pagination = new PageNumbers(this);

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
    this.queueSpinnerContainer = Flex({
      margin: "m",
      justifyContent: "center",
      children: Spinner({
        size: "xxxlarge",
      }),
    });

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
  }: {
    fetchOnly?: boolean;
    keepFetching?: boolean;
    resetStore?: boolean;
  } = {}) {
    try {
      const { selectedReportType } = this.filters.reportTypeFilter;

      if (resetStore) {
        this.RemoveContents();
      }

      if (
        this.lastId === 0 ||
        this.isFetching ||
        this.stopFetching ||
        this.main.moderator?.selectedActionSection?.moderating ||
        (!resetStore && IsVisible(this.queueSpinnerContainer))
      ) {
        this.stopFetching = false;

        return;
      }

      console.error("continue to fetch");
      this.isFetching = true;

      this.ShowFilterSpinner();
      this.main.queue.EmptyFeedAnimation();

      if (!keepFetching) {
        this.ShowQueueSpinner();
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

      this.HideStatusBarSpinner();
      this.HideQueueSpinner();
      this.HideFilterSpinner();

      this.main.queue.ShowContents(true);

      this.main.liveStatus.SubscribeModeration();
      this.main.statusBar.UpdateFilteredNumber();

      if (keepFetching && this.lastId) {
        this.FetchReports({
          keepFetching,
          fetchOnly,
          resetStore,
        });
      } else {
        if (!this.lastId) {
          // this.fetchAll.HideStopButton();
          this.fetchAll.HideContainer();
        }

        if (this.main.contents.all.length > 0) {
          this.FetchExtraDetails();
        }
      }
    } catch (error) {
      console.error(error);
      notification({
        type: "error",
        text:
          error.msg ||
          System.data.locale.common.notificationMessages.somethingWentWrong,
      });

      this.HideQueueSpinner();

      this.isFetching = false;
    }
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

  ShowQueueSpinner() {
    this.main.container.append(this.queueSpinnerContainer);

    this.queueSpinnerContainer.focus();

    // return Promise.reject("block it");
    return System.Delay(50);
  }

  HideQueueSpinner() {
    HideElement(this.queueSpinnerContainer);
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

    if (resReports.users_data.length > 0)
      resReports.users_data.forEach(this.StoreUser.bind(this));

    if (resReports.data?.items?.length > 0)
      resReports.data.items.forEach(this.InitContent.bind(this));
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

    if (resReports.users_data.length > 0)
      resReports.users_data.forEach(this.StoreUser.bind(this));

    if (resReports.data?.items?.length > 0)
      resReports.data.items.forEach(this.InitContent.bind(this));
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

    if (resReports.users_data.length > 0)
      resReports.users_data.forEach(this.StoreUser.bind(this));

    if (resReports.data?.items?.length > 0)
      resReports.data.items.forEach(this.InitContent.bind(this));
  }

  InitContent(data: ReportedContentDataType) {
    // console.log(data);
    let content: Question | Answer | Comment;

    if (data.model_type_id === 1) content = new Question(this.main, data);
    else if (data.model_type_id === 2) content = new Answer(this.main, data);
    else if (data.model_type_id === 45) content = new Comment(this.main, data);
    else return;

    if (this.main.contents.byGlobalId[content.globalId]) return;

    this.main.contents.all.push(content);

    this.main.contents.byGlobalId.all[content.globalId] = content;

    if (!(content instanceof Comment))
      this.main.contents.byGlobalId.fetchDetails[content.globalId] = content;

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

  FetchExtraDetails() {
    const entries = Object.entries(this.main.contents.byGlobalId.fetchDetails)
      .map(([globalId, content], i) => {
        if (content.extraData !== undefined || content instanceof Comment)
          return undefined;

        content.extraData = null;

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
      .filter(Boolean);

    const entriesChunk = Chunkify(entries, 480);

    if (entriesChunk.length > 0)
      entriesChunk.forEach(this.FetchChunkedExtraDetails.bind(this));
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

    Object.values(resExtraData.data).forEach((extraData: { id?: string }) => {
      if (!extraData?.id) return;

      const content = this.main.contents.byGlobalId.fetchDetails[extraData.id];

      if (!content || content instanceof Comment) return;

      // @ts-expect-error
      content.extraData = extraData;

      if (content.container && content.RenderExtraDetails) {
        content.RenderExtraDetails();
      }
    });
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

  CompareContentWithFilters(content: Content) {
    if (content.has === "deleted") return false;

    HideElement(content.container);

    return this.main.queue.filter.all.every(filter => {
      return filter.CompareContent(content);
    });
  }
}
