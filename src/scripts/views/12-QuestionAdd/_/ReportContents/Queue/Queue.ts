import CreateElement from "@components/CreateElement";
import HideElement from "@root/helpers/HideElement";
import IsVisible from "@root/helpers/IsVisible";
import { Flex } from "@style-guide";
import type ReportedContentsType from "../ReportedContents";
import AdditionalData from "./Filter/AdditionalData";
import AttachmentLength from "./Filter/AttachmentLength";
import ContentLength from "./Filter/ContentLength";
import ContentType from "./Filter/ContentType";
import Reported from "./Filter/Reported";
import Reporter from "./Filter/Reporter";
import ReportingDate from "./Filter/ReportingDate";
import Subject from "./Filter/Subject";
import ModerationPanelController from "./ModerationPanelController/ModerationPanelController";
import Options from "./Options/Options";

const REPORT_BOXES_PER_PAGE_LIMIT = 12;

export default class Queue {
  main: ReportedContentsType;
  options: Options;

  filter: {
    all: (
      | ContentType
      | ContentLength
      | AttachmentLength
      | Reporter
      | Reported
      | ReportingDate
      | Subject
      | AdditionalData
    )[];
    byName: {
      contentType: ContentType;
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
  emptyFeedAnimation: import("@style-guide/Flex").FlexElementType;

  constructor(main: ReportedContentsType) {
    this.main = main;
    this.options = new Options(this);

    this.filter = {
      byName: {
        contentType: new ContentType(this),
        contentLength: new ContentLength(this),
        attachmentLength: new AttachmentLength(this),
        reporter: new Reporter(this),
        reported: new Reported(this),
        reportingDate: new ReportingDate(this),
        subject: new Subject(this),
        additionalData: new AdditionalData(this),
      },
      all: [],
    };
    this.filter.all = Object.values(this.filter.byName);

    this.moderationPanelController = new ModerationPanelController(this);

    this.BindListener();
    setInterval(this.RenderTimes.bind(this), 5000);
  }

  RenderTimes() {
    if (this.main.queueContainer.childElementCount === 0) return;

    this.main.contents.filtered.forEach(content => content.RenderTimes());
  }

  BindListener() {
    window.addEventListener("scroll", this.Scrolled.bind(this));
  }

  Scrolled() {
    if (!document.body) return;

    const percent =
      ((window.innerHeight + window.pageYOffset) * 100) /
      document.body.scrollHeight;

    if (percent < 90) return;

    const { childElementCount } = this.main.queueContainer;

    if (childElementCount < REPORT_BOXES_PER_PAGE_LIMIT) return;

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
    if (this.main.contents.filtered.length === 0) return;

    let { childElementCount } = this.main.queueContainer;

    if (
      showLimitedAggressive === true &&
      childElementCount >= REPORT_BOXES_PER_PAGE_LIMIT
    )
      return;

    this.HideContents();

    const nextThreshold = REPORT_BOXES_PER_PAGE_LIMIT + childElementCount;

    this.main.contents.filtered.some((content, index) => {
      if (index >= nextThreshold) return true;

      if (!IsVisible(content.container)) {
        if (!content.container) {
          content.Render();
        }

        this.main.queueContainer.append(content.container);

        content.RenderTimes();
      }

      return false;
    });

    childElementCount = this.main.queueContainer.childElementCount;

    if (childElementCount > 0) {
      this.main.moderator?.ShowPanelButton();
    }

    this.main.statusBar.visibleContentsCount.nodeValue = String(
      childElementCount,
    );
  }

  HideContents() {
    this.main.statusBar.visibleContentsCount.nodeValue = "0";

    this.main.moderator?.HidePanelButton();
    this.main.contents.all.forEach(content => HideElement(content.container));
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
