/**
 * @typedef {{content: {text: string, style: string}, actionButton: {text: string, title: string style: string}}} renderDetails
 */
export default class ActionSection {
  /**
   * @param {import("../index").default} main
   * @param {renderDetails} renderDetails
   */
  constructor(main, renderDetails) {
    this.main = main;
    this.renderDetails = renderDetails;

    this.Render();
    this.RenderButtonContainer();
    this.BindButtonHandler();
  }
  Render() {
    this.$ = $(`
    <div class="sg-content-box sg-content-box--spaced">
      <div class="sg-content-box__title sg-content-box__title--spaced-top sg-content-box__title--spaced-small">
        <h2 class="sg-text sg-text--bold ${this.renderDetails.content.style}">${this.renderDetails.content.text}</h2>
      </div>
      <div class="sg-content-box__content"></div>
      <div class="sg-content-box__actions"></div>
    </div>`);

    this.$contentContainer = $("> .sg-content-box__content", this.$);
    this.$actionsContainer = $("> .sg-content-box__actions", this.$);
  }
  RenderButtonContainer() {
    this.$actionButtonContainer = $(`<div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
      <button class="sg-button-secondary ${this.renderDetails.actionButton.style} sg-button-secondary--full-width" title="${this.renderDetails.actionButton.title}">${this.renderDetails.actionButton.text}</button>
    </div>`);

    this.$actionButton = $("button", this.$actionButtonContainer);
  }
  BindButtonHandler() {
    this.$actionButton.click(this.ShowSection.bind(this));
  }
  ShowSection() {
    if (this.main.activeAction) {
      this.main.activeAction.HideSection();

      if (this.main.activeAction == this) {
        this.main.activeAction = undefined;

        return this.main.HideActionsSectionSeparator();
      }
    }

    this.main.activeAction = this;

    this.main.ShowActionsSectionSeparator();
    this.$.appendTo(this.main.$actionsSection);

    if (this.SectionOpened)
      this.SectionOpened();
  }
  HideSection() {
    this.main.HideElement(this.$);
  }
  SetUserIdList() {
    this.userIdList = this.main.MakeListedUsersBusy();
  }
  PickUser() {
    let id = this.userIdList.shift();

    if (id)
      return this.main.users[id];
  }
}
