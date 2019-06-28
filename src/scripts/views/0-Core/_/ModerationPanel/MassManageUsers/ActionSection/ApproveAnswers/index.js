import ActionSection from "../";
import InfoBar from "./InfoBar";
import Action from "../../../../../../../controllers/Req/Brainly/Action";

/**
 * @typedef {{id: number, infoBar: InfoBar}} Answer
 * @type {import("../../../../../../../controllers/System").default}
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
        text: System.data.locale.core.massManageUsers.sections.approveAnswers.actionButton.title,
        style: " sg-text--mint-dark"
      },
      actionButton: {
        ...System.data.locale.core.massManageUsers.sections.approveAnswers.actionButton,
        style: "sg-button-secondary--mint-inverse"
      }
    }

    super(main, renderDetails);

    this.stopped = false;
    this.approvalStarted = false;
    /**
     * @type {Answer[]}
     */
    this.answersWaitingForApproval = [];

    this.RenderContent();
    this.RenderStopButton();
    this.RenderContinueButton();
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
  RenderContinueButton() {
    this.$continueButton = $(`<button class="sg-button-secondary sg-button-secondary--alt">${System.data.locale.common.continue}</button>`);
  }
  RenderUserList() {
    this.$userListContainer = $(`
    <div class="sg-actions-list__hole sg-actions-list__hole--grow">
      <div class="sg-content-box__actions sg-textarea sg-textarea--auto-height sg-textarea--max1000 sg-textarea--min-width-25em sg-textarea--resizable-vertical sg-actions-list--space-evenly"></div>
    </div>`);

    this.$userList = $(".sg-content-box__actions", this.$userListContainer);
    this.$userListContainer.appendTo(this.$content);
  }
  BindHandlers() {
    this.$startButton.click(this.Start.bind(this));
    this.$stopButton.click(this.Stop.bind(this));
    this.$continueButton.click(this.Continue.bind(this));
  }
  Start() {
    this.SetUsers();

    if (this.userIdList) {
      if (this.userIdList > 0 && confirm(System.data.locale.common.notificationMessages.areYouSure)) {
        this.fetchingStarted = true;

        this.Continue();
        //this._loop_TryToStart = setInterval(this.TryToStart.bind(this), 1000);
      } else
        this.main.UnBusyListedUsers();
    }
  }
  Continue() {
    this.stopped = false;

    this.ShowStopButton();
    this.TryToStart();
    this.StartApproving();
  }
  ShowStopButton() {
    this.HideStartButton();
    this.HideContinueButton();
    this.$stopButton.appendTo(this.$buttonContainer);
  }
  HideStartButton() {
    this.main.HideElement(this.$startButton);
  }
  HideContinueButton() {
    this.main.HideElement(this.$continueButton);
  }
  HideStopButton() {
    this.main.HideElement(this.$stopButton);
    this.ShowContinueButton();
  }
  ShowContinueButton() {
    this.$continueButton.appendTo(this.$buttonContainer);
  }
  ShowStartButton() {
    this.$startButton.appendTo(this.$buttonContainer);
  }
  async TryToStart() {
    try {

      if (this.fetchingStarted) {
        let user = this.PickUser();

        if (user) {
          if (!user.infoBar) {
            delete this.main.users[user.details.id];

            user.infoBar = new InfoBar(user, this);
          }

          user.Move$To$(this.$userList);
          user.FullBoxView();
          user.ShowInfoBar();

          if (!this.stopped)
            user.ShowSmallSpinner();

          await user.infoBar.promise;

          this.TryToStart();
        }
      }
    } catch (error) {
      console.log(error);

      if (error.msg)
        this.main.modal.notification(error.msg, "error");
    }
  }
  StartApproving() {
    if (!this._loopTryToApprove && !this.stopped) {
      this.approvalStarted = true;

      this.TryToApprove();

      this._loopTryToApprove = setInterval(this.TryToApprove.bind(this), 1000);
    }
  }
  async TryToApprove() {
    for (let i = 0; i < 7; i++) {
      let answer = this.answersWaitingForApproval.shift();

      if (!answer)
        this.StopApproving();
      else {
        //await System.Delay(10);
        let resApprove = await new Action().ApproveAnswer(answer.id); // { success: true };

        this.CheckResponse(resApprove);
      }
    }
  }
  CheckResponse(resApprove) {
    if (!resApprove || !resApprove.success && resApprove.exception_type) {
      this.main.modal.notification(resApprove.message || System.data.locale.common.notificationMessages.somethingWentWrong, "error");

      if (resApprove.exception_type == 1)
        this.Stop();
      else
        this.StopApproving();
    } else if (resApprove) {
      if (resApprove.success) {
        answer.infoBar.numberOfApprovedAnswers++;

        this.AnswerApproved(answer);
      } else
        answer.infoBar.numberOfAlreadyApprovedAnswers++;
    }
  }
  /**
   * @param {Answer} answer
   */
  AnswerApproved(answer) {
    answer.infoBar.PrintNumberOfApprovedAnswers();

    let numberOfTotalApprovedAnswers = answer.infoBar.numberOfApprovedAnswers + answer.infoBar.numberOfAlreadyApprovedAnswers;

    if (numberOfTotalApprovedAnswers == answer.infoBar.numberOfTotalAnswers) {
      answer.infoBar.approved = true;

      answer.infoBar.user.HideSmallSpinner();
      this.TryToStop();
    }
  }
  StopApproving() {
    this.approvalStarted = false;

    clearInterval(this._loopTryToApprove);
    this._loopTryToApprove = null;
  }
  TryToStop() {
    let userIdList = Object.keys(this.users);

    let isStillProcessing = userIdList.filter(id => {
      let user = this.users[id];

      return !user.infoBar || !user.infoBar.approved;
    });

    if (isStillProcessing.length == 0) {
      this.HideStopButton();
      this.HideContinueButton();
      this.ShowStartButton();
    }
  }
  Stop() {
    this.stopped = true;
    let userIdList = Object.keys(this.users);

    this.StopApproving();
    this.HideStopButton();
    userIdList.reverse().forEach(id => {
      let user = this.users[id];

      user.HideSmallSpinner();

      if (user.infoBar && !user.infoBar.approved)
        this.userIdList.unshift(id);
    })
  }
  SectionOpened() {}
}
