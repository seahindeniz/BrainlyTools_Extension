import LayoutChanger from "./_/LayoutChanger";
import ModerateToplayerEnhancer from "./_/ModerateToplayerEnhancer";
import Pagination from "./_/Pagination";
import ReportBoxEnhancer from "./_/ReportBoxEnhancer";

export default class ModerateAll {
  constructor() {
    if (!Zadanium || !Zadanium.getObject) throw Error("Can't find Zadanium");

    /**
     * @type {import("./_/ReportBoxEnhancer/Report").ZdnObject}
     */
    this.lastActiveReport = undefined;
    /**
     * @type {HTMLDivElement}
     */
    this.moderationItemContainer = document.querySelector(
      "#moderation-all > .content",
    );
    /**
     * @type {HTMLDivElement}
     */
    this.top = document.querySelector("#moderation-all > .top");
    this.layoutChanger = new LayoutChanger(this);

    this.reportBoxEnhancer = new ReportBoxEnhancer(this);
    new ModerateToplayerEnhancer(this);
    new Pagination();
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

  /**
   * @param {HTMLElement} element
   */
  // eslint-disable-next-line class-methods-use-this
  HideElement(element) {
    if (element && element.parentNode && element.parentNode.removeChild)
      element.parentNode.removeChild(element);
  }
}

// eslint-disable-next-line no-unused-vars
const moderateAll = new ModerateAll();
