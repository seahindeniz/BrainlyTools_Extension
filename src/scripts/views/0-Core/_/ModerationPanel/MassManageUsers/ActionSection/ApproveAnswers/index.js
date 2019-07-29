import ActionSection from "../";
import InfoBar from "./InfoBar";
import Action from "../../../../../../../controllers/Req/Brainly/Action";
import Button from "../../../../../../../components/Button";

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
        type: "link-button-mint"
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
    this.RenderStartButton();
    this.RenderStopButton();
    this.RenderContinueButton();
    this.BindHandlers();
  }
  RenderContent() {
    this.$content = $(`
    <div class="sg-actions-list sg-actions-list--no-wrap sg-actions-list--to-top sg-actions-list--centered">
      <div class="sg-actions-list__hole sg-actions-list__hole--10-em">
        <div class="sg-content-box">
          <div class="sg-content-box__content sg-content-box__content--full sg-content-box__content--with-centered-text"></div>
        </div>
      </div>
    </div>`);

    this.$buttonContainer = $(".sg-content-box__content", this.$content);

    this.$content.appendTo(this.$contentContainer);
  }
  RenderStartButton() {
    this.$startButton = Button({
      type: "primary-mint",
      size: "small",
      text: System.data.locale.common.start
    });

    this.$startButton.appendTo(this.$buttonContainer);
  }
  RenderStopButton() {
    this.$stopButton = Button({
      type: "destructive",
      size: "small",
      text: System.data.locale.common.stop
    });
  }
  RenderContinueButton() {
    this.$continueButton = Button({
      type: "primary-blue",
      size: "small",
      text: System.data.locale.common.continue
    });
  }
  BindHandlers() {
    this.$startButton.click(this.Start.bind(this));
    this.$stopButton.click(this.Stop.bind(this));
    this.$continueButton.click(this.Continue.bind(this));
  }
  Start() {
    this.SetUsers();

    if (this.userIdList) {
      if (this.userIdList.length > 0 && confirm(System.data.locale.common.notificationMessages.areYouSure)) {
        this.fetchingStarted = true;

        this.ShowUserList();
        this.Continue();
        //this._loop_TryToStart = setInterval(this.TryToStart.bind(this), 1000);
      } else
        this.main.UnBusyListedUsers();
    }
  }
  ShowUserList() {
    this.$userListContainer.appendTo(this.$content);
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
        //let resApprove = { success: true };await System.Delay(500);
        let resApprove = await new Action().ApproveAnswer(answer.id);

        this.CheckResponse(answer, resApprove);
      }
    }
  }
  CheckResponse(answer, resApprove) {
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
