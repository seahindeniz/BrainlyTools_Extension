import LayoutChanger from "./_/LayoutChanger";
import ModerateToplayerEnhancer from "./_/ModerateToplayerEnhancer";
import Pagination from "./_/Pagination";
import ReportBoxEnhancer from "./_/ReportBoxEnhancer";

export default class ModerateAll {
  constructor() {
    if (!Zadanium || !Zadanium.getObject)
      throw "Can't find Zadanium";

    /**
     * @type {import("./_/ReportBoxEnhancer/Report").ZdnObject}
     */
    this.lastActiveReport = undefined;
    /**
     * @type {HTMLDivElement}
     */
    this.moderationItemContainer = document
      .querySelector("#moderation-all > .content");
    /**
     * @type {HTMLDivElement}
     */
    this.top = document.querySelector("#moderation-all > .top");

    this.reportBoxEnhancer = new ReportBoxEnhancer(this);
    new ModerateToplayerEnhancer(this);
    new Pagination();
    this.ObserveTopSection();
  }
  async ObserveTopSection() {
    let observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0)
          this.InitTopComponents();
      })
    });

    observer.observe(this.top, { childList: true });
  }
  InitTopComponents() {
    new LayoutChanger(this);
  }
  /**
   * @param {HTMLElement} element
   */
  HideElement(element) {
    if (element && element.parentNode && element.parentNode.removeChild)
      element.parentNode.removeChild(element);
  }
}

new ModerateAll();
