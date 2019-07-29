let System = require("../../../../../helpers/System");

export default class User {
  /**
   * @param {import("../../../../../controllers/Req/Brainly/Action/index").User} details
   * @param {import("./index").default} main
   */
  constructor(details, main) {
    this.details = details;
    this.main = main;

    if (typeof System == "function")
      System = System();

    this.Render();
    this.RenderInfoBar();
    this.RenderSpinner();
    this.RenderSmallSpinner();
    this.BindHandlers();
  }
  Render() {
    let separatedPoints = this.details.points.toLocaleString();
    let avatar = System.prepareAvatar(this.details);
    let profileLink = System.createProfileLink(this.details);
    this.$ = $(`
    <div class="sg-spinner-container sg-spinner-container--spaced">
      <label class="sg-box sg-box--xxsmall-padding sg-box--no-min-height sg-box--gray-secondary-lightest sg-box--no-border sg-flex--margin-top-xxs sg-flex--margin-bottom-xxs">
        <div class="sg-box__hole">
          <div class="sg-actions-list">
            <div class="sg-actions-list__hole">
              <div class="sg-checkbox">
                <input type="checkbox" class="sg-checkbox__element">
                <label class="sg-checkbox__ghost">
                  <div class="sg-icon sg-icon--adaptive sg-icon--x10">
                    <svg class="sg-icon__svg">
                      <use xlink:href="#icon-check"></use>
                    </svg>
                  </div>
                </label>
              </div>
            </div>
            <div class="sg-actions-list__hole">
              <div class="sg-avatar sg-avatar--spaced">
                <a href="${profileLink}" target="_blank">
                  <img class="sg-avatar__image" src="${avatar}">
                </a>
              </div>
            </div>
            <div class="sg-actions-list__hole sg-actions-list__hole--grow">
              <div class="sg-content-box">
                <div class="sg-content-box__content sg-content-box__content--full">
                  <div class="sg-actions-list">
                    <div class="sg-actions-list__hole">
                      <a href="${profileLink}" target="_blank" class="sg-text sg-text--link-unstyled sg-text--bold">
                        <span class="sg-text sg-text--small sg-text--gray sg-text--bold">${this.details.nick}</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="sg-content-box__content sg-content-box__content--full">
                  <div class="sg-actions-list">
                    <div class="sg-actions-list__hole">
                      <span class="sg-text sg-text--xsmall sg-text--gray" title="${System.data.locale.common.userHasNPoints.replace("%{n}", separatedPoints)}">${System.data.locale.common.shortPoints}: ${separatedPoints}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>`);

    this.$box = $("> .sg-box", this.$);
    this.$checkbox = $("input", this.$);
    this.$checkboxHole = $(".sg-box__hole > .sg-actions-list > .sg-actions-list__hole:nth-child(1)", this.$);
    this.$checkboxContainer = this.$checkboxHole.parent();
    this.$smallSpinnerContainer = $(".sg-content-box__content:nth-child(1) > .sg-actions-list", this.$);
    this.$nickContainer = $(".sg-content-box", this.$);
  }
  RenderInfoBar() {
    this.$infoBarContainer = $(`<div class="sg-content-box__content sg-content-box__content--full"></div>`);
  }
  RenderSpinner() {
    this.$spinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner"></div>
    </div>`);
  }
  RenderSmallSpinner() {
    this.$smallSpinner = $(`
    <div class="sg-actions-list__hole">
      <div class="sg-spinner sg-spinner--xsmall"></div>
    </div>`);
  }
  ShowSpinner() {
    this.$spinner.appendTo(this.$);
  }
  HideSpinner() {
    this.main.HideElement(this.$spinner);
  }
  BindHandlers() {
    this.$checkbox.change(this.CheckboxChanged.bind(this));
  }
  CheckboxChanged() {
    this.main.UserCheckboxChanged(this);
  }
  ShowCheckbox() {
    this.$checkboxHole.prependTo(this.$checkboxContainer);
  }
  HideCheckbox() {
    this.main.HideElement(this.$checkboxHole);
  }
  get isProcessing() {
    return this.$spinner.is(":visible");
  }
  BeBusy() {
    this.ShowSpinner();
    this.HideCheckbox();
  }
  UnBusy() {
    this.HideSpinner();
    this.ShowCheckbox();
  }
  ChangeBoxColor(replacement) {
    this.$box.addClass(replacement);
    this.$box.removeClass("sg-box--gray-secondary-lightest");
  }
  /**
   * @param {JQuery<HTMLElement>} $targetElement
   */
  Move$To$($targetElement) {
    delete this.main.users[this.details.id];

    this.HideSpinner();
    this.$.appendTo($targetElement);
    this.main.UpdateNumbers();
    //this.main.ToggleUserList();

    return this.$
  }
  FullBoxView() {
    this.$.addClass("sg-box--full sg-spinner-container--spaced");
    this.$box.addClass("sg-box--full");
  }
  ShowSmallSpinner() {
    this.$smallSpinner.appendTo(this.$smallSpinnerContainer);
  }
  HideSmallSpinner() {
    this.main.HideElement(this.$smallSpinner);
  }
  ShowInfoBar() {
    this.$infoBarContainer.appendTo(this.$nickContainer);
  }
  HideInfoBar() {
    this.main.HideElement(this.$infoBarContainer);
  }
}
