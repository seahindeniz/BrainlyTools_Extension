/* eslint-disable no-new */
import ModerationToplayer from "./ModerationToplayer";
import ReportSwitcher from "./ReportSwitcher";
import type ArchiveModClassType from "../..";
import type { ZdnObject } from "../ReportBoxEnhancer/Report";

export default class ModerateToplayerEnhancer {
  main: ArchiveModClassType;
  toplayerContainer: HTMLDivElement;
  containerCenterMod: HTMLDivElement;
  moderationToplayerContainer: any;

  toplayerZdnObject: {
    show: () => void;
    setMessage: (msg: string, type?: string) => void;
  } & ZdnObject;

  constructor(main: ArchiveModClassType) {
    this.main = main;
    this.toplayerContainer = document.querySelector("#toplayer");

    this.ObserveToplayerContainer();
  }

  ObserveToplayerContainer() {
    const observer = new MutationObserver(mutations => {
      if (!mutations || mutations.length === 0) return;

      mutations.forEach(this.InitToplayerContainerComponents.bind(this));
    });

    observer.observe(this.toplayerContainer, { childList: true });
  }

  /**
   * @param {MutationRecord} mutation
   */
  InitToplayerContainerComponents(mutation) {
    if (!mutation || !mutation.addedNodes || mutation.addedNodes.length === 0)
      return;

    const containerCenterMod = mutation.addedNodes[0];

    if (
      !(containerCenterMod instanceof HTMLDivElement) ||
      !containerCenterMod.classList.contains("mod")
    )
      return;

    this.containerCenterMod = containerCenterMod;

    const containerCenterModHash = containerCenterMod.getAttribute(
      "objecthash",
    );

    this.toplayerZdnObject = Zadanium.getObject(containerCenterModHash);
    this.moderationToplayerContainer = containerCenterMod.querySelector(
      ":scope > div.moderation > div.content",
    );

    this.ObserveModerationToplayerContainer();
    new ReportSwitcher(this);
  }

  ObserveModerationToplayerContainer() {
    const observer = new MutationObserver(mutations => {
      if (!mutations || mutations.length === 0) return;

      mutations.forEach(this.InitSections.bind(this));
    });

    observer.observe(this.moderationToplayerContainer, { childList: true });
  }

  /**
   * @param {MutationRecord} mutation
   */
  async InitSections(mutation) {
    if (!mutation || !mutation.addedNodes || mutation.addedNodes.length === 0)
      return;

    const moderationToplayer = mutation.addedNodes[0];

    if (
      !(moderationToplayer instanceof HTMLDivElement) ||
      !moderationToplayer.classList.contains("moderation-toplayer")
    )
      return;

    new ModerationToplayer(this, moderationToplayer);
  }
}
