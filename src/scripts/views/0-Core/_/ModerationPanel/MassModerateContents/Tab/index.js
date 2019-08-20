import { Button } from "../../../../../../components/style-guide";
/**
 * @typedef {import("../../../../../../components/style-guide/Button").Properties} ButtonProperties
 * @typedef {{contentContainer?: HTMLElement, buttonsContainer: HTMLElement, tabButton: {activeType: import("../../../../../../components/style-guide/Button").Type, container: HTMLElement, props: ButtonProperties}, restrictions?: Object<string, string[]>} & Object<string, *>} Details
 */
export default class Tab {
  /**
   * @param {import("../index").default} main
   * @param {Details} details
   */
  constructor(main, details) {
    this.main = main;
    this.details = details;
    this.is = "";
    this.name = "";
    /**
     * @type {HTMLElement}
     */
    this.container;

    this.RenderActionButton();
    this.BindButtonListener();
  }
  RenderActionButton() {
    this.tabButton = Button(this.details.tabButton.props);
    this.tabButtonContainer = this.details.tabButton.container;

    this.details.tabButton.container.appendChild(this.tabButton)
    this.details.buttonsContainer.appendChild(this.tabButtonContainer);
  }
  BindButtonListener() {
    this.tabButton.addEventListener("click", this.Show.bind(this));
  }
  ShowActionButton() {
    this.details.buttonsContainer.appendChild(this.tabButtonContainer);
  }
  HideActionButton() {
    this.main.HideElement(this.tabButtonContainer);
  }
  _Show() {}
  _Hide() {}
  Show() {
    this._Hide();

    if (this == this.main.active[this.name])
      return this.HideActive();

    this.HideActive();

    if (this.container)
      this.details.contentContainer.appendChild(this.container);

    this.main.active[this.name] = this;

    this.tabButton.Active();
    this.tabButton.ChangeType(this.details.tabButton.activeType);
    this._Show();
  }
  HideActive() {
    /**
     * @type {import("../index").Tabs}
     */
    let activeTab = this.main.active[this.name];

    if (activeTab) {
      activeTab.tabButton.Inactive();
      activeTab.tabButton.ChangeType(this.details.tabButton.props.type);
      activeTab.Hide();

      this.main.active[this.name] = undefined;
    }
  }
  Hide() {
    this._Hide();

    if (this.container)
      this.main.HideElement(this.container);
  }
  ContentTypeSelected() {}
  InputSelected() {}
}
