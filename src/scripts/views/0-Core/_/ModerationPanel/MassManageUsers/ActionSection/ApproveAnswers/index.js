import ActionSection from "../";
import InfoBar from "./InfoBar";

/**
 * @type {import("../../../../../controllers/System").default}
 */
let System;
let SetSystem = () => !System && (System = window.System);

export default class ApproveAnswers extends ActionSection {
  constructor(main) {
    SetSystem();

    /**
     * @type {import("../index").renderDetails}
     */
    let renderDetails = {
      content: {
        text: System.data.locale.core.massManageUsers.sections.actionButton.approveAnswers.title,
        style: " sg-text--mint-dark"
      },
      actionButton: {
        ...System.data.locale.core.massManageUsers.sections.actionButton.approveAnswers,
        style: "sg-button-secondary--inverse"
      }
    }

    super(main, renderDetails);

    /**
     * @type {{id: number, infoBar: InfoBar}[]}
     */
    this.answersWaitingForApproval = [];

    this.RenderContent();
    this.RenderStopButton();
    this.RenderUserList();
    this.BindHandlers();
  }
  RenderContent() {
    this.$content = $(`
    <div class="sg-actions-list sg-actions-list--no-wrap sg-actions-list--to-top sg-actions-list--centered">
      <div class="sg-actions-list__hole sg-actions-list__hole--10-em">
        <div class="sg-content-box">
          <div class="sg-content-box__content sg-content-box__content--full sg-content-box__content--with-centered-text">
            <button class="sg-button-secondary">${System.data.locale.common.start}</button>
          </div>
        </div>
      </div>
    </div>`);

    this.$startButton = $("button", this.$content);
    this.$buttonContainer = $(".sg-content-box__content", this.$content);

    this.$content.appendTo(this.$contentContainer);
  }
  RenderStopButton() {
    this.$stopButton = $(`<button class="sg-button-secondary sg-button-secondary--peach">${System.data.locale.common.stop}</button>`);
  }
  RenderUserList() {
    this.$userListContainer = $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--grow">
      <div class="sg-content-box__actions sg-textarea sg-textarea--auto-height sg-textarea--max1000 sg-textarea--min-width-30em sg-textarea--resizable-vertical sg-actions-list--space-evenly"></div>
    </div>`);

    this.$userList = $(".sg-content-box__actions", this.$userListContainer);
    this.$userListContainer.appendTo(this.$content);
  }
  BindHandlers() {
    this.$startButton.click(this.Start.bind(this));
    //this.$stopButton.click(this.StopDeleting.bind(this));
  }
  Start() {
    this.SetUserIdList();

    if (this.userIdList && confirm(System.data.locale.common.notificationMessages.areYouSure)) {
      this.fetchingStarted = true;
      this.approvingStarted = true;

      this.ShowStopButton();
      this.TryToStart();
      //this._loop_TryToStart = setInterval(this.TryToStart.bind(this), 1000);
    }
  }
  ShowStopButton() {
    this.HideStartButton();
    this.$stopButton.appendTo(this.$buttonContainer);
  }
  HideStartButton() {
    this.main.HideElement(this.$startButton);
  }
  HideStopButton() {
    this.main.HideElement(this.$stopButton);
    this.ShowStartButton();
  }
  ShowStartButton() {
    this.$startButton.appendTo(this.$buttonContainer);
  }
  async TryToStart() {
    if (this.fetchingStarted) {
      let user = this.PickUser();

      if (user) {
        user.infoBar = new InfoBar(user, this);

        user.Move$To$(this.$userList);
        user.FullBoxView();
        user.ShowSmallSpinner();
        user.ShowInfoBar();

        await user.infoBar.promise;

        this.TryToStart();
      }
    }
  }
  StartApproving() {
    if (this.fetchingStarted) {
      this.TryToApprove();
    }
  }
  async TryToApprove() {
    let answer = this.answersWaitingForApproval.shift();

    if (answer) {
      await System.TestDelay();
      let resApprove = { success: true };
      console.log(answer, "approved");

      answer.infoBar.numberOfApprovedAnswers++;

      answer.infoBar.PrintNumberOfApprovedAnswers();
      this.TryToApprove();
    }
  }
  SectionOpened() {
    /* let idList = Object.keys(this.main.users);

    idList.forEach(id => {
      let user = this.main.users[id];
      user.Move$To$(this.$userList);
      user.FullBoxView();
      user.HideCheckbox();
    }) */
  }
}
