/* eslint-disable no-new */
import WaitForElement from "@root/scripts/helpers/WaitForElement";
import LayoutChanger from "./_/LayoutChanger";
import ModerateToplayerEnhancer from "./_/ModerateToplayerEnhancer";
import Pagination from "./_/Pagination";
import ReportBoxEnhancer from "./_/ReportBoxEnhancer";
import type { ZdnObject } from "./_/ReportBoxEnhancer/Report";

export default class ModerateAll {
  lastActiveReport: ZdnObject;
  moderationItemContainer: HTMLElement;
  top: HTMLDivElement;
  layoutChanger: LayoutChanger;
  reportBoxEnhancer: ReportBoxEnhancer;
  pagination: Pagination;

  constructor() {
    if (!Zadanium || !Zadanium.getObject) throw Error("Can't find Zadanium");

    this.lastActiveReport = undefined;

    this.Init();
  }

  async Init() {
    this.moderationItemContainer = await WaitForElement(
      "#moderation-all > .content",
    );
    this.top = document.querySelector("#moderation-all > .top");
    this.layoutChanger = new LayoutChanger(this);
    this.reportBoxEnhancer = new ReportBoxEnhancer(this);
    this.pagination = new Pagination(this);

    new ModerateToplayerEnhancer(this);

    this.ObserveTopSection();
  }

  async ObserveTopSection() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) this.InitTopComponents();
      });
    });

    observer.observe(this.top, { childList: true });
  }

  InitTopComponents() {
    this.layoutChanger.Init();
  }
}

new ModerateAll();
