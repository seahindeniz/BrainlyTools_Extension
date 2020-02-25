import {
  Flex,
} from "@/scripts/components/style-guide";
import moment from "moment";
import 'moment/min/locales';
import QuestionReport from "./Report/QuestionReport";
import AnswerReport from "./Report/AnswerReport";
import CommentReport from "./Report/CommentReport";

class OpenedToplayerTracker {
  /**
   * @param {import("./").default} main
   * @param {import("./Report").ZdnObject} zdnObject
   */
  constructor(main, zdnObject) {
    this.main = main;
    this.zdnObject = zdnObject;
    this.openToplayerButton = zdnObject.elements.openToplayerButton[0];

    if (!this.openToplayerButton)
      return;

    this.BindHandler();
  }
  BindHandler() {
    this.openToplayerButton
      .addEventListener("click", this.ButtonClicked.bind(this));
  }
  ButtonClicked() {
    if (this.zdnObject.data.disabled || this.zdnObject.data.removed)
      return;

    this.main.main.lastActiveReport = this.zdnObject;
  }
}
export default class ReportBoxEnhancer {
  /**
   * @param {import("../../").default} main
   */
  constructor(main) {
    this.main = main;
    this.queueContainer = Flex({
      justifyContent: "space-evenly",
      className: "content",
      wrap: true
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
      this.main.moderationItemContainer
    );
  }
  ObserveQueue() {
    let observer = new MutationObserver(this.InitItems.bind(this));

    observer.observe(this.main.moderationItemContainer, { childList: true });
  }
  InitItems() {
    let moderationItems = this.main.moderationItemContainer
      .querySelectorAll(".moderation-item");

    if (moderationItems && moderationItems.length > 0)
      moderationItems.forEach(this.InitItem.bind(this));

    this.ReplaceTimeStrings();
  }
  /**
   * @param {HTMLDivElement} item
   */
  InitItem(item) {
    if (!item)
      throw "";

    let hash = item.getAttribute("objecthash");

    if (!hash)
      throw "Element doesn't have a objecthash";

    /**
     * @type {import("./Report").ZdnObject}
     */
    let zdnObject = Zadanium.getObject(hash);

    if (
      !(item instanceof HTMLDivElement) ||
      !item.classList.contains("moderation-item") ||
      !zdnObject.elements.main[0].classList.contains("moderation-item")
    )
      throw "Element is not moderation-item";

    if (!zdnObject)
      return;

    let model_type_id = zdnObject.data.model_type_id;
    let _ReportController = this.reportControllers[model_type_id];
    new _ReportController(this, zdnObject);
    new OpenedToplayerTracker(this, zdnObject);
  }
  ReplaceTimeStrings() {
    /**
     * @type {HTMLSpanElement[]}
     */
    // @ts-ignore
    let timeContainers = this.queueContainer.querySelectorAll(
      "div.moderation-item > div.content > div.footer span.span.pull-right"
    );

    if (!timeContainers || timeContainers.length == 0)
      return;

    timeContainers.forEach(timeContainer => {
      let dateString = timeContainer.dataset.time;

      if (!dateString)
        return;

      let date = moment(dateString);
      let fromNow = date.fromNow();

      if (timeContainer.firstChild.nodeValue != fromNow)
        timeContainer.firstChild.nodeValue = fromNow;
    })
  }
}
