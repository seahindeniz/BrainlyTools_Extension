import { ButtonRound } from "@/scripts/components/style-guide";
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
    this.leftButton = ButtonRound({
      icon: "arrow_left",
      size: "xlarge",
      color: "blue",
      filled: true,
      className: "switch-button switch-button--left",
    });
    this.rightButton = ButtonRound({
      icon: "arrow_right",
      size: "xlarge",
      color: "blue",
      filled: true,
      className: "switch-button switch-button--right",
    });

    this.buttonContainer.prepend(this.leftButton);
    this.buttonContainer.append(this.rightButton);
  }
  BindHandlers() {
    document.addEventListener("keyup", this.KeyPressed.bind(this));
    this.leftButton
      .addEventListener("click", this.SwitchPreviousReport.bind(this));
    this.rightButton
      .addEventListener("click", this.SwitchNextReport.bind(this));

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
    let toplayer = this.main.toplayerZdnObject.elements.main[0];

    if (
      !IsVisible(toplayer) ||
      (
        event.target &&
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement ||
        event.target instanceof HTMLOptionElement ||
        event.target instanceof HTMLTextAreaElement
      )
    )
      return;

    if (event.code == "Escape")
      this.CloseToplayer();
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
    let lastActiveReport = this.main.main.lastActiveReport;

    if (this.switching || !lastActiveReport)
      return;

    this.switching = true;

    let lastActiveReportHash = lastActiveReport.elements.main[0]
      .getAttribute("objecthash");
    let lastActiveReportIndex = Zadanium.moderation.all.createdObjects
      .findIndex(
        /**
         * @param {import("../ReportBoxEnhancer/Report").ZdnObject} object
         */
        object => {
          let currentHash = object.elements.main[0]
            .getAttribute("objecthash");
          return lastActiveReportHash == currentHash
        });

    let switchableReport = await this.GetSwitchableReport(
      lastActiveReportIndex, target);

    if (!switchableReport) {
      this.switching = false;

      return this.main.toplayerZdnObject
        .setMessage("There is no report left");
    }

    this.CloseToplayer();
    this.main.toplayerZdnObject.show();
    switchableReport.elements.openToplayerButton.click();
  }
  GetActiveModerationToplayer() {
    /**
     * @type {import("../ReportBoxEnhancer/Report").ZdnObject}
     */
    let activeModerationToplayer = Zadanium.toplayer.createdObjects
      .find(
        /**
         * @param {import("../ReportBoxEnhancer/Report").ZdnObject} object
         */
        object => {
          return object.data.visible && !!object.data.timeInterval
        });

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
    let report = Zadanium.moderation.all.createdObjects[
      target == "previous" ? --activeReportIndex : ++activeReportIndex
    ];

    if (report && (report.data.removed || report.data.disabled))
      return this.GetSwitchableReport(activeReportIndex, target);

    if (
      !report && target == "next"
    ) {
      let previousLastId = Zadanium.moderation.all.data.lastId;

      Zadanium.moderation.all.getContent();

      let isNewItemLoad = await WaitForObject(`
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
