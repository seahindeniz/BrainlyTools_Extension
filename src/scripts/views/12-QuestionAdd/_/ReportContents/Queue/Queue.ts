import CreateElement from "@components/CreateElement";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Button, Flex, Spinner } from "@style-guide";
import type { FlexElementType } from "@style-guide/Flex";
import type ContentClassType from "../Content/Content";
import type ReportedContentsType from "../ReportedContents";
import AdditionalData from "./Filter/StringFilter/AdditionalData";
import AttachmentLength from "./Filter/AttachmentLength";
import ContentLength from "./Filter/ContentLength";
import ContentType from "./Filter/ContentType";
import type QueueFilterClassType from "./Filter/QueueFilter";
import Reported from "./Filter/User/Reported";
import Reporter from "./Filter/User/Reporter";
import ReportingDate from "./Filter/ReportingDate";
import Subject from "./Filter/Subject";
import ModerationPanelController from "./ModerationPanelController/ModerationPanelController";
import Options from "./Options/Options";
import QueryBuilder from "./QueryBuilder/QueryBuilder";
import Content from "./Filter/StringFilter/Content";

export default class Queue {
  main: ReportedContentsType;
  options: Options;

  filter: {
    [x in "all" | "inUse"]: (
      | QueueFilterClassType
      | ContentType
      | ContentLength
      | AttachmentLength
      | Reporter
      | Reported
      | ReportingDate
      | Subject
      | AdditionalData
    )[];
  } & {
    byName: {
      contentType: ContentType;
      content: Content;
      contentLength: ContentLength;
      attachmentLength: AttachmentLength;
      reporter: Reporter;
      reported: Reported;
      reportingDate: ReportingDate;
      subject: Subject;
      additionalData: AdditionalData;
    };
  };

  moderationPanelController: ModerationPanelController;
  emptyFeedAnimation: FlexElementType;
  observer?: IntersectionObserver;
  focusedContent: ContentClassType;
  spinnerContainer: FlexElementType;
  loadMoreButtonContainer: FlexElementType;

  queryBuilder: QueryBuilder;

  constructor(main: ReportedContentsType) {
    this.main = main;
    this.options = new Options(this);

    this.filter = {
      byName: {
        contentType: new ContentType(this),
        content: new Content(this),
        contentLength: new ContentLength(this),
        attachmentLength: new AttachmentLength(this),
        reporter: new Reporter(this),
        reported: new Reported(this),
        reportingDate: new ReportingDate(this),
        subject: new Subject(this),
        additionalData: new AdditionalData(this),
      },
      all: [],
      inUse: [],
    };
    this.filter.all = Object.values(this.filter.byName);

    this.queryBuilder = new QueryBuilder(this);
    this.moderationPanelController = new ModerationPanelController(this);

    this.RenderSpinner();
    this.InitIntersectionObserver();
    this.BindListener();
    setInterval(this.RenderTimes.bind(this), 5000);
  }

  RenderSpinner() {
    this.spinnerContainer = Flex({
      margin: "m",
      justifyContent: "center",
      children: Spinner({
        size: "xxxlarge",
      }),
    });
  }

  RenderTimes() {
    if (this.main.queueContainer.childElementCount === 0) return;

    this.main.contents.filtered.forEach(content => content.RenderTimes());
  }

