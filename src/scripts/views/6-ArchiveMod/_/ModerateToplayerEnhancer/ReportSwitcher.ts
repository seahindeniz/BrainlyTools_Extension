/* eslint-disable no-param-reassign */
import IsVisible from "@root/helpers/IsVisible";
import WaitForObject from "@root/helpers/WaitForObject";
import { Button, Icon } from "@style-guide";
import type ModerateToplayerEnhancerClassType from ".";

export default class ReportSwitcher {
  main: ModerateToplayerEnhancerClassType;
  switching: boolean;
  leftButton: Button;
  rightButton: Button;
  buttonContainer: HTMLDivElement;

  constructor(main: ModerateToplayerEnhancerClassType) {
    this.main = main;
    this.switching = false;
    this.buttonContainer = main.containerCenterMod
      .firstElementChild as HTMLDivElement;

    this.RenderButtons();
    this.BindHandlers();
  }

  RenderButtons() {
    this.leftButton = new Button({
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({ type: "arrow_left", size: 40 }),
      size: "xl",
      className: "switch-button switch-button--left",
    });
    this.rightButton = new Button({
      iconOnly: true,
      type: "solid-blue",
      icon: new Icon({ type: "arrow_right", size: 40 }),
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

  async CheckConnection(jqXHR: JQueryXHR, settings: JQueryAjaxSettings) {
    jqXHR.always((_jqXHR, status) => {
      if (
        status === "success" &&
        settings.url === "/api/28/moderation_new/get_content"
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
  KeyPressed(event: {
    ctrlKey: any;
    altKey: any;
    shiftKey: any;
    metaKey: any;
    target: any;
    code: string;
  }) {
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

    if (event.code === "Escape") this.CloseToplayer();
    else if (event.code === "KeyA" || event.code === "ArrowLeft")
      this.SwitchPreviousReport();
    else if (event.code === "KeyD" || event.code === "ArrowRight")
      this.SwitchNextReport();
  }

  CloseToplayer() {
    this.main.toplayerZdnObject.elements.close.trigger("click");
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
  async SwitchReport(target: string) {
    const { lastActiveReport } = this.main.main;

    if (this.switching || !lastActiveReport) return;

    this.switching = true;

    const lastActiveReportHash = lastActiveReport.elements.main[0].getAttribute(
      "objecthash",
    );
    const lastActiveReportIndex = Zadanium.moderation.all.createdObjects.findIndex(
      (
        /**
         * @param {import("../ReportBoxEnhancer/Report").ZdnObject} object
         */
        object: {
          elements: { main: { getAttribute: (arg0: string) => any }[] };
        },
      ) => {
        const currentHash = object.elements.main[0].getAttribute("objecthash");
        return lastActiveReportHash === currentHash;
      },
    );

    const switchableReport = await this.GetSwitchableReport(
      lastActiveReportIndex,
      target,
    );

    if (!switchableReport) {
      this.switching = false;

      this.main.toplayerZdnObject.setMessage("There is no report left");

      return;
    }

    this.CloseToplayer();
    this.main.toplayerZdnObject.show();
    switchableReport.elements.openToplayerButton.click();
  }

  async GetSwitchableReport(activeReportIndex: number, target: string) {
    /**
     * @type {import("../ReportBoxEnhancer/Report").ZdnObject}
     */
    const report =
      Zadanium.moderation.all.createdObjects[
        target === "previous" ? --activeReportIndex : ++activeReportIndex
      ];

    if (report && (report.data.removed || report.data.disabled))
      return this.GetSwitchableReport(activeReportIndex, target);

    if (!report && target === "next") {
      const previousLastId = Zadanium.moderation.all.data.lastId;

      Zadanium.moderation.all.getContent();

      const isNewItemLoad = await WaitForObject(`
      Zadanium.moderation.all.elements.contentThrobber[0].classList.contains("calm") || undefined
      `);

      if (
        isNewItemLoad &&
        previousLastId !== Zadanium.moderation.all.data.lastId
      )
        return this.GetSwitchableReport(--activeReportIndex, target);
    }

    return Promise.resolve(report);
  }
}
