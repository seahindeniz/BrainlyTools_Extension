import { Button, Icon } from "@style-guide";
import IsVisible from "@/scripts/helpers/IsVisible";
import WaitForObject from "@/scripts/helpers/WaitForObject";

export default class ReportSwitcher {
  /**
   * @param {import(".").default} main
   */
  constructor(main) {
    this.main = main;
    this.switching = false;
    /**
     * @type {HTMLDivElement}
     */
    // @ts-ignore
    this.buttonContainer = main.containerCenterMod.firstElementChild;

    this.RenderButtons();
    this.BindHandlers();
  }

  RenderButtons() {
    this.leftButton = new Button({
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({ type: "arrow_left", size: 46 }),
      size: "xl",
      className: "switch-button switch-button--left",
    });
    this.rightButton = new Button({
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({ type: "arrow_right", size: 46 }),
      size: "xl",
      className: "switch-button switch-button--right",
    });

    this.buttonContainer.prepend(this.leftButton.element);
    this.buttonContainer.append(this.rightButton.element);
  }

  BindHandlers() {
    document.addEventListener("keyup", this.KeyPressed.bind(this));
    this.leftButton.element.addEventListener(
      "click",
      this.SwitchPreviousReport.bind(this),
    );
    this.rightButton.element.addEventListener(
      "click",
      this.SwitchNextReport.bind(this),
    );

    $.ajaxSetup({
      beforeSend: this.CheckConnection.bind(this),
    });
  }

  /**
   * @param {JQueryXHR} jqXHR
   * @param {JQueryAjaxSettings} settings
   */
  async CheckConnection(jqXHR, settings) {
    jqXHR.always((_jqXHR, status) => {
      if (
        status == "success" &&
        settings.url == "/api/28/moderation_new/get_content"
      ) {
        this.switching = false;

        if (_jqXHR && !_jqXHR.success && _jqXHR.message)
          this.main.toplayerZdnObject.setMessage(_jqXHR.message, "info");
      }
    });
  }

  /**
   * @param {KeyboardEvent} event
   */
  KeyPressed(event) {
    const toplayer = this.main.toplayerZdnObject.elements.main[0];

    if (
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.metaKey ||
      !IsVisible(toplayer) ||
      (event.target && event.target instanceof HTMLInputElement) ||
      event.target instanceof HTMLSelectElement ||
      event.target instanceof HTMLOptionElement ||
      event.target instanceof HTMLTextAreaElement
    )
      return;

    if (event.code == "Escape") this.CloseToplayer();
    else if (event.code == "KeyA" || event.code == "ArrowLeft")
      this.SwitchPreviousReport();
    else if (event.code == "KeyD" || event.code == "ArrowRight")
      this.SwitchNextReport();
  }

  CloseToplayer() {
    this.main.toplayerZdnObject.elements.close.click();
  }

  SwitchPreviousReport() {
    this.SwitchReport("previous");
  }

  SwitchNextReport() {
    this.SwitchReport("next");
  }

  /**
   * @param {"previous" | "next"} target
   */
  async SwitchReport(target) {
    const { lastActiveReport } = this.main.main;

    if (this.switching || !lastActiveReport) return;

    this.switching = true;

    const lastActiveReportHash = lastActiveReport.elements.main[0].getAttribute(
      "objecthash",
    );
    const lastActiveReportIndex = Zadanium.moderation.all.createdObjects.findIndex(
      /**
       * @param {import("../ReportBoxEnhancer/Report").ZdnObject} object
       */
      object => {
        const currentHash = object.elements.main[0].getAttribute("objecthash");
        return lastActiveReportHash == currentHash;
      },
    );

    const switchableReport = await this.GetSwitchableReport(
      lastActiveReportIndex,
      target,
    );

    if (!switchableReport) {
      this.switching = false;

      return this.main.toplayerZdnObject.setMessage("There is no report left");
    }

    this.CloseToplayer();
    this.main.toplayerZdnObject.show();
    switchableReport.elements.openToplayerButton.click();
  }

  GetActiveModerationToplayer() {
    /**
     * @type {import("../ReportBoxEnhancer/Report").ZdnObject}
     */
    const activeModerationToplayer = Zadanium.toplayer.createdObjects.find(
      /**
       * @param {import("../ReportBoxEnhancer/Report").ZdnObject} object
       */
      object => {
        return object.data.visible && !!object.data.timeInterval;
      },
    );

    return activeModerationToplayer;
  }

  /**
   * @param {number} activeReportIndex
   * @param {"previous" | "next"} target
   */
  async GetSwitchableReport(activeReportIndex, target) {
    /**
     * @type {import("../ReportBoxEnhancer/Report").ZdnObject}
     */
    const report =
      Zadanium.moderation.all.createdObjects[
        target == "previous" ? --activeReportIndex : ++activeReportIndex
      ];

    if (report && (report.data.removed || report.data.disabled))
      return this.GetSwitchableReport(activeReportIndex, target);

    if (!report && target == "next") {
      const previousLastId = Zadanium.moderation.all.data.lastId;

      Zadanium.moderation.all.getContent();

      const isNewItemLoad = await WaitForObject(`
      Zadanium.moderation.all.elements.contentThrobber[0].classList.contains("calm") || undefined
      `);

      if (
        isNewItemLoad &&
        previousLastId != Zadanium.moderation.all.data.lastId
      )
        return this.GetSwitchableReport(--activeReportIndex, target);
    }

    return Promise.resolve(report);
  }
}