  InitIntersectionObserver() {
    if (!this.main.defaults.lazyQueue || !this.main.defaults.autoQueueLoader)
      return;

    this.observer = new IntersectionObserver(
      entries => {
        if (entries.length >= this.main.defaults.loadLimit) return;
        entries.forEach(async entry => {
          if (
            !(entry.target instanceof HTMLElement) ||
            !entry.target.style.minHeight
          )
            return;

          const content = this.main.contents.all.find(
            _content => _content.container === entry.target,
          );
          if (!content) return;

          if (entry.isIntersecting) {
            if (!content.contentWrapper) {
              content.RenderContent();
              content.RenderTimes(true);
            } else {
              content.container.append(content.contentWrapper);
            }
          } else {
            content.DestroyContent();
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0,
      },
    );
  }

  BindListener() {
    window.addEventListener("scroll", this.Scrolled.bind(this));
  }

  Scrolled() {
    if (!document.body || !this.main.defaults.autoQueueLoader) return;

    const percent =
      ((window.innerHeight + window.pageYOffset) * 100) /
      document.body.scrollHeight;

    if (percent < 90) return;

    const { childElementCount } = this.main.queueContainer;

    if (childElementCount < this.main.defaults.loadLimit) return;

    if (
      this.main.contents.filtered.length === 0 ||
      childElementCount === this.main.contents.filtered.length
    ) {
      this.main.fetcher.FetchReports();

      return;
    }

    this.ShowContents();
  }

  async ShowContents(showLimitedAggressive?: boolean) {
    if (this.main.contents.filtered.length === 0) {
      this.main.statusBar.UpdateVisibleNumber("0");

      return;
    }

    let { childElementCount } = this.main.queueContainer;

    if (
      showLimitedAggressive === true &&
      childElementCount >= this.main.defaults.loadLimit
    )
      return;

    this.HideContents();

    this.main.queueContainer.innerHTML = "";

    const nextThreshold = this.main.defaults.loadLimit + childElementCount;

    this.main.contents.filtered.some((content, index) => {
      if (index >= nextThreshold) return true;

      if (!IsVisible(content.container)) {
        if (!content.container) {
          content.Render();
        }

        this.observer?.observe(content.container);
        this.main.queueContainer.append(content.container);

        content.RenderTimes();
      }

      return false;
    });

    childElementCount = this.main.queueContainer.childElementCount;

    if (childElementCount > 0) {
      this.main.moderator?.ShowPanelButton();
    }

    this.main.statusBar.UpdateVisibleNumber();
  }

  HideContents() {
    this.main.statusBar.UpdateVisibleNumber("0");

    this.main.moderator?.HidePanelButton();
    this.main.contents.all.forEach(content => {
      if (!content.container) return;

      HideElement(content.container);
      this.observer?.unobserve(content.container);
    });
  }

  ShowSpinner() {
    this.HideLoadMoreButton();
    this.main.container.append(this.spinnerContainer);
  }

  HideSpinner() {
    this.ShowLoadMoreButton();
    HideElement(this.spinnerContainer);
  }

  ShowLoadMoreButton() {
    if (!this.main.fetcher.lastId) return;

    if (!this.loadMoreButtonContainer) {
      this.RenderLoadMoreButton();
    }

    this.main.container.append(this.loadMoreButtonContainer);
  }

  RenderLoadMoreButton() {
    this.loadMoreButtonContainer = Flex({
      children: new Button({
        children: System.data.locale.reportedContents.queue.loadMore,
        onClick: this.LoadMore.bind(this),
        size: "l",
        type: "solid-inverted",
      }),
      justifyContent: "center",
      marginBottom: "m",
      marginTop: "m",
    });
  }

  async LoadMore() {
    const { childElementCount } = this.main.queueContainer;

    if (this.main.contents.filtered.length === childElementCount) {
      await this.main.fetcher.FetchReports();
    }

    const lastScrollPosition = document.documentElement.scrollTop;

    await this.ShowContents();

    document.documentElement.scrollTop = lastScrollPosition;
  }

  HideLoadMoreButton() {
    HideElement(this.loadMoreButtonContainer);
  }

  ShowEmptyFeedAnimation() {
    if (!this.emptyFeedAnimation) {
      this.RenderEmptyFeedAnimation();
    }

    this.main.container.append(this.emptyFeedAnimation);
  }

  EmptyFeedAnimation() {
    HideElement(this.emptyFeedAnimation);
  }

  RenderEmptyFeedAnimation() {
    this.emptyFeedAnimation = Flex({
      fullWidth: true,
      justifyContent: "center",
      children: CreateElement({
        tag: "img",
        src: `${System.data.meta.extension.URL}/images/all-good.png`,
      }),
    });
  }
}
