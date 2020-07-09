import { Button, Icon } from "@/scripts/components/style-guide";
import storage from "../../../helpers/extStorage";

export default class LayoutChanger {
  /**
   * @param {import("../").default} main
   */
  constructor(main) {
    this.main = main;
  }

  async Init() {
    this.header = this.main.top.firstElementChild;
    this.subHeader = this.main.top.lastElementChild;
    this.totalReportsSpan = this.header.querySelector(".total");
    this.totalCommentsSpan = this.header.querySelector(".total-comment");
    /**
     * @type {HTMLSelectElement}
     */
    this.filterSelect = this.subHeader.querySelector(".filters");
    this.isLayoutSwitched = await storage("get", "archive_mod_layout");

    this.RenderLayoutSwitcherButton();
    this.SetLayout();
    this.BindHandlers();
  }

  RenderLayoutSwitcherButton() {
    const buttonContainer = this.subHeader.querySelector(".pull-right");
    this.layoutSwitcherButton = new Button({
      type: "solid-blue",
      iconOnly: true,
      icon: new Icon({
        type: this.isLayoutSwitched ? "credit_card" : "bulleted_list",
      }),
    });

    if (buttonContainer)
      buttonContainer.append(this.layoutSwitcherButton.element);
  }

  BindHandlers() {
    this.layoutSwitcherButton.element.addEventListener(
      "click",
      this.SwitchLayout.bind(this),
    );
    this.totalReportsSpan.addEventListener(
      "click",
      this.SwitchToQAFeed.bind(this),
    );
    this.totalCommentsSpan.addEventListener(
      "click",
      this.SwitchToCommentFeed.bind(this),
    );

    this.filterSelect.addEventListener("change", this.FilterChanged.bind(this));
  }

  SwitchLayout() {
    this.isLayoutSwitched = !this.isLayoutSwitched;

    this.SetLayout();
    storage("set", { archive_mod_layout: this.isLayoutSwitched });
  }

  SetLayout() {
    const container = this.main.reportBoxEnhancer.queueContainer;

    if (this.isLayoutSwitched) {
      container.classList.add("listView");
      this.layoutSwitcherButton.icon.ChangeType("credit_card");
    } else {
      container.classList.remove("listView");
      this.layoutSwitcherButton.icon.ChangeType("bulleted_list");
    }
  }

  SwitchToQAFeed() {
    this.SwitchFeed(0);
  }

  SwitchToCommentFeed() {
    this.SwitchFeed(998);
  }

  /**
   * @param {number} feedKey
   */
  SwitchFeed(feedKey) {
    this.filterSelect.value = String(feedKey);
    this.filterSelect.dispatchEvent(new Event("change"));
  }

  FilterChanged() {
    if (this.filterSelect.value < 998) this.main.pagination.Show();
    else this.main.pagination.Hide();
  }
}
