import ModerationToplayer from "./ModerationToplayer";
import ReportSwitcher from "./ReportSwitcher";

export default class ModerateToplayerEnhancer {
  /**
   * @param {import("../../").default} main
   */
  constructor(main) {
    this.main = main;
    this.toplayerContainer = document.querySelector("#toplayer");

    this.ObserveToplayerContainer();
  }
  ObserveToplayerContainer() {
    let observer = new MutationObserver(mutations => {
      if (!mutations || mutations.length == 0)
        return;

      mutations.forEach(this.InitToplayerContainerComponents.bind(this));
    });

    observer.observe(this.toplayerContainer, { childList: true });
  }
  /**
   * @param {MutationRecord} mutation
   */
  InitToplayerContainerComponents(mutation) {
    if (
      !mutation ||
      !mutation.addedNodes ||
      mutation.addedNodes.length == 0
    )
      return;

    let containerCenterMod = mutation.addedNodes[0];

    if (
      !(containerCenterMod instanceof HTMLDivElement) ||
      !containerCenterMod.classList.contains("mod")
    )
      return;

    this.containerCenterMod = containerCenterMod;
    let containerCenterModHash = containerCenterMod
      .getAttribute("objecthash");
    /**
     * @type {{
     *  show: () => void,
     *  setMessage: (msg: string, type?: string) => void,
     * } & import("../ReportBoxEnhancer/Report").ZdnObject}
     */
    this.toplayerZdnObject = Zadanium.getObject(containerCenterModHash);
    this.moderationToplayerContainer = containerCenterMod
      .querySelector(":scope > div.moderation > div.content");

    this.ObserveModerationToplayerContainer();
    new ReportSwitcher(this);
  }
  ObserveModerationToplayerContainer() {
    let observer = new MutationObserver(mutations => {
      if (!mutations || mutations.length == 0)
        return;

      mutations.forEach(this.InitSections.bind(this));
    });

    observer.observe(this.moderationToplayerContainer, { childList: true });
  }
  /**
   * @param {MutationRecord} mutation
   */
  async InitSections(mutation) {
    if (
      !mutation ||
      !mutation.addedNodes ||
      mutation.addedNodes.length == 0
    )
      return;

    let moderationToplayer = mutation.addedNodes[0];

    if (
      !(moderationToplayer instanceof HTMLDivElement) ||
      !moderationToplayer.classList.contains("moderation-toplayer")
    )
      return;

    new ModerationToplayer(this, moderationToplayer);
  }
}
