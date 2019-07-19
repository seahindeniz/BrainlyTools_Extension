import ActionSection from ".";
import Action from "../../../../../../controllers/Req/Brainly/Action";
import Button from "../../../../../../components/Button";

let System = require("../../../../../../helpers/System");

export default class ChangePoints extends ActionSection {
  constructor(main) {
    System = System();
    /**
     * @type {import("./index").renderDetails}
     */
    let renderDetails = {
      content: {
        text: System.data.locale.core.massManageUsers.sections.changePoints.actionButton.title,
        style: "sg-text--gray"
      },
      actionButton: {
        ...System.data.locale.core.massManageUsers.sections.changePoints.actionButton,
        type: "link-button"
      }
    }

    super(main, renderDetails);

    this.started = false;
    this.openedConnection = 0;

    this.RenderContent();
    this.RenderStopButton();
    this.RenderApplyToAllButton();
    this.RenderApplyToSelectedButton();
    this.RenderPointsSpinner();
    this.RenderButtonSpinner();
    this.BindHandlers();
  }
  RenderContent() {
    this.$content = $(`
    <div class="sg-actions-list sg-actions-list--no-wrap sg-actions-list--to-top sg-actions-list--centered">
      <div class="sg-actions-list__hole">
        <div class="sg-actions-list sg-actions-list--centered">
          <div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
            <div class="sg-spinner-container sg-box--full">
              <input type="number" class="sg-input sg-input--full-width" placeholder="${System.data.locale.common.pointsWithExample.text}" title="${System.data.locale.common.pointsWithExample.title}">
            </div>
          </div>
          <div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
            <div class="sg-spinner-container"></div>
          </div>
          <div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
            <div class="sg-spinner-container"></div>
          </div>
        </div>
      </div>
    </div>`);

    this.$actionsContainer = $("> .sg-actions-list__hole", this.$content);

    this.$actionsList = $("> .sg-actions-list", this.$actionsContainer);
    this.$pointsContainerHole = $("> .sg-actions-list__hole:nth-child(1)", this.$actionsList);
    this.$pointsSpinnerContainer = $(" > .sg-spinner-container", this.$pointsContainerHole);
    this.$points = $("input", this.$pointsSpinnerContainer);
    this.$applyToAllButtonSpinnerContainer = $("> .sg-actions-list__hole:nth-child(2) > .sg-spinner-container", this.$actionsList);
    this.$applyToSelectedButtonSpinnerContainer = $("> .sg-actions-list__hole:nth-child(3) > .sg-spinner-container", this.$actionsList);

    this.$content.appendTo(this.$contentContainer);
  }
  RenderStopButton() {
    this.$stopButtonContainer = $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--space-bellow">
      <div class="sg-spinner-container"></div>
    </div>`);
    this.$stopButtonSpinnerContainer = $(".sg-spinner-container", this.$stopButtonContainer);
    this.$stopButton = Button({
      type: "destructive",
      size: "small",
      text: System.data.locale.common.stop
    });

    this.$stopButton.appendTo(this.$stopButtonSpinnerContainer);
  }
  RenderApplyToAllButton() {
    this.$applyToAllButton = Button({
      type: "primary-blue",
      size: "small",
      text: System.data.locale.core.massManageUsers.sections.changePoints.applyToAll
    });

    this.$applyToAllButton.appendTo(this.$applyToAllButtonSpinnerContainer);
  }
  RenderApplyToSelectedButton() {
    this.$applyToSelectedButton = Button({
      type: "primary-mint",
      size: "small",
      text: `${System.data.locale.core.massManageUsers.sections.changePoints.applyToSelected}&nbsp;&nbsp;`
    });
    let $badge = $(`
    <div class="sg-badge">
      <div class="sg-text sg-text--xsmall sg-text--bold ">0</div>
    </div>`);
    this.$numberOfSelectedUsers = $(".sg-text", $badge);

    $badge.appendTo(this.$applyToSelectedButton);
    this.$applyToSelectedButton.appendTo(this.$applyToSelectedButtonSpinnerContainer);
  }
  RenderPointsSpinner() {
    this.$pointsSpinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--xsmall"></div>
    </div>`);
  }
  RenderButtonSpinner() {
    this.$buttonSpinner = $(`
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--xsmall"></div>
    </div>`);
  }
  BindHandlers() {
    this.$applyToAllButton.click(this.ApplyPointsToAllUsers.bind(this));
    this.$applyToSelectedButton.click(this.ApplyPointsToSelectedUsers.bind(this));
    this.$stopButton.click(this.StopChangingPoints.bind(this));
  }
  ApplyPointsToAllUsers() {
    if (!this.started && this.IsPointsSpecified()) {
      this.SetUsers();

      if (this.userIdList && confirm(System.data.locale.core.massManageUsers.sections.changePoints.notificationMessages.doYouWantToGiveNPointsToAllListedUsers.replace("%{n}", this.points))) {
        this.ShowApplyToAllButtonSpinner();
        this.ApplyPointsToUsers();
      }
    }
  }
  IsPointsSpecified() {
    let points = this.points;

    if (!~~points) {
      if (/\b0{1,}\b/.test(points))
        this.main.modal.notification(System.data.locale.core.massManageUsers.sections.changePoints.notificationMessages.thereIsNoPointToGiveZeroPoints);
      else
        this.main.modal.notification(System.data.locale.core.massManageUsers.sections.changePoints.notificationMessages.oopsYouDidntSpecifyThePoints, "info");

      this.$points.focus();
    }

    return !!~~points;
  }
  get points() {
    return this.$points.val();
  }
  ShowApplyToAllButtonSpinner() {
    this.$buttonSpinner.appendTo(this.$applyToAllButtonSpinnerContainer);
  }
  ApplyPointsToUsers() {
    this.started = true;

    this.ShowUserList();
    this.ShowStopButton();
    this.ShowPointsSpinner();
    this.SmallActionsContainer();
    this.ToggleButtons();

    this.TryToApply();
    this._loop_TryToApply = setInterval(this.TryToApply.bind(this), 1000);

  }
  ShowUserList() {
    this.$userListContainer.appendTo(this.$content);
  }
  ShowStopButton() {
    this.$stopButtonContainer.insertAfter(this.$pointsContainerHole);
  }
  ShowPointsSpinner() {
    this.$pointsSpinner.appendTo(this.$pointsSpinnerContainer);
  }
  ToggleButtons(enable = false) {
    [
      this.$applyToAllButton,
      this.$applyToSelectedButton
    ].forEach($button => enable ? $button.Enable() : $button.Disable());
  }
  SmallActionsContainer() {
    this.$actionsContainer.addClass("sg-actions-list__hole--20-em");
  }
  TryToApply() {
    if (this.started)
      for (let i = 0; i < 1; i++) {
        let user = this.PickUser();

        if (!user)
          return this.Finish();

        this.ApplyPointsToUser(user);
      }
  }
  Finish() {
    this.StopChangingPoints();
    this.main.modal.notification(System.data.locale.common.allDone, "success");
  }
  StopChangingPoints(events) {
    this.started = false;

    this.HideStopButton();
    this.HidePointsSpinner();
    this.HideButtonSpinner();
    this.ToggleButtons(true);
    clearInterval(this._loop_TryToApply);

    if (events) {}
  }
  HideStopButton() {
    this.main.HideElement(this.$stopButtonContainer);
  }
  HidePointsSpinner() {
    this.main.HideElement(this.$pointsSpinner);
  }
  HideButtonSpinner() {
    this.main.HideElement(this.$buttonSpinner);
  }
  /**
   * @param {import("../User").default} user
   */
  async ApplyPointsToUser(user) {
    let points = this.points;

    //await System.Delay();
    await new Action().AddPoint(user.details.id, points);
    this.PointsApplied(user);
  }
  /**
   * @param {import("../User").default} user
   */
  PointsApplied(user) {
    user.Move$To$(this.$userList);
  }
  ApplyPointsToSelectedUsers() {
    if (!this.started && this.IsPointsSpecified()) {
      this.SetUsers(true);

      if (this.userIdList && confirm(System.data.locale.core.massManageUsers.sections.changePoints.notificationMessages.doYouWantToGiveNPointsToSelectedUsers.replace("%{n}", this.points))) {
        this.ShowApplyToSelectedButtonSpinner();
        this.ApplyPointsToUsers();
      }
    }
  }
  ShowApplyToSelectedButtonSpinner() {
    this.$buttonSpinner.appendTo(this.$applyToSelectedButtonSpinnerContainer);
  }
  /**
   * @param {import("../User").default} user
   * @param {string[]} idsOfSelectedUsers
   */
  UserCheckboxChanged(user, idsOfSelectedUsers) {
    this.UpdateNumberOfSelectedUsers(idsOfSelectedUsers.length);
  }
  UpdateNumberOfSelectedUsers(n) {
    this.$numberOfSelectedUsers.text(n);
  }
}
