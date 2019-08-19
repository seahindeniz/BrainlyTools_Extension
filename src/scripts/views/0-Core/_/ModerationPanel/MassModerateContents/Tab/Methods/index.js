import Tab from "..";
import { Button, ContentBoxContent, Spinner, SpinnerContainer } from "../../../../../../../components/style-guide";
import IsVisible from "../../../../../../../helpers/IsVisible";
import ResultsSection from "./_/ResultsSection";

let System = require("../../../../../../../helpers/System");

export default class Methods extends Tab {
  /**
   * @typedef {import("../../../../../../../components/style-guide/Button").Properties} ButtonProperties
   * @param {import("../../index").default} main
   * @param {{tabButton: ButtonProperties, restrictions?: Object<string, string[]>, startButton?: ButtonProperties}} details
   */
  constructor(main, details) {
    super(main, {
      ...details,
      contentContainer: main.$methodsContainer,
      buttonsContainer: main.$actionListOfMethodsSection,
      tabButton: {
        activeType: "link-button-mint",
        container: ContentBoxContent({
          full: true,
          spacedBottom: "small"
        }),
        props: {
          type: "link-button",
          size: "xsmall",
          ...details.tabButton
        }
      }
    });

    if (typeof System == "function")
      // @ts-ignore
      System = System();

    this.name = "method";
    this.started = false;
    this.restrictions = details.restrictions;
    /**
     * @type {HTMLElement}
     */
    this.container;

    this.RenderStopButton();
    this.RenderStartButton();
    this.RenderContinueButton();
    this.RenderTabButtonSpinner();
    this.RenderActionButtonSpinner();
    this.RenderButtonSpinnerContainer();
    this.RenderResultsSection();
    this.BindHandlers();
  }
  RenderStopButton() {
    this.stopButton = Button({
      type: "destructive",
      html: System.data.locale.common.stop
    });
  }
  RenderStartButton() {
    this.startButton = Button({
      type: "primary-mint",
      html: System.data.locale.common.start,
      ...this.details.startButton
    });
  }
  RenderContinueButton() {
    this.continueButton = Button({
      type: "primary-blue",
      html: System.data.locale.common.continue
    });
  }
  RenderTabButtonSpinner() {
    this.tabButtonSpinner = Spinner({
      size: "xxsmall"
    });
  }
  RenderActionButtonSpinner() {
    this.actionButtonSpinner = Spinner({
      size: "small",
      overlay: true
    });
  }
  RenderButtonSpinnerContainer() {
    this.actionButtonSpinnerContainer = SpinnerContainer({
      children: this.startButton
    });
  }
  RenderResultsSection() {
    this.resultsSection = new ResultsSection(this);
  }
  BindHandlers() {
    this.startButton.addEventListener("click", this.StartModerating.bind(this));
    this.stopButton.addEventListener("click", this.StopModerating.bind(this));
    this.continueButton.addEventListener("click", this.ContinueModerating.bind(this))
  }
  async StartModerating() {
    console.log("start moderating");
    this.ShowActionButtonSpinner();
    await System.Delay(50);

    if (!confirm(System.data.locale.common.notificationMessages.areYouSure))
      return this.HideActionButtonSpinner();

    this.started = true;
    this.idList = this.main.active.input.ShiftIdList();
    console.log(this.idList);

    this.ContinueModerating();
  }
  ContinueModerating() {
    this.started = true;

    this.ShowStopButton();
    this.HideStartButton();
    this.HideContinueButton();
    this.ShowTabButtonSpinner();
    this.HideActionButtonSpinner();
    this.ShowResultsSection();

    this.TryToModerate();
    this._loop_Moderate = setInterval(this.TryToModerate.bind(this), 1000);
  }
  TryToModerate() {
    console.log("try to moderate");
    if (!this.started)
      return this.StopModerating();

    for (let i = 0; i < 7; i++) {
      let id = this.idList.shift();

      if (!id)
        return this.StopModerating();

      this.Moderate(id);
    }
  }
  /**
   * @param {number} id
   */
  Moderate(id) {
    throw `No method specified to moderate "${id}"`;
  }
  StopModerating() {
    console.log("stop moderating");
    this.started = false;

    clearInterval(this._loop_Moderate);

    if (this.idList.length > 0)
      this.ShowContinueButton();
    else
      this.HideActionButtonSpinnerContainer();

    this.HideButtonSpinner();
    this.HideStopButton();
    this._Show();
  }
  ShowTabButtonSpinner() {
    if (!IsVisible(this.tabButtonSpinner))
      // @ts-ignore
      this.tabButton.ChangeIcon(this.tabButtonSpinner);
  }
  HideButtonSpinner() {
    if (IsVisible(this.tabButtonSpinner)) {
      this.main.HideElement(this.tabButtonSpinner);
      this.tabButton.ChangeIcon();
    }
  }
  ShowActionButtonSpinnerContainer() {
    this.main.modal.actions.appendChild(this.actionButtonSpinnerContainer);
  }
  HideActionButtonSpinnerContainer() {
    this.main.HideElement(this.actionButtonSpinnerContainer);
  }
  ShowStartButton() {
    if (IsVisible(this.startButton)) return;

    this.ShowActionButtonSpinnerContainer();
    this.actionButtonSpinnerContainer.appendChild(this.startButton);
  }
  HideStartButton() {
    this.main.HideElement(this.startButton);
  }
  ShowStopButton() {
    if (IsVisible(this.stopButton)) return;

    this.ShowActionButtonSpinnerContainer();
    this.actionButtonSpinnerContainer.appendChild(this.stopButton);
  }
  HideStopButton() {
    this.main.HideElement(this.stopButton);
  }
  ShowContinueButton() {
    if (IsVisible(this.continueButton)) return;

    this.ShowActionButtonSpinnerContainer();
    this.actionButtonSpinnerContainer.appendChild(this.continueButton);
  }
  HideContinueButton() {
    this.main.HideElement(this.continueButton);
  }
  ShowActionButtonSpinner() {
    this.actionButtonSpinnerContainer.appendChild(this.actionButtonSpinner);
  }
  HideActionButtonSpinner() {
    this.main.HideElement(this.actionButtonSpinner);
  }
  ShowResultsSection() {
    this.container.append(this.resultsSection.container);
  }
  HideResultsSection() {
    this.main.HideElement(this.resultsSection.container);
  }
  _Show() {}
  _Hide() {
    this.HideActionButtonSpinnerContainer();
  }
}
