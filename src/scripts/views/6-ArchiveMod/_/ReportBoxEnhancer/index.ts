/* eslint-disable camelcase */
import { Flex } from "@root/scripts/components/style-guide";
import moment from "moment";
import "moment/min/locales";
import QuestionReport from "./Report/QuestionReport";
import AnswerReport from "./Report/AnswerReport";
import CommentReport from "./Report/CommentReport";
import type ArchiveModClassType from "../..";

export default class ReportBoxEnhancer {
  main: ArchiveModClassType;
  queueContainer: import("@style-guide/Flex").FlexElementType;
  reportControllers: {
    1: typeof QuestionReport;
    2: typeof AnswerReport;
    45: typeof CommentReport;
  };

  constructor(main: ArchiveModClassType) {
    this.main = main;
    this.queueContainer = Flex({
      justifyContent: "space-evenly",
      className: "content",
      wrap: true,
    });

    this.reportControllers = {
      1: QuestionReport,
      2: AnswerReport,
      45: CommentReport,
    };

    this.PlaceNewModAllContainer();
    this.ObserveQueue();
    moment.locale(navigator.language);
    this.ReplaceTimeStrings();
    setInterval(this.ReplaceTimeStrings.bind(this), 1000);
  }

  PlaceNewModAllContainer() {
    this.main.moderationItemContainer.parentElement.insertBefore(
      this.queueContainer,
      this.main.moderationItemContainer,
    );
  }

  ObserveQueue() {
    const observer = new MutationObserver(this.InitItems.bind(this));

    observer.observe(this.main.moderationItemContainer, { childList: true });
  }

  InitItems() {
    const moderationItems = this.main.moderationItemContainer.querySelectorAll(
      ".moderation-item",
    );

    if (moderationItems && moderationItems.length > 0)
      moderationItems.forEach(this.InitItem.bind(this));

    this.ReplaceTimeStrings();
  }

  /**
   * @param {HTMLDivElement} item
   */
  InitItem(item) {
    if (!item) throw Error("");

    const hash = item.getAttribute("objecthash");

    if (!hash) throw Error("Element doesn't have a objecthash");

    /**
     * @type {import("./Report").ZdnObject}
     */
    const zdnObject = Zadanium.getObject(hash);

    if (
      !(item instanceof HTMLDivElement) ||
      !item.classList.contains("moderation-item") ||
      !zdnObject.elements.main[0].classList.contains("moderation-item")
    )
      throw Error("Element is not moderation-item");

    if (!zdnObject) return;

    const { model_type_id } = zdnObject.data;
    const ReportController = this.reportControllers[model_type_id];
    // eslint-disable-next-line no-new
    new ReportController(this, zdnObject);
  }

  ReplaceTimeStrings() {
    const timeContainers: HTMLSpanElement[] = this.queueContainer.querySelectorAll(
      "div.moderation-item > div.content > div.footer span.span.pull-right",
    ) as any;

    if (!timeContainers || timeContainers.length === 0) return;

    timeContainers.forEach(timeContainer => {
      const dateString = timeContainer.dataset.time;

      if (!dateString) return;

      const date = moment(dateString);
      const fromNow = date.fromNow();

      if (timeContainer.firstChild.nodeValue !== fromNow)
        timeContainer.firstChild.nodeValue = fromNow;
    });
  }
}
