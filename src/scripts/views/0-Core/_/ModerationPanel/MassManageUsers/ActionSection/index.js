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

    /**
     * @type {Object<string, import("../User").default>}
     */
    this.users = {};
    /**
     * @type {number[]}
     */
    this.userIdList = [];

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
  /* SetUserIdList() {
    this.userIdList = this.main.MakeListedUsersBusy();
  } */
  PickUser() {
    let id = this.userIdList.shift();

    if (id)
      return this.users[id];
  }
  SetUsers() {
    let listedUserIdList = this.main.MakeListedUsersBusy();

    if (listedUserIdList)
      this.userIdList = [
        ...listedUserIdList,
        ...this.userIdList
      ];
    this.userIdList = [...new Set(this.userIdList)];

    if (this.userIdList.length > 0)
      this.userIdList.slice(0).forEach((id) => {
        if (!this.users[id])
          this.users[id] = this.main.users[id];
        else {
          let i = this.userIdList.indexOf(id);

          if (i !== -1) {
            this.userIdList.splice(i, 1);
            this.main.RemoveUsersById([id]);
          }
        }
      });
  }
}
