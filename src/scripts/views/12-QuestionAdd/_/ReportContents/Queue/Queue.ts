// @flow

import HideElement from "@/scripts/helpers/HideElement";
import IsVisible from "@/scripts/helpers/IsVisible";
import type ReportedContentsType from "../ReportedContents";
import Options from "./Options/Options";
import Reporter from "./Filter/Reporter";
import Reported from "./Filter/Reported";
import ReportingDate from "./Filter/ReportingDate";
import ModerationPanelController from "./ModerationPanelController/ModerationPanelController";

const REPORT_PREVIEW_LIMIT = 50;

export default class Queue {
  main: ReportedContentsType;
  options: Options;

  filter: {
    all: (Reporter | Reported | ReportingDate)[],
    byName: {
      reporter: Reporter,
      reported: Reported,
      reportingDate: ReportingDate,
    },
  };

  moderationPanelController: ModerationPanelController;

  constructor(main: ReportedContentsType) {
    this.main = main;
    this.options = new Options(this);

    this.filter = {
      byName: {
        reporter: new Reporter(this),
        reported: new Reported(this),
        reportingDate: new ReportingDate(this),
      },
      all: [],
    };

    this.moderationPanelController = new ModerationPanelController(this);

    // $FlowFixMe
    this.filter.all = Object.values(this.filter.byName);

    this.BindListener();
    setInterval(this.RenderTimes.bind(this), 5000);
  }

  RenderTimes() {
    if (this.main.queueContainer.childElementCount === 0) return;

    this.main.contents.filtered.forEach(content => {
      if (!content.container || !IsVisible(content.container)) return;

      const currentCreationTime = content.dates.create.moment.fromNow(true);

      if (
        content.dates.create.lastPrintedRelativeTime !== currentCreationTime
      ) {
        content.createDateText.innerText = currentCreationTime;
        content.dates.create.lastPrintedRelativeTime = currentCreationTime;
      }

      if (content.reportDateText && content.dates.report) {
        const currentReportingTime = content.dates.report.moment.fromNow();

        if (
          content.dates.report &&
          content.dates.report.lastPrintedRelativeTime !== currentReportingTime
        ) {
          content.dates.report.lastPrintedRelativeTime = currentReportingTime;
          content.reportDateText.innerText = currentReportingTime;
        }
      }
    });
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

    this.ShowContents(true);
  }

  ShowContents(increase?: boolean) {
    console.log("show contents", this.main.contents.filtered.length);
    if (
      this.main.contents.filtered.length === 0 ||
      this.main.queueContainer.childElementCount ===
        this.main.contents.filtered.length
    )
      return;

    let increaseBy = 0;

    if (increase)
      increaseBy = Math.trunc(
        this.main.queueContainer.childElementCount / REPORT_PREVIEW_LIMIT,
      );

    let reportIndex = REPORT_PREVIEW_LIMIT * increaseBy;

    console.log(
      this.main.queueContainer.childElementCount,
      REPORT_PREVIEW_LIMIT,
      increaseBy,
      reportIndex,
    );

    for (
      ;
      reportIndex < REPORT_PREVIEW_LIMIT * (1 + increaseBy);
      reportIndex++
    ) {
      let content = this.main.contents.filtered[reportIndex];

      if (!content) break;

      if (!content.container) content.Render();

      this.main.queueContainer.append(content.container);

      content = null;
    }

    this.RenderTimes();
  }

  HideContents() {
    this.main.contents.all.forEach(content => HideElement(content.container));
  }
}
